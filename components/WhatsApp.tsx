"use client";

import { motion } from "framer-motion";
import { waLink } from "@/lib/site";
import { useBooking } from "./BookingModal";

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.74 5.5 2.13 7.9L.5 31.5l7.8-2.05A15.4 15.4 0 0 0 16 31.5C24.6 31.5 31.5 24.6 31.5 16S24.6.5 16 .5Zm0 28.2c-2.5 0-4.95-.67-7.08-1.94l-.5-.3-4.63 1.22 1.24-4.5-.33-.52A12.7 12.7 0 1 1 16 28.7Zm7.1-9.5c-.39-.2-2.3-1.13-2.66-1.26-.36-.13-.62-.2-.88.2-.26.39-1 1.26-1.23 1.52-.23.26-.45.29-.84.1-.39-.2-1.64-.6-3.12-1.92-1.15-1.03-1.93-2.3-2.16-2.69-.23-.39-.02-.6.17-.79.18-.18.39-.46.59-.69.2-.23.26-.39.39-.65.13-.26.07-.49-.03-.69-.1-.2-.88-2.12-1.2-2.9-.32-.76-.64-.66-.88-.67l-.75-.01c-.26 0-.69.1-1.05.49-.36.39-1.38 1.35-1.38 3.29 0 1.94 1.42 3.82 1.61 4.08.2.26 2.79 4.26 6.75 5.97.94.4 1.67.65 2.24.83.94.3 1.8.26 2.48.16.76-.12 2.3-.94 2.62-1.85.32-.91.32-1.69.23-1.85-.1-.16-.36-.26-.75-.46Z" />
    </svg>
  );
}

export default function WhatsAppButton({
  message,
  children = "Prenota su WhatsApp",
  variant = "primary",
  className = "",
  booking = false,
  court,
}: {
  message?: string;
  children?: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  booking?: boolean;
  court?: string;
}) {
  const openBooking = useBooking();

  const base =
    variant === "primary"
      ? "group relative overflow-hidden bg-gradient-to-b from-[#FFE45C] via-lime to-[#ECC400] text-ink-900 shadow-[0_4px_22px_-8px_rgba(255,214,10,0.5),inset_0_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_8px_36px_-8px_rgba(255,214,10,0.8),inset_0_1px_0_rgba(255,255,255,0.55)]"
      : "border border-white/15 text-white hover:border-lime hover:text-lime";
  const cls = `inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold transition ${base} ${className}`;

  // riflesso che attraversa il bottone al passaggio del mouse
  const shine = variant === "primary" && (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-[160%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[160%]"
    />
  );

  // Bottone di prenotazione: apre il popup interno
  if (booking) {
    return (
      <motion.button
        type="button"
        onClick={() => openBooking(court)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={cls}
      >
        {shine}
        <WhatsAppIcon className="relative h-5 w-5" />
        <span className="relative">{children}</span>
      </motion.button>
    );
  }

  // Bottone WhatsApp diretto (per contatti generici, non prenotazioni)
  return (
    <motion.a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={cls}
    >
      {shine}
      <WhatsAppIcon className="relative h-5 w-5" />
      <span className="relative">{children}</span>
    </motion.a>
  );
}
