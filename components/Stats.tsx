"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { fadeUp, stagger } from "@/lib/anim";

const STATS = [
  { to: 25, suffix: "+", label: "anni di storia" },
  { to: 2, suffix: "", label: "campi in erba sintetica" },
  { to: 6, suffix: "€", label: "a persona, tutto incluso" },
  { to: 7, suffix: "/7", label: "aperti tutta la settimana" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, mv, to]);

  return (
    <motion.span ref={ref} className="inline-block">
      {text}
    </motion.span>
  );
}

export default function Stats() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      {/* decorazione: linea di metà campo + cerchio di centrocampo */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[230%] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
      >
        <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="18" fill="none" stroke="white" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="1.1" fill="white" />
      </svg>

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 lg:grid-cols-4"
      >
        {STATS.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="text-center">
            <p className="display-xl text-lime-gradient inline-block text-4xl font-bold sm:text-5xl">
              <Counter to={s.to} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/45">
              {s.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
