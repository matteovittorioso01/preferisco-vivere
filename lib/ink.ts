// ============================================================================
// Motore "inchiostro" — riconoscimento della scrittura a mano libera
// ----------------------------------------------------------------------------
// Lo studente scrive a mano: lettere degli atomi (C,O,N,H,S,P) + tratti per i
// legami. Noi NON addestriamo un modello da zero (servirebbero enormi dataset
// multi-calligrafia). Usiamo il riconoscitore $P (Vatavu, Anthony, Wobbrock,
// 2012): "gesti come nuvole di punti", template-based, ZERO training.
//
// Pipeline:
//   1. raggruppa i tratti in glifi (vicinanza spaziale + temporale)
//   2. distingue i tratti-legame (lunghi e dritti, fra due glifi)
//   3. riconosce ogni glifo-atomo via $P contro template generati a mano
//   4. assembla la molecola (atomi + legami, ordine 1/2/3 da tratti paralleli)
//
// Il risultato confluisce nello stesso evaluate() del motore chimico: la mano
// libera produce una Molecule "best-effort", che lo studente puo` correggere
// in modalita` "Costruisci". E` verifica, non riconoscimento open-ended.
// ============================================================================

import { Element, Molecule, BondOrder } from "@/lib/chem";

export interface Point {
  x: number;
  y: number;
}

/** Un tratto = sequenza di punti + tempi (per il raggruppamento temporale). */
export interface Stroke {
  points: Point[];
  t0: number;
  t1: number;
}

const NUM_POINTS = 32;

// soglie nello spazio del canvas (360 x 240)
const GROUP_GAP = 30; // px: distanza max per unire tratti nello stesso glifo
const GROUP_DT = 1000; // ms: intervallo max per unire tratti consecutivi
const BOND_MIN_LEN = 38; // px: lunghezza minima di un tratto-legame
const STRAIGHT = 0.82; // dritto se distanzaEstremi/lunghezzaPercorso >= soglia
const SNAP = 36; // px: aggancio estremo legame al centro di un atomo
const PARALLEL_MERGE = 16; // px: legami fra stessa coppia entro questa distanza -> ordine multiplo

// ---------------------------------------------------------------------------
// Geometria di base
// ---------------------------------------------------------------------------
const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

function pathLength(pts: Point[]): number {
  let d = 0;
  for (let i = 1; i < pts.length; i++) d += dist(pts[i - 1], pts[i]);
  return d;
}

function centroidOf(pts: Point[]): Point {
  const c = pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: c.x / pts.length, y: c.y / pts.length };
}

function straightness(pts: Point[]): number {
  const pl = pathLength(pts);
  if (pl === 0) return 1;
  return dist(pts[0], pts[pts.length - 1]) / pl;
}

/** distanza minima punto-punto fra due insiemi (gap fra due tratti). */
function setGap(a: Point[], b: Point[]): number {
  let min = Infinity;
  for (const p of a) for (const q of b) min = Math.min(min, dist(p, q));
  return min;
}

// ---------------------------------------------------------------------------
// Normalizzazione $P: ricampiona -> scala al box unitario -> centra sull'origine
// ---------------------------------------------------------------------------
function resampleOne(points: Point[], n: number): Point[] {
  if (points.length === 0) return [];
  if (points.length === 1) return Array.from({ length: n }, () => points[0]);
  const pts = points.map((p) => ({ ...p }));
  const I = pathLength(pts) / (n - 1) || 1;
  let D = 0;
  const out: Point[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const d = dist(pts[i - 1], pts[i]);
    if (D + d >= I) {
      const t = (I - D) / d;
      const q = {
        x: pts[i - 1].x + t * (pts[i].x - pts[i - 1].x),
        y: pts[i - 1].y + t * (pts[i].y - pts[i - 1].y),
      };
      out.push(q);
      pts.splice(i, 0, q);
      D = 0;
    } else {
      D += d;
    }
  }
  while (out.length < n) out.push(pts[pts.length - 1]);
  return out.slice(0, n);
}

/** Combina piu` tratti in esattamente n punti (proporzionale alla lunghezza,
 *  senza creare segmenti "fantasma" sui salti di penna). */
function combineToN(strokes: Point[][], n: number): Point[] {
  const valid = strokes.filter((s) => s.length > 0);
  if (valid.length === 0) return [];
  const lengths = valid.map((s) => Math.max(pathLength(s), 0.001));
  const total = lengths.reduce((a, b) => a + b, 0);
  let acc: Point[] = [];
  valid.forEach((s, i) => {
    const cnt = Math.max(2, Math.round((n * lengths[i]) / total));
    acc = acc.concat(resampleOne(s, cnt));
  });
  // forza esattamente n punti sotto-campionando/riempiendo per indice
  if (acc.length === n) return acc;
  if (acc.length > n) {
    const out: Point[] = [];
    for (let i = 0; i < n; i++) out.push(acc[Math.round((i * (acc.length - 1)) / (n - 1))]);
    return out;
  }
  while (acc.length < n) acc.push(acc[acc.length - 1]);
  return acc;
}

