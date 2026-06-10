"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";
import WhatsAppButton from "./WhatsApp";

const links = [
  { href: "#campi", label: "Campi" },
  { href: "#servizi", label: "Servizi" },
  { href: "#training", label: "PV Soccer Training" },
  { href: "#storia", label: "Storia" },
  { href: "#contatti", label: "Contatti" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: evidenzia la voce della sezione attualmente visibile.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-white/10 bg-ink-900/70 backdrop-blur-xl" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#home" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-verde shadow-[0_0_14px_rgba(34,197,94,0.7)]" />
          <span className="font-display text-base font-bold tracking-tight">
            {SITE.shortName}
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`relative text-sm font-medium transition ${
                active === l.href ? "text-white" : "text-white/65 hover:text-white"
              }`}
            >
              {l.label}
              {active === l.href && (
                <motion.span
                  layoutId="nav-underline"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-lime to-verde"
                />
              )}
            </a>
          ))}
          <WhatsAppButton booking className="!px-5 !py-2 text-xs">
            Prenota
          </WhatsAppButton>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-white md:hidden"
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink-900/95 px-5 py-5 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={active === l.href ? "font-semibold text-lime" : "text-white/80"}
              >
                {l.label}
              </a>
            ))}
            <WhatsAppButton booking className="justify-center">
              Prenota su WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      )}
    </header>
  );
}
