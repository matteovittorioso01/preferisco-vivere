"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { COURTS, waLink } from "@/lib/site";

// Contesto globale: i bottoni "Prenota" aprono questo popup.
const BookingCtx = createContext<(court?: string) => void>(() => {});
export function useBooking() {
  return useContext(BookingCtx);
}

function WaGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.74 5.5 2.13 7.9L.5 31.5l7.8-2.05A15.4 15.4 0 0 0 16 31.5C24.6 31.5 31.5 24.6 31.5 16S24.6.5 16 .5Zm0 28.2c-2.5 0-4.95-.67-7.08-1.94l-.5-.3-4.63 1.22 1.24-4.5-.33-.52A12.7 12.7 0 1 1 16 28.7Zm7.1-9.5c-.39-.2-2.3-1.13-2.66-1.26-.36-.13-.62-.2-.88.2-.26.39-1 1.26-1.23 1.52-.23.26-.45.29-.84.1-.39-.2-1.64-.6-3.12-1.92-1.15-1.03-1.93-2.3-2.16-2.69-.23-.39-.02-.6.17-.79.18-.18.39-.46.59-.69.2-.23.26-.39.39-.65.13-.26.07-.49-.03-.69-.1-.2-.88-2.12-1.2-2.9-.32-.76-.64-.66-.88-.67l-.75-.01c-.26 0-.69.1-1.05.49-.36.39-1.38 1.35-1.38 3.29 0 1.94 1.42 3.82 1.61 4.08.2.26 2.79 4.26 6.75 5.97.94.4 1.67.65 2.24.83.94.3 1.8.26 2.48.16.76-.12 2.3-.94 2.62-1.85.32-.91.32-1.69.23-1.85-.1-.16-.36-.26-.75-.46Z" />
    </svg>
  );
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [court, setCourt] = useState("");

  const openBooking = useCallback((c?: string) => {
    setCourt(c ?? "");
    setOpen(true);
  }, []);

  return (
    <BookingCtx.Provider value={openBooking}>
      {children}
      <AnimatePresence>
        {open && <Modal initialCourt={court} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </BookingCtx.Provider>
  );
}

