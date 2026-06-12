"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/site";
import SectionTitle from "./SectionTitle";
import Icon3D from "./Icon3D";
import { scaleIn, stagger } from "@/lib/anim";

export default function Servizi() {
  return (
    <section id="servizi" className="border-t border-white/10 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
      <SectionTitle eyebrow="Tutto incluso" title="Tu pensa solo a giocare." />

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {SERVICES.map((s) => (
          <motion.div
            key={s.title}
            variants={scaleIn}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
            }}
            className="glass group relative flex flex-col items-center overflow-hidden rounded-3xl p-7 text-center transition hover:border-lime/40 hover:bg-white/[0.05]"
          >
            {/* spotlight che segue il puntatore */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(0,168,89,0.12), transparent 65%)",
              }}
            />
            <Icon3D name={s.icon} />
            <h3 className="mt-5 font-display text-2xl font-bold">{s.title}</h3>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-lime/80">
              {s.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </section>
  );
}
