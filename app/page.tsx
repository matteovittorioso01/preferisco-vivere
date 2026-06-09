import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Campi from "@/components/Campi";
import Servizi from "@/components/Servizi";
import Training from "@/components/Training";
import Storia from "@/components/Storia";
import Partnership from "@/components/Partnership";
import Contatti from "@/components/Contatti";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink-900">
      <Nav />
      <Hero />
      <Marquee />
      <Campi />
      <Servizi />
      <Training />
      <Storia />
      <Partnership />
      <Contatti />
      <FloatingWhatsApp />
    </main>
  );
}
