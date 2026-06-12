"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { TRAINING, TRAINING_PHOTOS } from "@/lib/site";
import WhatsAppButton from "./WhatsApp";
import ImageRotator from "./ImageRotator";
import { fadeUp, stagger } from "@/lib/anim";

export default function Training() {
  return (
    <section
      id="training"
      className="relative overflow-hidden border-y border-white/10 bg-ink-800/50 py-24 md:py-32"
    >
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-lime/10 blur-[120px]" />

      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-5">
              {/* logo ufficiale PV Soccer Training */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/training-logo.png"
                alt="Logo PV Soccer Training — Tecnica 1to1"
                className="h-24 w-auto shrink-0 rounded-2xl bg-white p-1.5 ring-1 ring-white/15 sm:h-28"
              />
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-lime">
                  {TRAINING.brand}
                </p>
                <h2 className="display-xl mt-3 text-4xl font-bold sm:text-5xl">
                  {TRAINING.title}
                </h2>
              </div>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-lg text-lg leading-relaxed text-white/65 [&_strong]:font-semibold [&_strong]:text-white"
              dangerouslySetInnerHTML={{ __html: TRAINING.textHtml }}
            />
            <motion.ul variants={fadeUp} className="mt-6 space-y-2.5">
              {TRAINING.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime text-ink-900">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-sm text-white/80">{b}</span>
                </li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp} className="mt-8">
              <WhatsAppButton
                message={`Ciao! Vorrei informazioni sugli allenamenti di tecnica individuale (${TRAINING.brand}).`}
              >
                Richiedi info allenamenti
              </WhatsAppButton>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="overflow-hidden rounded-[2rem] border border-white/10">
              <ImageRotator
                images={TRAINING_PHOTOS}
                alt="Allenamento PV Soccer Training"
                objectPositions={{ "/training/06.jpg": "82% center" }}
                className="h-80 w-full sm:h-96"
              />
            </div>
          </motion.div>
        </div>

        {/* Cosa imparerai */}
        <motion.div
          variants={stagger(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 border-t border-white/10 pt-12"
        >
          <motion.h3
            variants={fadeUp}
            className="font-display text-2xl font-bold sm:text-3xl"
          >
            {TRAINING.learnTitle}
            <span className="text-lime">?</span>
          </motion.h3>
          <div className="mt-7 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {TRAINING.learn.map((l) => (
              <motion.div key={l} variants={fadeUp} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime/15 text-lime">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span
                  className="text-sm leading-relaxed text-white/75 [&_strong]:font-semibold [&_strong]:text-white"
                  dangerouslySetInnerHTML={{ __html: l }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
