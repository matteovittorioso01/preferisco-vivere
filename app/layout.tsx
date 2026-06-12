import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ParallaxProvider } from "@/lib/parallax";
import { BookingProvider } from "@/components/BookingModal";
import { SITE } from "@/lib/site";

const description =
  "Due campi di calcio a 5 con illuminazione inclusa, docce calde e bar con tavolini esterni. Allenamenti di tecnica individuale PV Soccer Training. Prenota comodamente su WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL("https://preferisco-vivere.vercel.app"),
  title: `${SITE.name} | Calcio a 5 · Prenota su WhatsApp`,
  description,
  openGraph: {
    title: `${SITE.name} | Calcio a 5`,
    description,
    url: "/",
    siteName: SITE.name,
    images: [{ url: SITE.heroImage, width: 512, height: 288 }],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Calcio a 5`,
    description,
    images: [SITE.heroImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0B0D",
};

// Dati strutturati per Google (scheda della struttura nei risultati di ricerca).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: SITE.name,
  description,
  url: "https://preferisco-vivere.vercel.app",
  telephone: "+39 339 577 7494",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Caivano",
    addressRegion: "NA",
    addressCountry: "IT",
  },
  hasMap: SITE.mapsUrl,
  openingHours: "Mo-Su 15:00-24:00",
  sameAs: [SITE.instagram, SITE.facebook, SITE.youtube, SITE.tiktok].filter(
    Boolean,
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ParallaxProvider>
          <BookingProvider>{children}</BookingProvider>
        </ParallaxProvider>
      </body>
    </html>
  );
}
