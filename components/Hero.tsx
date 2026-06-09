"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { SITE } from "@/lib/site";
import { useParallax } from "@/lib/parallax";
import WhatsAppButton from "./WhatsApp";
import { fadeUp, stagger } from "@/lib/anim";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [imgError, setImgError] = useState(false);

  const { tx: bgX, ty: bgY } = useParallax(20);
  const { tx: textX, ty: textY } = useParallax(-10);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex flex-col overflow-hidden bg-ink-900 sm:min-h-screen"
    >
      {/* FOTO del muro:
          - smartphone: banner intero in alto (object-contain = si legge tutta)
          - desktop: sfondo a tutto schermo (object-cover) */}
      {!imgError && (
        <motion.img
          src={SITE.heroImage}
          alt="Il muro del campo con la scritta «Preferisco vivere»"
          onError={() => setImgError(true)}
          style={{ x: bgX, y: bgY }}
          className="h-[40vh] w-full shrink-0 object-contain object-center sm:absolute sm:inset-0 sm:h-full sm:scale-110 sm:object-cover"
        />
      )}

      {/* overlay scuro: leggero su mobile (foto in alto), forte su desktop (testo sopra la foto) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent sm:via-ink-900/55 sm:to-ink-900/75" />
      <div className="pointer-events-none absolute inset-0 grain opacity-50" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-lime/10 blur-[130px]" />

      {/* CONTENUTO: sotto la foto su mobile, in basso a sinistra su desktop */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-1 flex-col justify-end px-5 pb-12 pt-5 sm:pt-0 sm:pb-[15vh]"
      >
        <motion.div
          style={{ x: textX, y: textY }}
          variants={stagger(0.12, 0.1)}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-6xl"
        >
          <div className="max-w-4xl">
            <motion.p
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-lime backdrop-blur"
            >
              Calcio a 5 · {SITE.city}
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="display-xl mt-5 whitespace-nowrap text-4xl font-bold sm:text-6xl lg:text-7xl"
            >
              Preferisco <span className="text-lime-gradient">vivere</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-md text-base leading-relaxed text-white/70 sm:text-lg"
            >
              {SITE.tagline}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <WhatsAppButton booking>Prenota su WhatsApp</WhatsAppButton>
              <a
                href="#storia"
                className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold text-white transition hover:border-lime hover:text-lime"
              >
                La nostra storia
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* indicatore scroll (solo desktop) */}
      <motion.a
        href="#campi"
        style={{ opacity: contentOpacity }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 text-white/50 sm:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        aria-label="Scorri"
      >
        <ArrowDown size={22} />
      </motion.a>
    </section>
  );
}
