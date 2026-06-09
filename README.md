# Centro Sportivo — Calcio a 5 (sito vetrina)

Sito **moderno e minimal** per una struttura con **2 campi di calcio a 5**.
Prenotazione **solo via WhatsApp** (nessuna chiamata). Next.js + Tailwind +
**Framer Motion** + **react-three-fiber** (pallone 3D) con parallax al mouse/dito.

## Caratteristiche

- 🏟️ Hero a tutto schermo con la **foto iconica** del campo + slogan "Preferisco vivere"
- ⚽ **Pallone 3D** interattivo (reagisce al puntatore) + icone con effetto 3D-tilt
- 🖱️ **Parallax** dinamico al movimento di mouse/dito e allo scroll
- 📲 Prenotazione **solo via WhatsApp** (bottone fisso sempre visibile, niente telefono)
- 🥅 Sezione **PV Soccer Training** (tecnica individuale)
- 📖 Sezione **Storia del campo** valorizzata
- ⭐ Servizi: 6€ a persona, illuminazione inclusa, docce calde, bar con tavolini esterni

## Avvio in locale

```powershell
npm install      # solo la prima volta
npm run dev      # http://localhost:3000
```

## ⚙️ DATI DA INSERIRE — tutto in un solo file: `lib/site.ts`

Apri `lib/site.ts` e sostituisci i valori con "TODO":

- **`name`** → nome reale della struttura
- **`whatsapp`** → numero WhatsApp reale (formato internazionale senza "+", es. `393331234567`)
- **`city`** → città / zona
- **`STORY`** → testo reale della storia del campo
- **`TRAINING`** → dettagli reali di PV Soccer Training
- (opzionale) **`instagram`** → link profilo

## 🖼️ FOTO DA AGGIUNGERE — nella cartella `public/`

Vedi `public/LEGGIMI-immagini.txt`. Nomi esatti:

- `hero.jpg` → la foto iconica (quella con "PREFERISCO VIVERE"): è lo sfondo della home
- `campo-1.jpg`, `campo-2.jpg` → i due campi
- `training.jpg` → foto allenamento

Finché un file non c'è, compare un segnaposto elegante; appena lo aggiungi appare la foto.

## Pubblicare online (Vercel)

1. Carica la cartella su un repository GitHub.
2. Importa il repo su [vercel.com](https://vercel.com) e premi *Deploy*. Nessuna
   configurazione particolare: è un sito statico/SSR senza database.
