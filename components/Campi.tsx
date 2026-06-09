"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { COURTS, CAMPI_PHOTOS } from "@/lib/site";
import SectionTitle from "./SectionTitle";
import ImageRotator from "./ImageRotator";
import WhatsAppButton from "./WhatsApp";
import { fadeUp, stagger } from "@/lib/anim";

export default function Campi() {
  return (
    <section id="campi" className="border-t border-white/10 bg-ink-800/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
      <SectionTitle
        eyebrow="Le strutture"
        title="Due campi. Zero scuse."
        subtitle="Calcio a 5 in erba sintetica, pronti per la tua partita a qualsiasi ora."
      />

      <motion.div
        variants={stagger(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-14 grid gap-6 md:grid-cols-2"
      >
        {COURTS.map((c, idx) => (
          <motion.div
            key={c.id}
            variants={fadeUp}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-800"
          >
            <div className="relative h-72 overflow-hidden sm:h-80">
              <ImageRotator
                images={CAMPI_PHOTOS}
                alt={c.name}
                startIndex={idx * 2}
                showDots={false}
                className="h-full w-full transition duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
              <span className="absolute left-5 top-5 z-10 rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink-900">
                {c.tag}
              </span>
            </div>

            <div className="relative -mt-12 p-6">
              <h3 className="font-display text-2xl font-bold">{c.name}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/60">
                {c.description}
              </p>
              <WhatsAppButton
                booking
                court={c.name}
                className="mt-5 !px-5 !py-2.5 text-xs"
              >
                Prenota il {c.name}
              </WhatsAppButton>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-white/50"
      >
        <ShieldCheck size={16} className="shrink-0 text-lime" />
        Si evidenziano anche i parametri di sicurezza vigenti dalla FIGC e del CONI.
      </motion.p>
      </div>
    </section>
  );
}
