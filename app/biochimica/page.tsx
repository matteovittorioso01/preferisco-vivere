"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Flame, Zap, Check, X, Lightbulb, ArrowRight, RotateCcw, GraduationCap, Ticket } from "lucide-react";
import { MoleculeCanvas } from "@/components/biochem/MoleculeCanvas";
import {
  LESSONS,
  emptyMolecule,
  evaluate,
  Molecule,
  Step,
} from "@/lib/chem";

const MAX_HEARTS = 5;
const XP_PER_STEP = 10;

// Ateneo demo (in produzione: rilevato dall'account / dominio email .edu)
const ATENEO = {
  nome: "Università Federico II",
  premio: "Ingresso ridotto alla serata universitaria del venerdì",
  partner: "La Capannina Student Night",
};

export default function BiochimicaPage() {
  const lesson = LESSONS[0];
  const [stepIdx, setStepIdx] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  const step = lesson.steps[stepIdx];
  const progress = (stepIdx / lesson.steps.length) * 100;

  function onStepCorrect() {
    setXp((x) => x + XP_PER_STEP);
    setStreak((s) => s + 1);
    if (stepIdx + 1 >= lesson.steps.length) setDone(true);
    else setStepIdx((i) => i + 1);
  }

  function onStepWrong() {
    setStreak(0);
    setHearts((h) => {
      const nh = h - 1;
      if (nh <= 0) setFailed(true);
      return Math.max(0, nh);
    });
  }

  function restart() {
    setStepIdx(0);
    setHearts(MAX_HEARTS);
    setXp(0);
    setStreak(0);
    setDone(false);
    setFailed(false);
  }

  return (
    <main className="min-h-screen bg-ink-900 px-4 py-6 text-white">
      <div className="mx-auto max-w-xl">
        {/* Top bar: vite / streak / xp */}
        <header className="mb-5 flex items-center gap-3">
          <button
            onClick={restart}
            className="flex items-center gap-1 text-white/40 transition hover:text-white"
            title="Ricomincia"
          >
            <RotateCcw size={18} />
          </button>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-lime"
              animate={{ width: `${done ? 100 : progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <Stat icon={<Flame size={16} className="text-rosso" />} value={streak} />
          <Stat icon={<Zap size={16} className="text-lime" />} value={xp} />
          <div className="flex items-center gap-0.5">
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <Heart
                key={i}
                size={16}
                className={i < hearts ? "fill-rosso text-rosso" : "text-white/15"}
              />
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {failed ? (
            <FailScreen key="fail" onRetry={restart} />
          ) : done ? (
            <RewardScreen key="reward" xp={xp} onRestart={restart} />
          ) : (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-lime">
                {lesson.title} · {lesson.subtitle}
              </p>
              <StepView step={step} onCorrect={onStepCorrect} onWrong={onStepWrong} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <span className="flex items-center gap-1 text-sm font-bold tabular-nums">
      {icon}
      {value}
    </span>
  );
}

// --- Router per tipo di step ---------------------------------------------
function StepView({ step, onCorrect, onWrong }: { step: Step; onCorrect: () => void; onWrong: () => void }) {
  if (step.kind === "theory")
    return <TheoryStepView step={step} onCorrect={onCorrect} onWrong={onWrong} />;
  return <DrawStepView step={step} onCorrect={onCorrect} onWrong={onWrong} />;
}

// --- Step di teoria --------------------------------------------------------
function TheoryStepView({
  step,
  onCorrect,
  onWrong,
}: {
  step: Extract<Step, { kind: "theory" }>;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const isRight = sel === step.answer;

  return (
    <div>
      <h1 className="mb-5 font-display text-2xl font-bold leading-snug">{step.prompt}</h1>
      <div className="space-y-3">
        {step.options.map((opt, i) => {
          const state =
            checked && i === step.answer
              ? "right"
              : checked && i === sel && !isRight
                ? "wrong"
                : sel === i
                  ? "sel"
                  : "idle";
          return (
            <button
              key={i}
              disabled={checked}
              onClick={() => setSel(i)}
              className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition ${
                state === "right"
                  ? "border-lime bg-lime/10 text-lime"
                  : state === "wrong"
                    ? "border-rosso bg-rosso/10 text-rosso"
                    : state === "sel"
                      ? "border-lime bg-white/[0.04]"
                      : "border-white/10 hover:border-white/30"
              }`}
            >
              <span className="flex-1">{opt}</span>
              {state === "right" && <Check size={18} />}
              {state === "wrong" && <X size={18} />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`mt-4 overflow-hidden rounded-xl p-4 text-sm ${isRight ? "bg-lime/10 text-lime" : "bg-rosso/10 text-rosso"}`}
          >
            <p className="font-semibold">{isRight ? "Esatto!" : "Non proprio."}</p>
            <p className="mt-1 text-white/80">{step.explain}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterButton
        disabled={sel === null}
        checked={checked}
        right={isRight}
        onCheck={() => {
          setChecked(true);
          if (!isRight) onWrong();
        }}
        onContinue={onCorrect}
        onRetry={() => {
          setChecked(false);
          setSel(null);
        }}
      />
    </div>
  );
}

// --- Step di disegno molecola ---------------------------------------------
function DrawStepView({
  step,
  onCorrect,
  onWrong,
}: {
  step: Extract<Step, { kind: "draw" }>;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const [drawn, setDrawn] = useState<Molecule>(emptyMolecule());
  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false);

  const fb = useMemo(
    () => (checked ? evaluate(drawn, step.expected) : null),
    [checked, drawn, step.expected],
  );

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold leading-snug">{step.prompt}</h1>
      <button
        onClick={() => setShowHint((s) => !s)}
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 transition hover:text-lime"
      >
        <Lightbulb size={14} /> {showHint ? "Nascondi suggerimento" : "Suggerimento"}
      </button>
      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden rounded-lg bg-white/5 px-3 py-2 text-sm text-white/70"
          >
            {step.hint}
          </motion.p>
        )}
      </AnimatePresence>

      <MoleculeCanvas
        value={drawn}
        onChange={(m) => {
          setDrawn(m);
          if (checked) setChecked(false); // ridisegnare azzera l'esito
        }}
      />

      <AnimatePresence>
        {fb && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 rounded-xl p-4 text-sm ${fb.correct ? "bg-lime/10 text-lime" : "bg-rosso/10 text-rosso"}`}
          >
            <p className="font-display text-base font-bold">{fb.title}</p>
            {fb.good.length > 0 && (
              <ul className="mt-2 space-y-1">
                {fb.good.map((g, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-lime">
                    <Check size={15} className="mt-0.5 shrink-0" /> {g}
                  </li>
                ))}
              </ul>
            )}
            {fb.lines.length > 0 && (
              <ul className="mt-2 space-y-1 text-white/80">
                {fb.lines.map((l, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ArrowRight size={15} className="mt-0.5 shrink-0" /> {l}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <FooterButton
        disabled={drawn.atoms.length === 0}
        checked={checked}
        right={!!fb?.correct}
        onCheck={() => {
          const result = evaluate(drawn, step.expected);
          setChecked(true);
          if (!result.correct) onWrong();
        }}
        onContinue={onCorrect}
        onRetry={() => setChecked(false)}
      />
    </div>
  );
}

// --- Bottone footer condiviso (verifica / continua / riprova) -------------
function FooterButton({
  disabled,
  checked,
  right,
  onCheck,
  onContinue,
  onRetry,
}: {
  disabled: boolean;
  checked: boolean;
  right: boolean;
  onCheck: () => void;
  onContinue: () => void;
  onRetry: () => void;
}) {
  if (!checked)
    return (
      <button
        disabled={disabled}
        onClick={onCheck}
        className="mt-6 w-full rounded-xl bg-lime py-3.5 font-display text-base font-bold text-ink-900 shadow-lime transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
      >
        Verifica
      </button>
    );
  if (right)
    return (
      <button
        onClick={onContinue}
        className="mt-6 w-full rounded-xl bg-lime py-3.5 font-display text-base font-bold text-ink-900 shadow-lime transition hover:bg-lime-400"
      >
        Continua
      </button>
    );
  return (
    <button
      onClick={onRetry}
      className="mt-6 w-full rounded-xl bg-rosso py-3.5 font-display text-base font-bold text-white shadow-rosso transition hover:bg-rosso-400"
    >
      Riprova
    </button>
  );
}

// --- Schermata premio (fine capitolo) -------------------------------------
function RewardScreen({ xp, onRestart }: { xp: number; onRestart: () => void }) {
  return (
    <motion.div
      key="reward"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl border border-lime/30 bg-gradient-to-b from-lime/10 to-transparent p-8 text-center"
    >
      <motion.div
        initial={{ rotate: -10, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-lime text-ink-900 shadow-lime"
      >
        <GraduationCap size={40} />
      </motion.div>
      <h1 className="font-display text-3xl font-bold">Capitolo completato!</h1>
      <p className="mt-2 text-white/70">
        Hai guadagnato <span className="font-bold text-lime">{xp} XP</span> studiando gli amminoacidi.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rosso">
          <Ticket size={15} /> Premio sbloccato · {ATENEO.nome}
        </p>
        <p className="mt-2 font-display text-lg font-bold">{ATENEO.premio}</p>
        <p className="mt-1 text-sm text-white/60">
          Offerto da <span className="text-white/90">{ATENEO.partner}</span>. Mostra il
          codice all'ingresso.
        </p>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-lime/40 bg-lime/5 px-4 py-3">
          <span className="font-mono text-lg font-bold tracking-widest text-lime">
            BIOCHEM-{(1000 + xp).toString(36).toUpperCase()}
          </span>
          <span className="text-xs text-white/40">valido ven.</span>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-6 w-full rounded-xl bg-white/10 py-3 font-display font-bold transition hover:bg-white/20"
      >
        Rifai il capitolo
      </button>
      <p className="mt-3 text-xs text-white/30">
        Demo: il premio per-ateneo e il partner sono configurabili per ogni università.
      </p>
    </motion.div>
  );
}

// --- Schermata vite esaurite ----------------------------------------------
function FailScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      key="fail"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl border border-rosso/30 bg-gradient-to-b from-rosso/10 to-transparent p-8 text-center"
    >
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rosso/20">
        <Heart size={40} className="text-rosso" />
      </div>
      <h1 className="font-display text-2xl font-bold">Vite esaurite</h1>
      <p className="mt-2 text-white/70">
        Niente paura: gli errori sono parte dello studio. Ripassa il suggerimento e riprova.
      </p>
      <button
        onClick={onRetry}
        className="mt-6 w-full rounded-xl bg-lime py-3.5 font-display font-bold text-ink-900 shadow-lime transition hover:bg-lime-400"
      >
        Ricomincia il capitolo
      </button>
    </motion.div>
  );
}
