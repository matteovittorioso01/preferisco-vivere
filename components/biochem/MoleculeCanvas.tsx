"use client";

import { useRef, useState } from "react";
import {
  Atom,
  Bond,
  BondOrder,
  Element,
  ELEMENTS,
  Molecule,
} from "@/lib/chem";

type Tool = "atom" | "bond" | "erase";

const ATOM_R = 17;

export function MoleculeCanvas({
  value,
  onChange,
  width = 360,
  height = 240,
}: {
  value: Molecule;
  onChange: (m: Molecule) => void;
  width?: number;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tool, setTool] = useState<Tool>("atom");
  const [el, setEl] = useState<Element>("C");
  const [pendingBond, setPendingBond] = useState<number | null>(null);

  // id sempre univoco anche su molecole ricevute da fuori (es. lettura a mano)
  const freshId = () =>
    Math.max(0, ...value.atoms.map((a) => a.id), ...value.bonds.map((b) => b.id)) + 1;

  const colorOf = (e: Element) =>
    ELEMENTS.find((x) => x.sym === e)?.color ?? "#444";

  function svgPoint(evt: React.MouseEvent | React.Touch) {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / rect.width) * width,
      y: ((evt.clientY - rect.top) / rect.height) * height,
    };
  }

  function atomAt(x: number, y: number): Atom | undefined {
    return value.atoms.find((a) => Math.hypot(a.x - x, a.y - y) <= ATOM_R + 6);
  }

  function handleCanvasClick(e: React.MouseEvent) {
    const p = svgPoint(e);
    const hit = atomAt(p.x, p.y);

    if (tool === "atom") {
      if (hit) {
        // click su atomo esistente in modalita` atomo => cambia elemento
        onChange({
          ...value,
          atoms: value.atoms.map((a) => (a.id === hit.id ? { ...a, el } : a)),
        });
        return;
      }
      const a: Atom = { id: freshId(), el, x: p.x, y: p.y };
      onChange({ ...value, atoms: [...value.atoms, a] });
      return;
    }

    if (tool === "bond") {
      if (!hit) {
        setPendingBond(null);
        return;
      }
      if (pendingBond === null) {
        setPendingBond(hit.id);
        return;
      }
      if (pendingBond === hit.id) {
        setPendingBond(null);
        return;
      }
      // crea o cicla l'ordine del legame tra pendingBond e hit
      const existing = value.bonds.find(
        (b) =>
          (b.a === pendingBond && b.b === hit.id) ||
          (b.a === hit.id && b.b === pendingBond),
      );
      if (existing) {
        const order = ((existing.order % 3) + 1) as BondOrder;
        onChange({
          ...value,
          bonds: value.bonds.map((b) =>
            b.id === existing.id ? { ...b, order } : b,
          ),
        });
      } else {
        const b: Bond = { id: freshId(), a: pendingBond, b: hit.id, order: 1 };
        onChange({ ...value, bonds: [...value.bonds, b] });
      }
      setPendingBond(null);
      return;
    }

    if (tool === "erase") {
      if (hit) {
        onChange({
          atoms: value.atoms.filter((a) => a.id !== hit.id),
          bonds: value.bonds.filter((b) => b.a !== hit.id && b.b !== hit.id),
        });
        return;
      }
      // prova a cancellare un legame vicino al click
      const bond = nearestBond(value, p.x, p.y);
      if (bond) onChange({ ...value, bonds: value.bonds.filter((b) => b.id !== bond.id) });
    }
  }

  return (
    <div className="select-none">
      {/* Toolbar strumenti */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ToolBtn active={tool === "atom"} onClick={() => { setTool("atom"); setPendingBond(null); }} label="Atomo" />
        <ToolBtn active={tool === "bond"} onClick={() => { setTool("bond"); setPendingBond(null); }} label="Legame" />
        <ToolBtn active={tool === "erase"} onClick={() => { setTool("erase"); setPendingBond(null); }} label="Gomma" />
        <button
          onClick={() => { onChange({ atoms: [], bonds: [] }); setPendingBond(null); }}
          className="ml-auto rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 transition hover:border-rosso/60 hover:text-rosso"
        >
          Svuota
        </button>
      </div>

      {/* Tavolozza elementi (attiva in modalita` atomo) */}
      <div className={`mb-3 flex flex-wrap gap-2 transition ${tool === "atom" ? "opacity-100" : "opacity-40"}`}>
        {ELEMENTS.map((e) => (
          <button
            key={e.sym}
            disabled={tool !== "atom"}
            onClick={() => setEl(e.sym)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white transition ${
              el === e.sym ? "ring-2 ring-white ring-offset-2 ring-offset-ink-800" : ""
            }`}
            style={{ background: e.color }}
            title={e.name}
          >
            {e.sym}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        onClick={handleCanvasClick}
        className="w-full cursor-crosshair touch-none rounded-2xl border border-white/10 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:18px_18px]"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {/* legami */}
        {value.bonds.map((b) => {
          const a1 = value.atoms.find((a) => a.id === b.a);
          const a2 = value.atoms.find((a) => a.id === b.b);
          if (!a1 || !a2) return null;
          return <BondLine key={b.id} a1={a1} a2={a2} order={b.order} />;
        })}
        {/* atomi */}
        {value.atoms.map((a) => (
          <g key={a.id}>
            <circle
              cx={a.x}
              cy={a.y}
              r={ATOM_R}
              fill={colorOf(a.el)}
              stroke={pendingBond === a.id ? "#fff" : "rgba(255,255,255,0.25)"}
              strokeWidth={pendingBond === a.id ? 3 : 1.5}
            />
            <text
              x={a.x}
              y={a.y + 5}
              textAnchor="middle"
              className="pointer-events-none fill-white text-[14px] font-bold"
            >
              {a.el}
            </text>
          </g>
        ))}
      </svg>

      <p className="mt-2 text-center text-xs text-white/40">
        {tool === "atom" && "Tocca per aggiungere l'elemento selezionato · tocca un atomo per cambiarlo"}
        {tool === "bond" && (pendingBond === null ? "Tocca il primo atomo del legame" : "Tocca il secondo atomo · ri-tocca per cambiare ordine (singolo→doppio→triplo)")}
        {tool === "erase" && "Tocca un atomo o un legame per cancellarlo"}
      </p>
    </div>
  );
}

function nearestBond(mol: Molecule, x: number, y: number): Bond | undefined {
  let best: Bond | undefined;
  let bestD = 10; // soglia px
  for (const b of mol.bonds) {
    const a1 = mol.atoms.find((a) => a.id === b.a);
    const a2 = mol.atoms.find((a) => a.id === b.b);
    if (!a1 || !a2) continue;
    const d = distToSegment(x, y, a1.x, a1.y, a2.x, a2.y);
    if (d < bestD) { bestD = d; best = b; }
  }
  return best;
}

function distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function BondLine({ a1, a2, order }: { a1: Atom; a2: Atom; order: BondOrder }) {
  const dx = a2.x - a1.x, dy = a2.y - a1.y;
  const len = Math.hypot(dx, dy) || 1;
  // versore perpendicolare per sdoppiare le linee dei legami multipli
  const nx = (-dy / len), ny = (dx / len);
  const offsets = order === 1 ? [0] : order === 2 ? [-3.5, 3.5] : [-5, 0, 5];
  return (
    <g stroke="rgba(255,255,255,0.85)" strokeWidth={2}>
      {offsets.map((o, i) => (
        <line
          key={i}
          x1={a1.x + nx * o}
          y1={a1.y + ny * o}
          x2={a2.x + nx * o}
          y2={a2.y + ny * o}
        />
      ))}
    </g>
  );
}

function ToolBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-lime text-ink-900 shadow-lime-sm"
          : "border border-white/10 text-white/60 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
