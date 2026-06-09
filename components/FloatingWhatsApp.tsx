"use client";

import { motion } from "framer-motion";
import { WhatsAppIcon } from "./WhatsApp";
import { useBooking } from "./BookingModal";

export default function FloatingWhatsApp() {
  const openBooking = useBooking();

  return (
    <motion.button
      type="button"
      onClick={() => openBooking()}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 14 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_-6px_rgba(37,211,102,0.6)]"
      aria-label="Prenota su WhatsApp"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
      <WhatsAppIcon className="relative h-7 w-7" />
    </motion.button>
  );
}
