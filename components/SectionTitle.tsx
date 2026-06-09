"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/anim";

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}
    >
      <motion.p
        variants={fadeUp}
        className="text-xs font-semibold uppercase tracking-[0.25em] text-lime"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="display-xl mt-4 text-4xl font-bold sm:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="mt-4 text-lg leading-relaxed text-white/60"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
