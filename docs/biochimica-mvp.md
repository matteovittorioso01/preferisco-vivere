# BioChem — MVP app di studio (Capitolo 1: Amminoacidi)

Primo mattone dell'ecosistema di app per studiare all'università. Materia
pilota: **biochimica**, in stile playful (Duolingo), con disegno della
struttura + feedback didattico in tempo reale.

Route: **`/biochimica`**

## L'idea tecnica chiave: VERIFICARE, non riconoscere

In un esercizio conosciamo già la struttura attesa, quindi il compito non è
"indovinare" cosa ha disegnato lo studente nel vuoto (problema aperto, fragile),
ma **verificare** il disegno contro l'atteso e dire *dove* ha sbagliato.
Verificare è molto più affidabile e dà feedback preciso ("ti manca un azoto",
"il doppio legame va sul carbonio, non sull'ossigeno").

Questo evita di dover addestrare da zero un modello di riconoscimento (costoso e
con bisogno di enormi dataset multi-calligrafia). La strada verso la scrittura a
mano libera resta aperta come v2: si cattura il **tratto** (digital ink) e lo si
confronta con l'atteso — sempre verifica, non riconoscimento open-ended.

## Cosa c'è in questo MVP

- **Scrittura a mano libera** (`components/biochem/FreehandCanvas.tsx` + `lib/ink.ts`)
  Lo studente **scrive** la struttura: lettere degli atomi (C, O, N, H, S, P) e
  tratti per i legami. Riconoscimento con l'algoritmo **$P (point-cloud)** —
  template-based, **zero dataset/training**. Pipeline: raggruppa i tratti in
  glifi (vicinanza spaziale+temporale) → distingue i tratti-legame (lunghi e
  dritti) → riconosce ogni glifo via $P → assembla la molecola (anche doppi/
  tripli legami da tratti paralleli). Il risultato confluisce nello stesso
  `evaluate()`. È **verifica, non riconoscimento open-ended**.

- **Builder di molecole** (`components/biochem/MoleculeCanvas.tsx`)
  Editor tap-to-build affidabile, usato anche per **correggere** la lettura a
  mano: tavolozza elementi, strumenti Atomo / Legame / Gomma, legami
  singolo→doppio→triplo. SVG, touch-friendly. Le due modalità si scambiano via
  `StructureInput.tsx` mantenendo la struttura.

- **Motore chimico** (`lib/chem.ts`)
  - confronto strutturale via **Weisfeiler–Lehman** (isomorfismo robusto su
    molecole piccole: indipendente da ordine/coordinate del disegno);
  - **feedback diff**: atomi mancanti/in eccesso, legami sbagliati,
    connettività errata;
  - riconoscimento **gruppi funzionali** (carbossile, amminico) per rinforzo
    positivo;
  - contenuti del Capitolo 1 (teoria + disegno di glicina e alanina).

- **Schermata gamificata** (`app/biochimica/page.tsx`)
  Vite (cuori), streak, XP, barra di progresso, step alternati teoria/disegno,
  e **premio di fine capitolo per-ateneo** (codice sconto per la serata
  universitaria di un partner locale) — la leva di engagement.

## Come provarlo

```bash
npm install
npm run dev       # http://localhost:3000/biochimica
```

Percorso: rispondi alla teoria → disegna la glicina (N–Cα–C(=O)–OH) → teoria →
disegna l'alanina (glicina + un –CH₃ sul Cα) → premio.

## Prossimi passi suggeriti

1. **Contenuti**: più capitoli (legame peptidico, struttura proteica, enzimi…),
   curati/verificati da chi conosce la materia.
2. **Per-ateneo**: rilevare l'università (email .edu / scelta in onboarding),
   programma e premi configurabili per ateneo + partner locali.
3. **Persistenza**: salvare progresso/XP/streak (account, non solo locale).
4. **Riconoscimento a mano libera — migliorare**: la base $P c'è e funziona su
   scrittura ragionevole, ma è best-effort (no dataset). Ogni studente che usa
   l'app — e corregge la lettura in «Costruisci» — genera **dati etichettati**:
   quello diventa il dataset per un riconoscitore robusto, il vero fossato
   competitivo.
