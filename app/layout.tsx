import type { Metadata } from "next";
import "./globals.css";
import { ParallaxProvider } from "@/lib/parallax";
import { BookingProvider } from "@/components/BookingModal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} | Calcio a 5 · Prenota su WhatsApp`,
  description:
    "Due campi di calcio a 5 con illuminazione inclusa, docce calde e bar con tavolini esterni. Allenamenti di tecnica individuale. Prenota comodamente su WhatsApp.",
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
        <ParallaxProvider>
          <BookingProvider>{children}</BookingProvider>
        </ParallaxProvider>
      </body>
    </html>
  );
}
