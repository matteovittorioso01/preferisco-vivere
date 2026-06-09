const ITEMS = [
  "Calcio a 5",
  "Preferisco vivere",
  "6€ a persona",
  "Luci incluse",
  "Docce calde",
  "Bar & tavolini",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-ink-800 py-5">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-xl font-bold uppercase tracking-tight text-white/80">
              {t}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          </span>
        ))}
      </div>
    </div>
  );
}
