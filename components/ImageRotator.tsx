"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Slideshow che ruota automaticamente tra più immagini (dissolvenza).
export default function ImageRotator({
  images,
  alt,
  className = "",
  interval = 4500,
  startIndex = 0,
  showDots = true,
}: {
  images: string[];
  alt: string;
  className?: string;
  interval?: number;
  startIndex?: number;
  showDots?: boolean;
}) {
  const safe = images.length ? images : ["/hero.jpg"];
  const [i, setI] = useState(startIndex % safe.length);

  useEffect(() => {
    if (safe.length <= 1) return;
    const id = setInterval(
      () => setI((prev) => (prev + 1) % safe.length),
      interval,
    );
    return () => clearInterval(id);
  }, [safe.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={safe[i]}
          src={safe[i]}
          alt={alt}
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* puntini indicatori */}
      {showDots && safe.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {safe.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-5 bg-lime" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
