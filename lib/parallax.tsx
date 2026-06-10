"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import {
  MotionConfig,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface PCtx {
  x: MotionValue<number>; // -1..1 (sinistra→destra)
  y: MotionValue<number>; // -1..1 (alto→basso)
}

const Ctx = createContext<PCtx | null>(null);

export function ParallaxProvider({ children }: { children: ReactNode }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 50, damping: 18, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 50, damping: 18, mass: 0.4 });

  useEffect(() => {
    let raf = 0;
    const apply = (cx: number, cy: number) => {
      const nx = (cx / window.innerWidth) * 2 - 1;
      const ny = (cy / window.innerHeight) * 2 - 1;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        rawX.set(nx);
        rawY.set(ny);
      });
    };
    // Solo mouse (desktop): su smartphone il movimento al tocco disturbava
    // la lettura di foto e titolo, quindi sul touch resta tutto fermo.
    const onMouse = (e: MouseEvent) => apply(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(raf);
    };
  }, [rawX, rawY]);

  return (
    <Ctx.Provider value={{ x, y }}>
      {/* rispetta la preferenza di sistema "riduci animazioni" */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Ctx.Provider>
  );
}

/** Restituisce due MotionValue (px) da applicare a style={{ x, y }} per il parallax. */
export function useParallax(strength = 20) {
  const ctx = useContext(Ctx);
  const zero = useMotionValue(0);
  const sx = ctx?.x ?? zero;
  const sy = ctx?.y ?? zero;
  const tx = useTransform(sx, (v) => v * strength);
  const ty = useTransform(sy, (v) => v * strength);
  return { tx, ty };
}
