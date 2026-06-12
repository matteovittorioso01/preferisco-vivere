"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Slideshow che ruota automaticamente tra più immagini (dissolvenza).
// Le immagini VERTICALI (es. volantini) vengono mostrate intere, con una
// versione sfocata sullo sfondo a riempire il riquadro; quelle orizzontali
// riempiono il riquadro come di consueto.
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
  const [portrait, setPortrait] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (safe.length <= 1) return;
    const id = setInterval(
      () => setI((prev) => (prev + 1) % safe.length),
      interval,
    );
    return () => clearInterval(id);
  }, [safe.length, interval]);

  const src = safe[i];
  const isPortrait = !!portrait[src];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* sfondo sfocato di riempimento per le immagini verticali */}
          {isPortrait && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-lg"
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              const im = e.currentTarget;
              setPortrait((p) =>
                p[src] !== undefined
                  ? p
                  : { ...p, [src]: im.naturalHeight > im.naturalWidth },
              );
            }}
            className={`absolute inset-0 h-full w-full ${
              isPortrait ? "object-contain" : "object-cover"
            }`}
          />
        </motion.div>
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
