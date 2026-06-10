"use client";

import { motion } from "framer-motion";
import { Clock, Facebook, Instagram, MapPin, Youtube } from "lucide-react";
import { SITE } from "@/lib/site";
import WhatsAppButton, { WhatsAppIcon } from "./WhatsApp";
import { fadeUp, stagger } from "@/lib/anim";

export default function Contatti() {
  return (
    <section id="contatti" className="border-t border-white/10 bg-ink-800/30 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
      <motion.div
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="glass relative overflow-hidden rounded-[2.5rem] p-8 text-center md:p-16"
      >
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-lime/15 blur-[120px]" />

        <motion.span
          variants={fadeUp}
          className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lime text-ink-900"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="display-xl relative mx-auto mt-6 max-w-2xl text-4xl font-bold sm:text-5xl"
        >
          Prenotare è semplice: scrivici su WhatsApp.
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="relative mx-auto mt-4 max-w-md text-white/60"
        >
          Niente chiamate e niente attese: gestiamo tutto comodamente via
          messaggio. Dicci giorno, ora e campo, al resto pensiamo noi.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="relative mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <WhatsAppButton booking className="!px-9 !py-4 text-base">
            Scrivici su WhatsApp
          </WhatsAppButton>
          <WhatsAppButton
            variant="ghost"
            message="Ciao! Vorrei chiedere un'informazione."
            className="!px-7 !py-4 text-base"
          >
            Altre informazioni
          </WhatsAppButton>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="relative mt-12 flex flex-col items-center gap-6 border-t border-white/10 pt-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/60">
            <span className="inline-flex items-center gap-2">
              <Clock size={16} className="text-lime" /> {SITE.hours}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-lime" /> {SITE.city}
            </span>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-lime transition hover:text-lime-400"
            >
              <MapPin size={16} /> Come arrivare
            </a>
          </div>

          <div className="flex items-center gap-3">
            {SITE.instagram && (
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-white/70 transition hover:border-lime hover:text-lime"
              >
                <Instagram size={18} />
              </a>
            )}
            {SITE.facebook && (
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-white/70 transition hover:border-lime hover:text-lime"
              >
                <Facebook size={18} />
              </a>
            )}
            {SITE.youtube && (
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-white/70 transition hover:border-lime hover:text-lime"
              >
                <Youtube size={18} />
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mt-6 overflow-hidden rounded-[2rem] border border-white/10"
      >
        <iframe
          title="Mappa — Preferisco Vivere, Caivano"
          src="https://www.google.com/maps?q=Centro%20Sportivo%20Preferisco%20Vivere%20Caivano&output=embed"
          className="h-72 w-full sm:h-80"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>

      {/* filigrana: firma gigante del club (SVG: si adatta sempre alla larghezza, mai tagliata) */}
      <div aria-hidden className="pointer-events-none select-none pt-16">
        <svg viewBox="0 0 1200 130" className="w-full" role="presentation">
          <text
            x="600"
            y="103"
            textAnchor="middle"
            textLength="1180"
            lengthAdjust="spacingAndGlyphs"
            fill="rgba(255,255,255,0.05)"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "112px",
              letterSpacing: "-0.02em",
            }}
          >
            PREFERISCO VIVERE
          </text>
        </svg>
      </div>

      <footer className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-verde" />
          <span className="font-display font-bold text-white/70">
            {SITE.shortName}
          </span>
        </div>
        <span>
          © {new Date().getFullYear()} {SITE.name} · Calcio a 5
        </span>
      </footer>
      </div>
    </section>
  );
}
