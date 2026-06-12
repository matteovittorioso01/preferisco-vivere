// ============================================================================
//  CONFIGURAZIONE DEL SITO — MODIFICA QUI tutti i dati reali.
//  (nome, città, numero WhatsApp, testi, prezzi...).
//  I valori con "TODO" sono segnaposto da sostituire.
// ============================================================================

export const SITE = {
  // Nome dal profilo Instagram @preferisco_vivere (conferma o modifica)
  name: "Preferisco Vivere",
  shortName: "Preferisco Vivere",

  // Scritta iconica presente sul muro del campo (la foto della home)
  slogan: "Preferisco\nvivere.",

  tagline:
    "Due campi di calcio a 5 dove il quartiere scende in campo. Luci, docce e bar: tu pensa solo a giocare.",

  city: "Caivano",

  // WhatsApp in formato internazionale SENZA "+" (+39 339 577 7494)
  whatsapp: "393395777494",

  // opzionali (lascia "" per nasconderli)
  instagram:
    "https://www.instagram.com/preferisco_vivere?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  facebook: "https://www.facebook.com/Centrosportivopreferiscovivere/",
  youtube: "https://www.youtube.com/channel/UCUUwmFPZDHGqXNDaWeRXEUA",
  tiktok:
    "https://www.tiktok.com/@preferiscovivere?is_from_webapp=1&sender_device=pc",
  mapsUrl:
    "https://www.google.com/maps/place//data=!4m2!3m1!1s0x133baa0c35ace4bb:0x8c9e71364abb50ad?sa=X&ved=1t:8290&ictx=111",

  hours: "Tutti i giorni · 15:00 – 24:00",

  // Immagine iconica della home: salva la foto in /public/hero.jpg
  heroImage: "/hero.jpg",
};

/** Messaggio WhatsApp precompilato per la prenotazione (campi da compilare). */
export function bookingMessage(court?: string): string {
  return (
    "Ciao! Vorrei prenotare un campo.\n\n" +
    "Nome: \n" +
    "Cognome: \n" +
    "Campo da prenotare: " +
    (court ?? "") +
    "\n" +
    "Orario della prenotazione: "
  );
}

/** Costruisce un link WhatsApp con messaggio precompilato. */
export function waLink(message?: string): string {
  const text = message ?? bookingMessage();
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export interface Court {
  id: string;
  name: string;
  tag: string;
  description: string;
  image: string; // file in /public oppure URL
}

export const COURTS: Court[] = [
  {
    id: "campo-1",
    name: "Campo 1",
    tag: "Calcio a 5",
    description:
      "Manto in erba sintetica e fondo perfetto in ogni stagione. Il campo storico, quello delle partite che non finiscono mai.",
    image: "/campo-1.jpg",
  },
  {
    id: "campo-2",
    name: "Campo 2",
    tag: "Calcio a 5",
    description:
      "Secondo campo a 5, ideale per tornei e doppie sfide. Stessa cura, stesso divertimento, il doppio delle partite.",
    image: "/campo-2.jpg",
  },
];

export interface Service {
  icon: "calcio" | "pvtraining" | "bar" | "parking";
  title: string;
  text: string;
}

export const SERVICES: Service[] = [
  { icon: "calcio", title: "Calcio a 5", text: "Due campi in erba" },
  { icon: "pvtraining", title: "PV Soccer Training", text: "Tecnica 1to1" },
  { icon: "bar", title: "Bar & tavolini", text: "Relax all'aperto" },
  { icon: "parking", title: "Parcheggio", text: "Gratuito e ampio" },
];

// Foto reali da mostrare a rotazione (in /public/campi e /public/training)
export const CAMPI_PHOTOS = [
  "/campi/01.jpg",
  "/campi/02.jpg",
  "/campi/03.jpg",
  "/campi/04.jpg",
  "/campi/05.jpg",
];

export const TRAINING_PHOTOS = ["/training/05.jpg", "/training/06.jpg"];

export interface Sponsor {
  name: string;
  logo: string;
  // URL del sito del partner (lascia "" se non lo si vuole rendere cliccabile)
  url?: string;
}

export const SPONSORS: Sponsor[] = [
  { name: "Mondial Service", logo: "/sponsor/mondial.png", url: "" },
  { name: "WindTre Caivano", logo: "/sponsor/windtre.png", url: "" },
  { name: "H.C.G. Parrucchieri", logo: "/sponsor/hcg.png", url: "https://hcgparrucchieri.salonitalia.it/" },
];

export const TRAINING = {
  brand: "PV Soccer Training",
  title: "Tecnica individuale",
  text:
    "Un progetto in sinergia con le scuole calcio: non sostituiamo l'allenatore della squadra, lo supportiamo nella formazione individuale del giovane giocatore. Cura del dettaglio sotto ogni aspetto — tecnico, tattico individuale e cognitivo — per valorizzare il singolo e seguirlo nelle sue fasi di crescita.",
  textHtml:
    "Un progetto in <strong>sinergia con le scuole calcio</strong>: non sostituiamo l'allenatore della squadra, lo <strong>supportiamo nella formazione individuale</strong> del giovane giocatore. Cura del dettaglio sotto ogni aspetto — <strong>tecnico, tattico individuale e cognitivo</strong> — per <strong>valorizzare il singolo</strong> e seguirlo nelle sue fasi di crescita.",
  bullets: [
    "Gruppi da massimo 6 ragazzi",
    "Possibilità di allenamento 1-a-1 col coach",
    "Lavoro tecnico, tattico individuale e cognitivo",
    "Un coach che spiega, dimostra e corregge ogni gesto",
  ],
  learnTitle: "Cosa imparerai",
  learn: [
    "<strong>Dominare la palla</strong> con tutte le superfici del piede",
    "Affrontare l'<strong>1 contro 1</strong> con sicurezza e coraggio",
    "Trasformare il gesto tecnico in un <strong>automatismo</strong>",
    "Costruire una <strong>mentalità offensiva e vincente</strong>",
    "Eseguire ogni gesto a <strong>massima velocità</strong> fisica e mentale",
    "Sviluppare in autonomia <strong>nuove abilità tecniche</strong>",
    "Gestire la <strong>transizione mentale</strong> tra più gesti combinati",
    "<strong>Gestire la fatica</strong> senza perdere efficacia nel gesto",
    "Aumentare <strong>autostima e sicurezza</strong> nella gestione della palla",
  ],
};

export const STORY = {
  title: "La storia del campo",
  // TODO: sostituire con la storia reale della struttura
  intro:
    "Non è solo un campo: è il punto di ritrovo di intere generazioni. Qui sono cresciute amicizie, rivalità leggendarie e partite che si raccontano ancora oggi.",
  paragraphs: [
    "Tutto è iniziato con un'idea semplice: dare al quartiere un posto dove ritrovarsi, sudare e divertirsi. Da allora, ogni sera le luci si accendono e il campo torna a riempirsi di voci.",
    "Sul muro campeggia una scritta diventata simbolo: «Preferisco vivere». Perché è questo che succede qui — si vive, una partita alla volta.",
    "Dal 2001 questo campo è un punto di riferimento per i ragazzi e gli adulti che amano questo sport: una certezza che si rinnova a ogni partita.",
  ],
  // Mini-timeline (TODO: anni e tappe reali)
  timeline: [
    { year: "2001", text: "Nasce il campo: l'inizio di tutto." },
    { year: "La crescita", text: "Tornei, squadre fisse e serate sold-out." },
    { year: "Oggi", text: "Due campi, il bar, gli allenamenti: la casa del quartiere." },
  ],
};
