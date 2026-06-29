// ============================================================================
// Motore chimico didattico — modello molecola, confronto e feedback
// ----------------------------------------------------------------------------
// L'idea chiave dell'MVP: NON proviamo a "indovinare" cosa ha disegnato lo
// studente nel vuoto (problema aperto e difficile). In un esercizio conosciamo
// gia` la struttura attesa, quindi il compito e` VERIFICARE il disegno contro
// l'atteso e dire *dove* ha sbagliato. Verificare e` molto piu` facile e
// affidabile che riconoscere, e permette il feedback didattico preciso.
//
// Convenzione: formula scheletrica. Gli idrogeni sono impliciti (come si
// disegna all'esame), quindi confrontiamo solo gli atomi "pesanti" (non H).
// ============================================================================

export type Element = "C" | "O" | "N" | "S" | "P" | "H";

export const ELEMENTS: { sym: Element; name: string; color: string }[] = [
  { sym: "C", name: "Carbonio", color: "#2b2f36" },
  { sym: "O", name: "Ossigeno", color: "#D8333F" },
  { sym: "N", name: "Azoto", color: "#3b6fe0" },
  { sym: "S", name: "Zolfo", color: "#d6a400" },
  { sym: "P", name: "Fosforo", color: "#e08a2b" },
  { sym: "H", name: "Idrogeno", color: "#8a909a" },
];

export type BondOrder = 1 | 2 | 3;

export interface Atom {
  id: number;
  el: Element;
  x: number;
  y: number;
}

export interface Bond {
  id: number;
  a: number; // id atomo
  b: number; // id atomo
  order: BondOrder;
}

export interface Molecule {
  atoms: Atom[];
  bonds: Bond[];
}

export const emptyMolecule = (): Molecule => ({ atoms: [], bonds: [] });

// ---------------------------------------------------------------------------
// Utilita` di grafo
// ---------------------------------------------------------------------------

/** Atomi "pesanti" = tutto tranne l'idrogeno (formula scheletrica). */
function heavy(mol: Molecule): Molecule {
  const keep = new Set(mol.atoms.filter((a) => a.el !== "H").map((a) => a.id));
  return {
    atoms: mol.atoms.filter((a) => keep.has(a.id)),
    bonds: mol.bonds.filter((b) => keep.has(b.a) && keep.has(b.b)),
  };
}

/** Conteggio atomi per elemento (sui pesanti). */
export function formula(mol: Molecule): Record<string, number> {
  const h = heavy(mol);
  const out: Record<string, number> = {};
  for (const a of h.atoms) out[a.el] = (out[a.el] ?? 0) + 1;
  return out;
}

/** Conteggio legami per ordine (sui pesanti). */
function bondCounts(mol: Molecule): Record<BondOrder, number> {
  const h = heavy(mol);
  const out: Record<BondOrder, number> = { 1: 0, 2: 0, 3: 0 };
  for (const b of h.bonds) out[b.order]++;
  return out;
}

type AdjEntry = { other: number; order: BondOrder };
function adjacency(mol: Molecule): Map<number, AdjEntry[]> {
  const m = new Map<number, AdjEntry[]>();
  for (const a of mol.atoms) m.set(a.id, []);
  for (const b of mol.bonds) {
    m.get(b.a)?.push({ other: b.b, order: b.order });
    m.get(b.b)?.push({ other: b.a, order: b.order });
  }
  return m;
}

// ---------------------------------------------------------------------------
// Isomorfismo (Weisfeiler-Lehman): firma stabile per molecole piccole.
// Per ogni atomo si raffina un'etichetta combinando elemento + intorno
// (vicini con ordine di legame), iterando alcune volte. Due molecole con lo
// stesso multiset di firme finali, stessi atomi e stessi legami sono
// considerate isomorfe — affidabile sulle molecole piccole della biochimica.
// ---------------------------------------------------------------------------
export function wlSignature(input: Molecule, rounds = 3): string {
  const mol = heavy(input);
  const adj = adjacency(mol);
  let labels = new Map<number, string>();
  for (const a of mol.atoms) labels.set(a.id, a.el);

  for (let r = 0; r < rounds; r++) {
    const next = new Map<number, string>();
    for (const a of mol.atoms) {
      const nbrs = (adj.get(a.id) ?? [])
        .map((e) => `${e.order}:${labels.get(e.other)}`)
        .sort();
      next.set(a.id, `${labels.get(a.id)}[${nbrs.join(",")}]`);
    }
    labels = next;
  }
  return Array.from(labels.values()).sort().join("|");
}

