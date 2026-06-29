"use client";

import { useRef, useState } from "react";
import { Eraser, Undo2, ScanLine } from "lucide-react";
import { Molecule } from "@/lib/chem";
import { assembleMolecule, Point, Stroke } from "@/lib/ink";
import { MoleculeView } from "@/components/biochem/MoleculeView";

const WIDTH = 360;
const HEIGHT = 240;

/** Canvas a mano libera: lo studente SCRIVE la struttura (lettere + legami),
 *  poi "Leggi" interpreta i tratti in una molecola che confluisce in value. */
export function FreehandCanvas({
  value,
  onChange,
}: {
  value: Molecule;
  onChange: (m: Molecule) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<Point[]>([]);
  const [read, setRead] = useState(false);
  const [lowConf, setLowConf] = useState(false);
  const drawing = useRef(false);

  function toSvg(e: React.PointerEvent): Point {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * HEIGHT,
    };
  }

  function onDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    setCurrent([toSvg(e)]);
    if (read) setRead(false); // ridisegnare invalida la lettura precedente
  }
  function onMove(e: React.PointerEvent) {
    if (!drawing.current) return;
    setCurrent((c) => [...c, toSvg(e)]);
  }
  function onUp() {
    if (!drawing.current) return;
    drawing.current = false;
    setCurrent((c) => {
      if (c.length >= 2) {
        const now = perfNow();
        setStrokes((s) => [...s, { points: c, t0: now - c.length * 8, t1: now }]);
      }
      return [];
    });
  }

  function readStructure() {
    if (strokes.length === 0) return;
    const rec = assembleMolecule(strokes);
    setLowConf(rec.lowConfidence);
    setRead(true);
    onChange(rec.molecule);
  }

  function clearAll() {
    setStrokes([]);
    setCurrent([]);
    setRead(false);
    onChange({ atoms: [], bonds: [] });
  }

  function undo() {
    setStrokes((s) => s.slice(0, -1));
    setRead(false);
  }

  const polyline = (pts: Point[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="select-none">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          onClick={readStructure}
          disabled={strokes.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg bg-lime px-3 py-1.5 text-xs font-bold text-ink-900 shadow-lime-sm transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
        >
          <ScanLine size={14} /> Leggi struttura
        </button>
        <button
          onClick={undo}
          disabled={strokes.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 transition hover:text-white disabled:opacity-30"
        >
          <Undo2 size={14} /> Annulla tratto
        </button>
        <button
          onClick={clearAll}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 transition hover:border-rosso/60 hover:text-rosso"
        >
          <Eraser size={14} /> Svuota
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="w-full touch-none rounded-2xl border border-white/10 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:18px_18px]"
        style={{ aspectRatio: `${WIDTH}/${HEIGHT}`, cursor: "crosshair" }}
      >
        {/* inchiostro grezzo */}
        <g stroke="rgba(43,203,124,0.9)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {strokes.map((s, i) => (
            <polyline key={i} points={polyline(s.points)} opacity={read ? 0.25 : 1} />
          ))}
          {current.length > 1 && <polyline points={polyline(current)} />}
        </g>
        {/* interpretazione (cosa abbiamo letto) sopra l'inchiostro */}
        {read && <MoleculeView mol={value} opacity={0.95} />}
      </svg>

      {read ? (
        <p className={`mt-2 text-center text-xs ${lowConf ? "text-rosso" : "text-white/50"}`}>
          {value.atoms.length === 0
            ? "Non sono riuscito a leggere atomi: riscrivi più in grande, o usa «Costruisci»."
            : lowConf
              ? "Lettura incerta. Se ho sbagliato a leggere, correggi in «Costruisci»."
              : "Ho letto questa struttura. Se è giusta, premi «Verifica»; altrimenti correggi in «Costruisci»."}
        </p>
      ) : (
        <p className="mt-2 text-center text-xs text-white/40">
          Scrivi un atomo alla volta (lettera), poi traccia i legami fra gli atomi · poi «Leggi struttura»
        </p>
      )}
    </div>
  );
}

// performance.now() nel browser; fallback monotono lato server/test
let _t = 0;
function perfNow(): number {
  if (typeof performance !== "undefined" && performance.now) return performance.now();
  return (_t += 50);
}