function Modal({
  initialCourt,
  onClose,
}: {
  initialCourt: string;
  onClose: () => void;
}) {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [campo, setCampo] = useState(initialCourt || "Indifferente");
  const [orario, setOrario] = useState("");
  const [sent, setSent] = useState(false);

  const canSend = nome.trim().length >= 2;

  function send() {
    const msg =
      "Ciao! Vorrei prenotare un campo.\n\n" +
      `Nome: ${nome}\n` +
      `Cognome: ${cognome}\n` +
      `Campo da prenotare: ${campo}\n` +
      `Orario della prenotazione: ${orario}`;
    window.open(waLink(msg), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="glass relative z-10 w-full max-w-md rounded-t-3xl p-6 sm:rounded-3xl sm:p-8"
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 260 }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-white/50 transition hover:text-white"
          aria-label="Chiudi"
        >
          <X size={20} />
        </button>

        {sent ? (
          <Sent onClose={onClose} />
        ) : (
          <>
            <div className="flex items-center gap-2 text-lime">
              <WaGlyph className="h-5 w-5" />
              <h3 className="font-display text-xl font-extrabold text-white">
                Prenota su WhatsApp
              </h3>
            </div>
            <p className="mt-1 text-sm text-white/50">
              Compila e invia: ti ricontattiamo noi per confermare la
              disponibilità.
            </p>

            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome *" value={nome} onChange={setNome} placeholder="Mario" />
                <Field label="Cognome" value={cognome} onChange={setCognome} placeholder="Rossi" />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60">
                  Campo da prenotare
                </label>
                <select
                  value={campo}
                  onChange={(e) => setCampo(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-white outline-none transition [color-scheme:dark] focus:border-lime/60"
                >
                  {COURTS.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="Indifferente">Indifferente</option>
                </select>
              </div>

              <Field
                label="Giorno e orario"
                value={orario}
                onChange={setOrario}
                placeholder="Es. venerdì ore 21:00"
              />

              {/* scorciatoie: un tocco e il campo si compila da solo */}
              <div className="flex flex-wrap gap-1.5">
                {["Oggi", "Domani", "Sabato", "Domenica"].map((d) => (
                  <Chip
                    key={d}
                    selected={orario.startsWith(d)}
                    onClick={() =>
                      setOrario((prev) => {
                        const time = prev.match(/ore\s.+$/)?.[0];
                        return time ? `${d} ${time}` : d;
                      })
                    }
                  >
                    {d}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["18:00", "19:00", "20:00", "21:00", "22:00", "23:00"].map((t) => (
                  <Chip
                    key={t}
                    selected={orario.endsWith(`ore ${t}`)}
                    onClick={() =>
                      setOrario((prev) => {
                        const day = prev.replace(/\s*ore\s.+$/, "").trim();
                        return `${day ? day + " " : ""}ore ${t}`;
                      })
                    }
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </div>

            <button
              onClick={send}
              disabled={!canSend}
              className="group relative mt-6 inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-b from-[#FFE45C] via-lime to-[#ECC400] px-6 py-3.5 font-bold text-ink-900 shadow-[0_4px_22px_-8px_rgba(255,214,10,0.5),inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:shadow-[0_8px_36px_-8px_rgba(255,214,10,0.8)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-[160%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[160%]"
              />
              <WaGlyph className="relative h-5 w-5" />
              <span className="relative">Invia su WhatsApp</span>
            </button>
            <p className="mt-3 text-center text-xs text-white/30">
              Si aprirà WhatsApp con il messaggio già pronto da inviare.
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function Sent({ onClose }: { onClose: () => void }) {
  const colors = ["#FFD60A", "#22C55E", "#ffffff"];
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        x: (Math.random() * 2 - 1) * 240,
        y: (Math.random() * 2 - 1) * 180,
        rot: Math.random() * 360,
        delay: Math.random() * 0.2,
        color: colors[i % colors.length],
      })),
    [],
  );

  return (
    <div className="relative py-4 text-center">
      <div className="pointer-events-none absolute left-1/2 top-12">
        {pieces.map((p, i) => (
          <motion.span
            key={i}
            className="absolute h-2.5 w-2.5 rounded-[2px]"
            style={{ background: p.color }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: p.x,
              y: p.y,
              rotate: p.rot,
              scale: [0, 1, 1, 0.8],
            }}
            transition={{ duration: 1.5, delay: p.delay, ease: "easeOut" }}
          />
        ))}
      </div>

      <motion.svg viewBox="0 0 52 52" className="relative mx-auto h-20 w-20">
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="#22C55E"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M15 27 l7 7 l15 -15"
          fill="none"
          stroke="#FFD60A"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.45, ease: "easeOut" }}
        />
      </motion.svg>

      <h3 className="relative mt-4 font-display text-2xl font-extrabold">
        Messaggio inviato! 🎉
      </h3>
      <p className="relative mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/60">
        Conferma l&apos;invio su WhatsApp: ti ricontattiamo al più presto per
        confermare la prenotazione. Ci vediamo in campo!
      </p>
      <button
        onClick={onClose}
        className="relative mt-6 rounded-full bg-lime px-7 py-2.5 text-sm font-bold text-ink-900 transition hover:shadow-lime-sm"
      >
        Perfetto
      </button>
    </div>
  );
}

function Chip({
  children,
  onClick,
  selected,
}: {
  children: ReactNode;
  onClick: () => void;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
        selected
          ? "border-lime bg-lime/10 text-lime"
          : "border-white/10 text-white/60 hover:border-lime/50 hover:text-lime"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/60">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-lime/60"
      />
    </div>
  );
}