export function sameStructure(a: Molecule, b: Molecule): boolean {
  const fa = formula(a);
  const fb = formula(b);
  if (JSON.stringify(sortObj(fa)) !== JSON.stringify(sortObj(fb))) return false;
  const ba = bondCounts(a);
  const bb = bondCounts(b);
  if (ba[1] !== bb[1] || ba[2] !== bb[2] || ba[3] !== bb[3]) return false;
  return wlSignature(a) === wlSignature(b);
}

function sortObj(o: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const k of Object.keys(o).sort()) out[k] = o[k];
  return out;
}

// ---------------------------------------------------------------------------
// Riconoscimento gruppi funzionali (per feedback positivo mirato)
// ---------------------------------------------------------------------------
export function hasCarboxyl(mol: Molecule): boolean {
  // un C legato a un O con doppio legame E a un altro O con legame singolo
  const adj = adjacency(heavy(mol));
  const elOf = new Map(heavy(mol).atoms.map((a) => [a.id, a.el] as const));
  let found = false;
  adj.forEach((nbrs, id) => {
    if (elOf.get(id) !== "C") return;
    const dblO = nbrs.some((n) => elOf.get(n.other) === "O" && n.order === 2);
    const sglO = nbrs.some((n) => elOf.get(n.other) === "O" && n.order === 1);
    if (dblO && sglO) found = true;
  });
  return found;
}

export function hasAmino(mol: Molecule): boolean {
  // un N legato (singolo) ad almeno un C
  const adj = adjacency(heavy(mol));
  const elOf = new Map(heavy(mol).atoms.map((a) => [a.id, a.el] as const));
  let found = false;
  adj.forEach((nbrs, id) => {
    if (elOf.get(id) !== "N") return;
    if (nbrs.some((n) => elOf.get(n.other) === "C" && n.order === 1)) found = true;
  });
  return found;
}

// ---------------------------------------------------------------------------
// Motore di feedback: confronta disegno con atteso e produce messaggi utili.
// ---------------------------------------------------------------------------
export interface Feedback {
  correct: boolean;
  title: string;
  lines: string[]; // dettagli / suggerimenti
  good: string[]; // cose fatte bene (rinforzo positivo)
}

const EL_NAME: Record<string, string> = {
  C: "carbonio",
  O: "ossigeno",
  N: "azoto",
  S: "zolfo",
  P: "fosforo",
};

export function evaluate(drawn: Molecule, expected: Molecule): Feedback {
  const good: string[] = [];
  const lines: string[] = [];

  if (heavy(drawn).atoms.length === 0) {
    return {
      correct: false,
      title: "Disegna qualcosa per iniziare",
      lines: ["Aggiungi atomi dalla tavolozza e collegali con i legami."],
      good: [],
    };
  }

  // 1) confronto formula (conteggio atomi pesanti)
  const fd = formula(drawn);
  const fe = formula(expected);
  const els = Array.from(new Set([...Object.keys(fd), ...Object.keys(fe)]));
  let formulaOk = true;
  for (const el of els) {
    const d = fd[el] ?? 0;
    const e = fe[el] ?? 0;
    if (d === e) continue;
    formulaOk = false;
    const name = EL_NAME[el] ?? el;
    if (d < e)
      lines.push(`Ti manca ${e - d} atomo/i di ${name} (${el}).`);
    else lines.push(`Hai ${d - e} atomo/i di ${name} (${el}) in più.`);
  }

  // 2) confronto legami
  const bd = bondCounts(drawn);
  const be = bondCounts(expected);
  const bondNames: Record<BondOrder, string> = { 1: "singoli", 2: "doppi", 3: "tripli" };
  for (const o of [1, 2, 3] as BondOrder[]) {
    if (bd[o] === be[o]) continue;
    if (bd[o] < be[o])
      lines.push(`Mancano ${be[o] - bd[o]} legame/i ${bondNames[o]}.`);
    else lines.push(`Hai ${bd[o] - be[o]} legame/i ${bondNames[o]} di troppo.`);
  }

  // 3) gruppi funzionali (rinforzo positivo)
  if (hasCarboxyl(expected) && hasCarboxyl(drawn))
    good.push("Gruppo carbossilico —COOH disegnato correttamente");
  if (hasAmino(expected) && hasAmino(drawn))
    good.push("Gruppo amminico —NH₂ al posto giusto");

  // verdetto finale
  if (sameStructure(drawn, expected)) {
    return {
      correct: true,
      title: "Corretto! 🎉",
      lines: [],
      good: good.length ? good : ["Struttura corretta in ogni dettaglio"],
    };
  }

  if (formulaOk && lines.length === 0) {
    // atomi e legami giusti come conteggio, ma connettivita` diversa
    lines.push(
      "Gli atomi e i legami giusti ci sono, ma la connettività è diversa: controlla a quale atomo hai attaccato ciascun gruppo.",
    );
  }

  return {
    correct: false,
    title: lines.length ? "Ci sei quasi" : "Non ancora",
    lines: lines.length ? lines : ["Confronta con la struttura attesa e riprova."],
    good,
  };
}

