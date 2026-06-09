"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

// Immagine con fallback elegante: se il file in /public non esiste ancora,
// mostra un riquadro con gradiente e un'etichetta (slot per la foto reale).
export default function Img({
  src,
  alt,
  className = "",
  label = "Foto in arrivo",
}: {
  src: string;
  alt: string;
  className?: string;
  label?: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`grain flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-ink-600 to-ink-900 ${className}`}
      >
        <ImageOff className="text-white/20" size={26} />
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/30">
          {label}
        </span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
    />
  );
}
