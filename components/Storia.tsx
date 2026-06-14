"use client";

import { motion } from "framer-motion";
import { SITE, STORY } from "@/lib/site";
import SectionTitle from "./SectionTitle";
import Img from "./Img";
import { fadeUp, stagger } from "@/lib/anim";

export default function Storia() {
  return (
    <section id="storia" className="border-t border-white/10 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle
          eyebrow="Da dove veniamo"
          title={STORY.title}
          subtitle={STORY.intro}
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mt-12 overflow-hidden rounded-[2rem] border border-white/10"
        >
          <Img
            src="/campo-aerea.jpg"
            alt="Vista dall'alto del centro sportivo Preferisco Vivere con i due campi"
            label="Foto del centro sportivo dall'alto"
            className="h-72 w-full object-cover sm:h-[26rem]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-900 to-transparent" />
          <p className="absolute bottom-5 left-6 right-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            Il nostro centro sportivo
          </p>
        </motion.div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-5"
        >
          {STORY.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              className="text-lg leading-relaxed text-white/70"
            >
              {p}
            </motion.p>
          ))}
        </motion.div>

        <motion.ol
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative space-y-8 border-l border-white/10 pl-6"
        >
          {STORY.timeline.map((t, i) => (
            <motion.li key={i} variants={fadeUp} className="relative">
              <span className="absolute -left-[1.65rem] top-1.5 h-3 w-3 rounded-full bg-lime ring-4 ring-ink-900" />
              <p className="font-display text-lg font-bold text-lime">{t.year}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{t.text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
      </div>
    </section>
  );
}
