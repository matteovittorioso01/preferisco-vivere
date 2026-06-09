"use client";

import { motion } from "framer-motion";
import { SPONSORS } from "@/lib/site";
import SectionTitle from "./SectionTitle";
import { scaleIn, stagger } from "@/lib/anim";
import WhatsAppButton from "./WhatsApp";

export default function Partnership() {
  return (
    <section
      id="partnership"
      className="border-t border-white/10 bg-ink-800/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle eyebrow="Partnership" title="I nostri partner" center />

        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-3"
        >
          {SPONSORS.map((s) => {
            const tile = (
              <div className="flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-white/10 transition group-hover:-translate-y-1 group-hover:shadow-lime-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.logo}
                  alt={s.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            );

            return (
              <motion.div key={s.name} variants={scaleIn} className="group">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="block"
                  >
                    {tile}
                  </a>
                ) : (
                  tile
                )}
                <p className="mt-3 text-center text-xs text-white/45">{s.name}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-14 text-center">
          <p className="mb-4 text-sm text-white/50">
            Vuoi diventare partner di Preferisco Vivere?
          </p>
          <WhatsAppButton
            variant="ghost"
            message="Ciao! Vorrei informazioni per diventare partner/sponsor di Preferisco Vivere."
          >
            Diventa partner
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