// ===========================================================================
// CONTENUTI — Capitolo 1: Amminoacidi
// Le strutture attese sono definite a mano (atomi pesanti + legami).
// Coordinate solo indicative per un eventuale "mostra soluzione".
// ===========================================================================

export type StepKind = "draw" | "theory";

export interface DrawStep {
  kind: "draw";
  id: string;
  prompt: string;
  hint: string;
  expected: Molecule;
}

export interface TheoryStep {
  kind: "theory";
  id: string;
  prompt: string;
  options: string[];
  answer: number; // indice opzione corretta
  explain: string;
}

export type Step = DrawStep | TheoryStep;

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  steps: Step[];
}

// helper per costruire molecole attese in modo leggibile
function mol(
  atoms: [Element, number, number][],
  bonds: [number, number, BondOrder][],
): Molecule {
  return {
    atoms: atoms.map(([el, x, y], i) => ({ id: i, el, x, y })),
    bonds: bonds.map(([a, b, order], i) => ({ id: i, a, b, order })),
  };
}

// Glicina (scheletrica, H impliciti):  N-Cα-C(=O)-O
//   atomi:  0:N  1:Cα  2:C(carbon.)  3:O(=)  4:O(-)
const GLICINA = mol(
  [
    ["N", 60, 160],
    ["C", 140, 120],
    ["C", 220, 160],
    ["O", 220, 80],
    ["O", 300, 120],
  ],
  [
    [0, 1, 1],
    [1, 2, 1],
    [2, 3, 2],
    [2, 4, 1],
  ],
);

// Alanina = glicina + un CH3 sul Cα (un carbonio in piu` sul Cα)
//   0:N 1:Cα 2:C(carb) 3:O(=) 4:O(-) 5:C(metile)
const ALANINA = mol(
  [
    ["N", 60, 160],
    ["C", 140, 120],
    ["C", 220, 160],
    ["O", 220, 80],
    ["O", 300, 120],
    ["C", 140, 40],
  ],
  [
    [0, 1, 1],
    [1, 2, 1],
    [2, 3, 2],
    [2, 4, 1],
    [1, 5, 1],
  ],
);

export const LESSONS: Lesson[] = [
  {
    id: "amminoacidi",
    title: "Amminoacidi",
    subtitle: "Capitolo 1 · Struttura e gruppi funzionali",
    steps: [
      {
        kind: "theory",
        id: "t1",
        prompt:
          "Quali due gruppi funzionali sono presenti in OGNI amminoacido?",
        options: [
          "Carbossilico (—COOH) e amminico (—NH₂)",
          "Idrossilico (—OH) e chetonico (C=O)",
          "Fosfato e solfidrile (—SH)",
          "Carbossilico (—COOH) e aldeidico (—CHO)",
        ],
        answer: 0,
        explain:
          "Ogni amminoacido ha un carbonio α legato a un gruppo carbossilico —COOH e a un gruppo amminico —NH₂. È ciò che li rende 'amino-acidi'.",
      },
      {
        kind: "draw",
        id: "d1",
        prompt:
          "Disegna la GLICINA (formula scheletrica, idrogeni impliciti).",
        hint: "È il più semplice: N—Cα—C(=O)—OH. Nessuna catena laterale sul Cα.",
        expected: GLICINA,
      },
      {
        kind: "theory",
        id: "t2",
        prompt:
          "Cosa distingue un amminoacido dall'altro?",
        options: [
          "La catena laterale (gruppo R) legata al carbonio α",
          "Il numero di gruppi carbossilici",
          "Il tipo di legame peptidico",
          "La presenza di azoto",
        ],
        answer: 0,
        explain:
          "Lo scheletro (—NH₂, Cα, —COOH) è uguale per tutti. A cambiare è la catena laterale R sul carbonio α: dà a ciascun amminoacido le sue proprietà.",
      },
      {
        kind: "draw",
        id: "d2",
        prompt:
          "Ora la ALANINA: come la glicina, ma con un —CH₃ come catena laterale sul Cα.",
        hint: "Parti dalla glicina e aggiungi un carbonio (il metile) attaccato al carbonio α.",
        expected: ALANINA,
      },
    ],
  },
];
