"use client";

import type { Transition } from "framer-motion";
import { motion } from "framer-motion";
import { Beer, Euro, Lightbulb, ParkingSquare, ShowerHead } from "lucide-react";
import Tilt from "./Tilt";

const MAP = {
  euro: Euro,
  lights: Lightbulb,
  shower: ShowerHead,
  bar: Beer,
  parking: ParkingSquare,
} as const;

// Animazione continua diversa per ogni icona.
const ANIM: Record<
  keyof typeof MAP,
  { animate: Record<string, number[]>; transition: Transition }
> = {
  euro: {
    animate: { scale: [1, 1.15, 1] },
    transition: { duration: 1.9, repeat: Infinity, ease: "easeInOut" },
  },
  lights: {
    animate: { opacity: [1, 0.5, 1], scale: [1, 1.14, 1] },
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
  },
  shower: {
    animate: { y: [0, -3, 0] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
  bar: {
    animate: { rotate: [-9, 9, -9] },
    transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
  },
  parking: {
    animate: { y: [0, -2.5, 0] },
    transition: { duration: 1.7, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function Icon3D({
  name,
  size = 16,
}: {
  name: keyof typeof MAP;
  size?: number;
}) {
  const Icon = MAP[name];
  const dim = size * 4;

  return (
    <Tilt max={18} className="inline-block">
      <div
        className="relative grid place-items-center rounded-2xl bg-gradient-to-br from-ink-600 to-ink-800 ring-1 ring-white/10"
        style={{
          height: dim,
          width: dim,
          perspective: 500,
          boxShadow:
            "0 14px 34px -12px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <span className="pointer-events-none absolute inset-x-2 top-1.5 h-1/3 rounded-full bg-white/10 blur-[6px]" />
        {/* bagliore lime che pulsa */}
        <motion.span
          className="pointer-events-none absolute h-9 w-9 rounded-full bg-lime/20 blur-lg"
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="relative inline-flex text-lime"
          style={{ transformStyle: "preserve-3d" }}
          animate={ANIM[name].animate}
          transition={ANIM[name].transition}
        >
          <Icon size={size + 12} strokeWidth={2} />
        </motion.span>
      </div>
    </Tilt>
  );
}
