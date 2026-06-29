"use client";

import { Atom, BondOrder, Element, ELEMENTS, Molecule } from "@/lib/chem";

const colorOf = (e: Element) => ELEMENTS.find((x) => x.sym === e)?.color ?? "#444";

/** Rendering puro (read-only) di una molecola in SVG. Usato come overlay
 *  "ecco cosa ho letto" sopra l'inchiostro a mano libera. */
export function MoleculeView({ mol, r = 15, opacity = 1 }: { mol: Molecule; r?: number; opacity?: number }) {
  return (
    <g opacity={opacity}>
      {mol.bonds.map((b) => {
        const a1 = mol.atoms.find((a) => a.id === b.a);
        const a2 = mol.atoms.find((a) => a.id === b.b);
        if (!a1 || !a2) return null;
        return <BondLine key={b.id} a1={a1} a2={a2} order={b.order} />;
      })}
      {mol.atoms.map((a) => (
        <g key={a.id}>
          <circle cx={a.x} cy={a.y} r={r} fill={colorOf(a.el)} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          <text x={a.x} y={a.y + 5} textAnchor="middle" className="pointer-events-none fill-white text-[14px] font-bold">
            {a.el}
          </text>
        </g>
      ))}
    </g>
  );
}

export function BondLine({ a1, a2, order }: { a1: Atom; a2: Atom; order: BondOrder }) {
  const dx = a2.x - a1.x, dy = a2.y - a1.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const offsets = order === 1 ? [0] : order === 2 ? [-3.5, 3.5] : [-5, 0, 5];
  return (
    <g stroke="rgba(255,255,255,0.85)" strokeWidth={2}>
      {offsets.map((o, i) => (
        <line key={i} x1={a1.x + nx * o} y1={a1.y + ny * o} x2={a2.x + nx * o} y2={a2.y + ny * o} />
      ))}
    </g>
  );
}