function normalize(strokes: Point[][]): Point[] {
  let pts = combineToN(strokes, NUM_POINTS);
  if (pts.length === 0) return [];
  // scala uniforme al box unitario (preserva proporzioni)
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const size = Math.max(maxX - minX, maxY - minY) || 1;
  pts = pts.map((p) => ({ x: (p.x - minX) / size, y: (p.y - minY) / size }));
  const c = centroidOf(pts);
  return pts.map((p) => ({ x: p.x - c.x, y: p.y - c.y }));
}

// ---------------------------------------------------------------------------
// $P: Greedy-Cloud-Match
// ---------------------------------------------------------------------------
function cloudDistance(pts: Point[], tmpl: Point[], start: number): number {
  const n = pts.length;
  const matched = new Array(n).fill(false);
  let sum = 0;
  let i = start;
  do {
    let min = Infinity;
    let index = -1;
    for (let j = 0; j < n; j++) {
      if (matched[j]) continue;
      const d = dist(pts[i], tmpl[j]);
      if (d < min) { min = d; index = j; }
    }
    if (index >= 0) matched[index] = true;
    const weight = 1 - ((i - start + n) % n) / n;
    sum += weight * min;
    i = (i + 1) % n;
  } while (i !== start);
  return sum;
}

function greedyCloudMatch(pts: Point[], tmpl: Point[]): number {
  const n = pts.length;
  if (n === 0 || tmpl.length !== n) return Infinity;
  const step = Math.max(1, Math.floor(Math.pow(n, 0.5)));
  let min = Infinity;
  for (let i = 0; i < n; i += step) {
    min = Math.min(min, cloudDistance(pts, tmpl, i), cloudDistance(tmpl, pts, i));
  }
  return min;
}

// ---------------------------------------------------------------------------
// Template dei simboli (generati a mano, zero dataset). Coordinate ~ [0,1].
// ---------------------------------------------------------------------------
function arc(cx: number, cy: number, r: number, a0: number, a1: number, n = 16): Point[] {
  return Array.from({ length: n }, (_, i) => {
    const a = a0 + (a1 - a0) * (i / (n - 1));
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}
function seg(x0: number, y0: number, x1: number, y1: number, n = 8): Point[] {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t };
  });
}

const PI = Math.PI;
interface Template { el: Element; strokes: Point[][] }

const RAW_TEMPLATES: Template[] = [
  { el: "O", strokes: [arc(0.5, 0.5, 0.45, 0, 2 * PI, 24)] },
  // C: cerchio aperto a destra (mantiene il lato sinistro)
  { el: "C", strokes: [arc(0.5, 0.5, 0.45, 0.35 * PI, 1.65 * PI, 22)] },
  // N: due verticali + diagonale
  { el: "N", strokes: [seg(0.2, 0.9, 0.2, 0.1), seg(0.2, 0.1, 0.8, 0.9), seg(0.8, 0.9, 0.8, 0.1)] },
  // H: due verticali + barra
  { el: "H", strokes: [seg(0.2, 0.1, 0.2, 0.9), seg(0.8, 0.1, 0.8, 0.9), seg(0.2, 0.5, 0.8, 0.5)] },
  // S: curva a S (punti di controllo + ricampionamento)
  {
    el: "S",
    strokes: [[
      { x: 0.75, y: 0.18 }, { x: 0.5, y: 0.1 }, { x: 0.3, y: 0.28 },
      { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.7 }, { x: 0.5, y: 0.9 }, { x: 0.25, y: 0.84 },
    ]],
  },
  // P: verticale + occhiello in alto a destra
  { el: "P", strokes: [seg(0.25, 0.9, 0.25, 0.1), arc(0.25, 0.3, 0.22, -0.5 * PI, 0.5 * PI, 12)] },
];

const TEMPLATES: { el: Element; cloud: Point[] }[] = RAW_TEMPLATES.map((t) => ({
  el: t.el,
  cloud: normalize(t.strokes),
}));

export interface GlyphResult {
  el: Element;
  distance: number; // piu` basso = piu` sicuro
}

