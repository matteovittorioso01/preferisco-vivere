import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Stats from "@/components/Stats";
import Campi from "@/components/Campi";
import Servizi from "@/components/Servizi";
import Training from "@/components/Training";
import Storia from "@/components/Storia";
import Partnership from "@/components/Partnership";
import Contatti from "@/components/Contatti";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink-900">
      <ScrollProgress />
      <Nav />
      <Hero />
      <Marquee />
      <Stats />
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
