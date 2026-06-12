"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Barra di avanzamento lettura in alto, gradiente giallo→verde.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-lime via-white to-rosso"
    />
  );
}
