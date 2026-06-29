"use client";

import { useState } from "react";
import { PenLine, Boxes } from "lucide-react";
import { Molecule } from "@/lib/chem";
import { FreehandCanvas } from "@/components/biochem/FreehandCanvas";
import { MoleculeCanvas } from "@/components/biochem/MoleculeCanvas";

type Mode = "hand" | "build";

/** Input struttura con due modalita`:
 *  - "Scrivi a mano": disegno libero + riconoscimento (l'obiettivo vero)
 *  - "Costruisci": editor tap-to-build, affidabile, per correggere la lettura */
export function StructureInput({
  value,
  onChange,
}: {
  value: Molecule;
  onChange: (m: Molecule) => void;
}) {
  const [mode, setMode] = useState<Mode>("hand");

  return (
    <div>
      <div className="mb-3 inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
        <Tab active={mode === "hand"} onClick={() => setMode("hand")} icon={<PenLine size={14} />} label="Scrivi a mano" />
        <Tab active={mode === "build"} onClick={() => setMode("build")} icon={<Boxes size={14} />} label="Costruisci" />
      </div>

      {mode === "hand" ? (
        <FreehandCanvas value={value} onChange={onChange} />
      ) : (
        <MoleculeCanvas value={value} onChange={onChange} />
      )}
    </div>
  );
}

function Tab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        active ? "bg-lime text-ink-900" : "text-white/60 hover:text-white"
      }`}
    >
      {icon} {label}
    </button>
  );
}
