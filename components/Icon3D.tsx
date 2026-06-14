"use client";

import type { Transition } from "framer-motion";
import { motion } from "framer-motion";
import { ParkingSquare, type LucideProps } from "lucide-react";
import Tilt from "./Tilt";

// pallone da calcio (stile lineare coerente con le icone lucide)
function SoccerBall({ size = 24, strokeWidth = 2, ...props }: LucideProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7l4.7 3.4-1.8 5.6H9.1L7.3 10.4 12 7Z" />
      <path d="M12 7V2.5M16.7 10.4l4.3-1.5M14.9 16l2.7 3.5M9.1 16l-2.7 3.5M7.3 10.4 3 8.9" />
    </svg>
  );
}

// scarpa/tecnica per PV Soccer Training (footwork)
function TechniqueIcon({ size = 24, strokeWidth = 2, ...props }: LucideProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M2 17h11l5-1.5c2-.6 3-1.6 3-3 0-1-.7-1.6-1.7-1.5l-5.3.6-3.5-3.2c-.5-.5-1.2-.7-1.9-.5L2 9.5Z" />
      <path d="M2 13.5h7.5M2 20h17" />
      <circle cx="18.5" cy="20" r="1.4" />
    </svg>
  );
}

// bottiglietta d'acqua (stile lineare coerente con le icone lucide)
function WaterBottle({ size = 24, strokeWidth = 2, ...props }: LucideProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M10 2h4v2h-4z" />
      <path d="M10 4c0 1.5-1.7 2-1.7 3.6V19a2 2 0 0 0 2 2h3.4a2 2 0 0 0 2-2V7.6C15.7 6 14 5.5 14 4" />
      <path d="M8.3 12h7.4M8.3 16h7.4" />
    </svg>
  );
}

const MAP = {
  calcio: SoccerBall,
  pvtraining: TechniqueIcon,
  bar: WaterBottle,
  parking: ParkingSquare,
} as const;

// Animazione continua diversa per ogni icona.
const ANIM: Record<
  keyof typeof MAP,
  { animate: Record<string, number[]>; transition: Transition }
> = {
  calcio: {
    animate: { y: [0, -4, 0] },
    transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
  },
  pvtraining: {
    animate: { scale: [1, 1.12, 1] },
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
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
        {/* bagliore rosso che pulsa */}
        <motion.span
          className="pointer-events-none absolute h-9 w-9 rounded-full bg-rosso/20 blur-lg"
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="relative inline-flex text-rosso"
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