/** Riconosce un glifo (uno o piu` tratti) come elemento. */
export function recognizeGlyph(strokes: Stroke[]): GlyphResult | null {
  const cloud = normalize(strokes.map((s) => s.points));
  if (cloud.length === 0) return null;
  let best: GlyphResult | null = null;
  for (const t of TEMPLATES) {
    const d = greedyCloudMatch(cloud, t.cloud);
    if (!best || d < best.distance) best = { el: t.el, distance: d };
  }
  return best;
}

// ---------------------------------------------------------------------------
// Raggruppamento dei tratti in glifi (spaziale + temporale)
// ---------------------------------------------------------------------------
interface Group {
  strokes: Stroke[];
  points: Point[]; // tutti i punti (per gap/centroide)
}

function isLongStraight(s: Stroke): boolean {
  return pathLength(s.points) >= BOND_MIN_LEN && straightness(s.points) >= STRAIGHT;
}

function groupStrokes(strokes: Stroke[]): Group[] {
  const sorted = [...strokes].sort((a, b) => a.t0 - b.t0);
  const groups: Group[] = [];
  for (const s of sorted) {
    // un tratto lungo e dritto e` quasi sempre un legame: parte da solo
    if (!isLongStraight(s)) {
      const last = groups[groups.length - 1];
      if (
        last &&
        s.t0 - last.strokes[last.strokes.length - 1].t1 < GROUP_DT &&
        setGap(s.points, last.points) < GROUP_GAP &&
        !last.strokes.every(isLongStraight) // non attaccarsi a un gruppo-legame
      ) {
        last.strokes.push(s);
        last.points = last.points.concat(s.points);
        continue;
      }
    }
    groups.push({ strokes: [s], points: [...s.points] });
  }
  return groups;
}

// ---------------------------------------------------------------------------
// Assemblaggio molecola dai tratti
// ---------------------------------------------------------------------------
export interface Recognition {
  molecule: Molecule;
  glyphs: { el: Element; distance: number; x: number; y: number }[];
  lowConfidence: boolean;
}

export function assembleMolecule(strokes: Stroke[]): Recognition {
  const groups = groupStrokes(strokes);

  // un gruppo e` un LEGAME se: singolo tratto, lungo e dritto
  const bondGroups: Group[] = [];
  const atomGroups: Group[] = [];
  for (const g of groups) {
    if (g.strokes.length === 1 && isLongStraight(g.strokes[0])) bondGroups.push(g);
    else atomGroups.push(g);
  }

  // atomi (centroide + riconoscimento elemento)
  const atomCentroids = atomGroups.map((g) => centroidOf(g.points));
  const glyphs = atomGroups.map((g, i) => {
    const r = recognizeGlyph(g.strokes);
    return {
      el: r?.el ?? "C",
      distance: r?.distance ?? Infinity,
      x: atomCentroids[i].x,
      y: atomCentroids[i].y,
    };
  });

  const atoms = glyphs.map((gl, i) => ({ id: i, el: gl.el, x: gl.x, y: gl.y }));

  // aggancia ogni tratto-legame ai due atomi piu` vicini ai suoi estremi
  const nearestAtom = (p: Point): number => {
    let best = -1, bestD = SNAP;
    atomCentroids.forEach((c, i) => {
      const d = dist(p, c);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  };

  interface RawBond { a: number; b: number; mid: Point }
  const raw: RawBond[] = [];
  for (const g of bondGroups) {
    const pts = g.strokes[0].points;
    const a = nearestAtom(pts[0]);
    const b = nearestAtom(pts[pts.length - 1]);
    if (a >= 0 && b >= 0 && a !== b) {
      raw.push({ a, b, mid: centroidOf(pts) });
    }
  }

  // fonde legami paralleli vicini fra la stessa coppia -> ordine 2/3
  const bonds: { id: number; a: number; b: number; order: BondOrder }[] = [];
  const used = new Array(raw.length).fill(false);
  let bondId = 0;
  for (let i = 0; i < raw.length; i++) {
    if (used[i]) continue;
    let count = 1;
    used[i] = true;
    for (let j = i + 1; j < raw.length; j++) {
      if (used[j]) continue;
      const samePair =
        (raw[i].a === raw[j].a && raw[i].b === raw[j].b) ||
        (raw[i].a === raw[j].b && raw[i].b === raw[j].a);
      if (samePair && dist(raw[i].mid, raw[j].mid) < PARALLEL_MERGE) {
        count++;
        used[j] = true;
      }
    }
    bonds.push({ id: bondId++, a: raw[i].a, b: raw[i].b, order: Math.min(3, count) as BondOrder });
  }

  const lowConfidence = glyphs.some((g) => g.distance > 2.2) || atoms.length === 0;

  return { molecule: { atoms, bonds }, glyphs, lowConfidence };
}
