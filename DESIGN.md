# DESIGN.md — Site Craft Studio.

> Uredniška umirjenost YAUYA, prenesena v zeleno-črno tišino žajblja, z lanenim papirjem in toplim peskom kot edinim sijem. Gibanje je vedno namerno, nikoli dekorativni hrup.

---

## 1. Visual Theme & Atmosphere

**Style**: Dark Sage Editorial Studio
**Keywords**: uredniško, zeleno-črno, žajbelj, lan, topel pesek, tanke obrobe, ogromna tipografija, sticky slojevitost, filmsko, natančno
**Tone**: samozavestno, premium, umirjeno, naravno — NOT kričeče, »tech-bro« neon, generična SaaS predloga
**Feel**: kot galerija ob mraku: stene v globokem žajbljevem tonu, laneno platno na mizi, zadnja topla svetloba pade na rob svile. Nič ne kriči, vse je izbrano.

**Paleta (izhodišče naročnika):** `#586A6A` žajbelj (glavna barva znamke) · `#818D92` megla (modro-siva) · `#B9A394` pesek (topel taupe). Vse ostale barve so izpeljane iz teh treh.

**Reference**:
- **YAUYA (yauya.si)** — hero s celozaslonsko podlago in ogromnim wordmarkom čez spodnji rob; sticky navigacija pod herojem (zgornja vrstica + informacijski trak); pripeti naslovi s »foto-pilulami«; kartice, zložene s `position: sticky`; noga, ki se razkrije izza vsebine.
- **Fast Food Lan, Ahil fitnes, Bistro Bombina** — avtorjeve strani; njihovi živi elementi so vgrajeni v kartice projektov z lastnimi barvnimi tokeni.

**Interaction Tier**: **L3 — sostenitev (immersive)**
**Dependencies**: GSAP 3.15 (+ ScrollTrigger, SplitText) · Lenis 1.3 · surovi WebGL (1 fragment shader, brez knjižnice)

**Ritem podlag** (od vrha navzdol): hero (zeleno-črna + WebGL svila žajbelj/pesek) → nav (zeleno-črna + žajbljev trak) → pripet naslov (lan + zrno) → obljube (zeleno-črna, zdrsne čez) → storitve (zeleno-črna) → cenik (lan + zrno) → o meni (zeleno-črna) → projekti (zeleno-črna + lanene kartice) → kontakt (površina, zaobljeno dno) → noga (polna žajbljeva ploskev, razkritje).

---

## 2. Color Palette & Roles

```css
:root {
  /* Paleta — primitivi */
  --sage: #586A6A;             /* žajbelj — barva znamke */
  --mist: #818D92;             /* megla — sekundarno besedilo, linije */
  --sand: #B9A394;             /* pesek — topel poudarek na temnem */

  /* Backgrounds */
  --bg: #0F1414;               /* stran, hero, temne sekcije (zeleno-črna) */
  --surface: #141A1A;          /* kartice, kontakt */
  --surface-alt: #1A2121;      /* izmenične površine, bento ploščice */
  --surface-hover: #1D2525;    /* hover površin (megla ≥ 4,5:1) */
  --paper: #E7E1D9;            /* svetle sekcije — lan */
  --paper-2: #F2EEE8;          /* svetle kartice projektov in cenika */

  /* Borders */
  --border: #263030;           /* privzeta 1px obroba na temnem */
  --border-hover: #374343;     /* hover obroba */
  --paper-line: #D3C9BD;       /* 1px obroba na lanu */

  /* Text (temna podlaga) */
  --text: #F0ECE6;             /* naslovi — toplo bela (15,8:1) */
  --text-secondary: #A8B1B3;   /* telo (8,5:1) */
  --text-tertiary: #818D92;    /* = megla; oznake, meta (5,45:1 na bg, ≥ 4,5:1 na vseh temnih površinah) */

  /* Text (papir) */
  --ink: #121817;              /* 13,8:1 na lanu */
  --ink-2: #3B4646;            /* telo na lanu (7,5:1) */
  --ink-3: #5A6464;            /* meta na lanu (4,7:1) */

  /* Accent — žajbelj (dejanja) + pesek (poudarek) */
  --accent: #586A6A;           /* CTA, trak, noga, izpostavljen paket, pika v logotipu */
  --accent-hover: #607373;     /* belo besedilo 5,0:1 */
  --accent-press: #4A5959;     /* belo besedilo 7,3:1 */
  --accent-ink: #B9A394;       /* = pesek; poudarjeno besedilo na temnem (7,7:1), fokus */
  --accent-deep: #1B2B29;      /* globina v shaderju in gradientih */
  --accent-on-paper: #455555;  /* malo besedilo + fokus na lanu (6,0:1) */
  --on-accent: #FFFFFF;        /* besedilo na žajblju (5,7:1) */
  --on-accent-2: rgba(255, 255, 255, 0.84); /* sekundarno na žajblju (4,8:1) */

  /* RGB variants for rgba() */
  --bg-rgb: 15, 20, 20;
  --paper-rgb: 231, 225, 217;
  --text-rgb: 240, 236, 230;
  --accent-rgb: 88, 106, 106;
  --accent-ink-rgb: 185, 163, 148;
  --sage-rgb: 88, 106, 106;
  --mist-rgb: 129, 141, 146;
  --sand-rgb: 185, 163, 148;
  --shadow-rgb: 5, 10, 9;       /* sence in prekrivanja — zeleno-črne, nikoli čisto črne */
  --black-rgb: 0, 0, 0;
  --white-rgb: 255, 255, 255;

  /* Semantic (umirjene, a ločljive od žajblja) */
  --success: #8CC0A0;          /* 9,0:1 na bg */
  --error: #E8806F;            /* 6,9:1 na bg */
  --warning: #E0B46A;
  --success-ink: #2F6B4C;      /* na lanu (4,9:1) */
  --error-ink: #A83B2C;        /* na lanu (4,9:1) */

  /* Papirno zrno — statičen SVG feTurbulence (samo alfa), plast pod --paper */
  --grain: url("data:image/svg+xml,…");   /* polna vrednost v src/styles/tokens.css */

  /* Project brand tokens — SAMO znotraj kartic projektov (nespremenjeni) */
  --lan-ink: #1C1C1C;  --lan-ink-2: #262626;  --lan-sun: #F9CD1E;  --lan-cream: #F7F3E7;
  --ahil-ink: #0B0B0A; --ahil-chalk: #ECEBE6; --ahil-bronze: #B08D57; --ahil-gold: #D6AA6C; --ahil-deep: #7A5C33; --ahil-dim: #1E1912;
  --bmb-paper: #F6F1E7; --bmb-paper-deep: #EBE3D4; --bmb-ink: #16130F; --bmb-olive: #33452F; --bmb-terracotta: #C2703A; --bmb-clay: #A2422F; --bmb-straw: #D8BE86;
}
```

**Color Rules:**
- Vse barve gredo skozi CSS spremenljivke; v komponentah ni hex vrednosti (tudi v SVG uporabljaj `currentColor` ali `var(--…)`).
- **Tri vloge, ena paleta**:
  - **Žajbelj** (`--accent`) = dejanja in polne ploskve: CTA, informacijski trak, noga, izpostavljen paket, izbor besedila, pika v logotipu.
  - **Pesek** (`--accent-ink`) = poudarek na temnem: *italic* besede v naslovih, številke v eyebrow »(01)«, utripajoča pika, fokusni obroč, grebeni svile, sij izpostavljenega paketa.
  - **Megla** (`--text-tertiary`, `--mist`) = sekundarno besedilo, meta, hladna tančica v svili.
- Projektni tokeni živijo samo v vizualih kartic projektov.
- `--accent` (žajbelj) ni barva malega besedila na temnem (3,3:1) — tam uporabi `--accent-ink` (pesek).
- Na lanu je žajbelj dovolj kontrasten samo za veliko besedilo (4,4:1 → italic naslovi). Za malo besedilo, povezave in fokus na lanu uporabi `--accent-on-paper` (6,0:1).
- **Nikoli pesek na žajblju** (2,4:1) — na žajbljevi ploskvi je besedilo belo (`--on-accent`), dekorativna pika pa `--ink`.
- Sence in prekrivanja uporabljajo `--shadow-rgb` / `--bg-rgb` (zeleno-črno), ne čiste črne.

---

## 3. Typography Rules

**Font Stack** (self-hosted prek Fontsource — brez zahtev na Google strežnike zaradi GDPR in hitrosti; vir pisav je Google Fonts):
```css
/* Ekvivalent Google Fonts (za referenco):
   @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap&subset=latin-ext'); */
@import '@fontsource/instrument-serif/400.css';
@import '@fontsource/instrument-serif/400-italic.css';
@import '@fontsource-variable/geist';
@import '@fontsource-variable/geist-mono';

--font-display: 'Instrument Serif', 'Times New Roman', Georgia, serif;
--font-sans: 'Geist Variable', 'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'Geist Mono Variable', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Wordmark (hero, noga) | Instrument Serif | fit-to-width (`cqw`) | 400 | 0.82 | -0.035em |
| Display (pripeti naslovi) | Instrument Serif, UPPERCASE | clamp(2.6rem, 5.4vw, 5.75rem) | 400 | 1.02 | -0.01em |
| Section H2 | Instrument Serif | clamp(2.5rem, 5vw, 4.75rem) | 400 (*italic* za poudarek) | 1.0 | -0.02em |
| H3 (kartice projektov, cene) | Instrument Serif | clamp(1.9rem, 3vw, 3.25rem) | 400 | 1.02 | -0.015em |
| H4 (ploščice, paketi) | Geist | 1.125–1.25rem | 600 | 1.25 | -0.01em |
| Body L | Geist | clamp(1.0625rem, 1.2vw, 1.25rem) | 400 | 1.6 | — |
| Body | Geist | 1rem | 400 | 1.65 | — |
| Small | Geist | 0.875rem | 400/500 | 1.5 | — |
| Label / Eyebrow | Geist Mono, UPPERCASE | 0.75rem | 500 | 1.3 | 0.12em |
| Nav povezave | Geist, UPPERCASE | 0.8125rem | 500 | 1 | 0.08em |

**Typography Rules:**
- Display pisava ima samo težo 400 — veličina, ne debelina, nosi hierarhijo (enako kot YAUYA Lamore). Hero wordmark je ≥ 120px na namizju, zato je zahteva »Hero ≥ 60px« izpolnjena kljub teži 400 (zavestna odločitev).
- Vse pisave podpirajo latin-ext (č, š, ž, ć, đ).
- Eyebrow oznake imajo obliko »(01) Kaj delam« — številka v `--accent-ink` / `--accent`.
- Telo besedila nikoli pod 16px; vrstica največ 62ch.
- **NEVER use**: Inter, Roboto, Arial kot vidno pisavo, Montserrat, Poppins, sistemski serif kot display, več kot 3 družine (izjema: pisave znotraj projektnih vizualov niso dovoljene — uporabi obstoječe tri).

**Text Decoration** (po `text-decoration-rules.md`, slog »极简克制« — umirjeno):
- Hero wordmark (temna podlaga, ≥ 80px): brez gradienta; mehak žajbljev sij `text-shadow: 0 0 48px rgba(var(--sage-rgb), .45)`.
- Section H2: brez gradienta, brez senc (uredniška tišina). Poudarek je *italic* — na temnem v pesku (`--accent-ink`), na lanu v žajblju (`--accent`).
- Telo `p`: nobene dekoracije.
- Pika v »Site Craft Studio**.**« je vedno v `--accent` (na žajbljevi nogi v `--ink`).

---

## 4. Component Stylings

### Buttons (YAUYA »text-roll« + magnet)
```css
.btn {
  --btn-bg: var(--accent); --btn-fg: var(--on-accent); --btn-bd: var(--accent);
  position: relative; display: inline-flex; align-items: center; gap: .6em;
  min-height: 48px; padding: 0 1.4em; border-radius: 999px;
  font: 500 .875rem/1 var(--font-sans); letter-spacing: .04em; text-transform: uppercase;
  color: var(--btn-fg); background: var(--btn-bg); border: 1px solid var(--btn-bd);
  overflow: hidden; cursor: pointer;
  transition: background-color .3s var(--ease-out), border-color .3s var(--ease-out), color .3s var(--ease-out), transform .2s var(--ease-out);
}
.btn__roll { display: grid; overflow: hidden; height: 1em; line-height: 1; }
.btn__roll > span { grid-area: 1 / 1; transition: transform .5s var(--ease-in-out-quart); }
.btn__roll > span + span { transform: translateY(110%); }
.btn:hover { --btn-bg: var(--accent-hover); --btn-bd: var(--accent-hover); }
.btn:hover .btn__roll > span:first-child { transform: translateY(-110%); }
.btn:hover .btn__roll > span + span { transform: translateY(0); }
.btn:active { --btn-bg: var(--accent-press); transform: scale(.97); }
.btn:focus-visible { outline: 2px solid var(--accent-ink); outline-offset: 3px; }
.btn:disabled, .btn[aria-disabled='true'] { opacity: .45; cursor: not-allowed; pointer-events: none; }
/* Variante */
.btn--ghost { --btn-bg: transparent; --btn-fg: var(--text); --btn-bd: var(--border-hover); }
.btn--ghost:hover { --btn-bg: rgba(var(--white-rgb), .06); --btn-bd: var(--text); }
.btn--ink { --btn-bg: var(--ink); --btn-fg: var(--paper); --btn-bd: var(--ink); }           /* na papirju */
.btn--ink:hover { --btn-bg: var(--accent); --btn-bd: var(--accent); --btn-fg: var(--on-accent); }
```

### Cards (bento / SpotlightCard)
```css
.tile {
  position: relative; isolation: isolate; overflow: hidden;
  background: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--r-md);
  padding: clamp(20px, 2.2vw, 32px);
  transition: border-color .4s var(--ease-out), background-color .4s var(--ease-out), transform .4s var(--ease-out);
}
.tile::before { /* svetloba, ki sledi miški */
  content: ''; position: absolute; inset: 0; z-index: -1; opacity: 0;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--accent-rgb), .22), transparent 60%);
  transition: opacity .4s var(--ease-out);
}
.tile:hover { border-color: var(--border-hover); background: var(--surface-hover); }
.tile:hover::before { opacity: 1; }
.tile:focus-within { border-color: var(--accent-ink); }
```

### Navigation (YAUYA: zgornja vrstica + žajbljev trak, sticky pod herojem)
```css
.nav { position: sticky; top: 0; z-index: 50; }
.nav__bar {
  height: var(--nav-h-top); /* 72px; mobilno 60px */
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  padding-inline: var(--gutter);
  background: rgba(var(--bg-rgb), .88); backdrop-filter: blur(12px) saturate(140%);
  border-bottom: 1px solid var(--border);
}
.nav__strip { height: var(--nav-h-strip); /* 34px */ background: var(--accent); color: var(--on-accent);
  display: flex; align-items: center; justify-content: center; font: 500 .75rem/1 var(--font-mono); letter-spacing: .12em; text-transform: uppercase; }
.nav__link { position: relative; color: var(--text-secondary); transition: color .25s var(--ease-out); }
.nav__link:hover, .nav__link[aria-current='true'] { color: var(--text); }
.nav__link::after { content: ''; position: absolute; left: 0; right: 0; bottom: -6px; height: 1px; background: var(--accent-ink);
  transform: scaleX(0); transform-origin: right; transition: transform .4s var(--ease-out); }
.nav__link:hover::after, .nav__link[aria-current='true']::after { transform: scaleX(1); transform-origin: left; }
.nav__link:focus-visible { outline: 2px solid var(--accent-ink); outline-offset: 4px; border-radius: 2px; }
```

### Links
```css
.link { color: var(--accent-ink); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .25em;
  text-decoration-color: rgba(var(--accent-ink-rgb), .4); transition: text-decoration-color .25s, color .25s; }
.link:hover { color: var(--text); text-decoration-color: currentColor; }
.link:focus-visible { outline: 2px solid var(--accent-ink); outline-offset: 2px; border-radius: 2px; }
.on-paper .link { color: var(--accent-on-paper); text-decoration-color: rgba(var(--accent-rgb), .45); }
.on-paper :focus-visible, .on-paper .btn:focus-visible { outline-color: var(--accent-on-paper); } /* pesek na lanu = 1,85:1 */
```

### Tags / Badges / Eyebrow
```css
.eyebrow { font: 500 .75rem/1.3 var(--font-mono); letter-spacing: .12em; text-transform: uppercase; color: var(--text-tertiary); }
.eyebrow b { color: var(--accent-ink); font-weight: 500; }
.chip { display: inline-flex; align-items: center; gap: .4em; height: 28px; padding: 0 .75em; border-radius: 999px;
  border: 1px solid var(--border-hover); font: 500 .75rem/1 var(--font-mono); letter-spacing: .06em; color: var(--text-secondary); }
.badge { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
```

### Pricing card (izpostavljen: vrteča obroba žajbelj → pesek)
```css
.plan { position: relative; display: flex; flex-direction: column; gap: 20px; padding: 32px; border-radius: var(--r-md);
  background: var(--paper-2); border: 1px solid var(--paper-line); color: var(--ink); }
.plan:hover { border-color: var(--ink-3); }
.plan--featured { background: var(--ink); color: var(--text); border-color: transparent; }
.plan--featured .plan__glow { position: absolute; inset: -1px; border-radius: inherit; padding: 1px; overflow: hidden; z-index: -1; }
.plan--featured .plan__glow::before { content: ''; position: absolute; inset: -60%;
  background: conic-gradient(from 0deg, transparent 0 70%, var(--accent) 80%, var(--accent-ink) 85%, transparent 92%);
  animation: spin 6s linear infinite; }
```

### Project card (YAUYA sticky sklad)
```css
.pcard { position: sticky; top: calc(var(--nav-h) + 24px + var(--i) * 25px); z-index: calc(var(--i) + 1);
  display: grid; grid-template-columns: 1fr 1fr; gap: 28px; height: min(64vh, 620px); padding: 28px;
  background: var(--paper-2); color: var(--ink); border: 1px solid var(--paper-line); border-radius: var(--r-sm); }
.pcard__visual { border-radius: var(--r-xs); border: 1px solid var(--paper-line); overflow: hidden; }
```

### Form fields
```css
.field { display: grid; gap: 8px; }
.field__label { font: 500 .75rem/1.3 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-tertiary); }
.field__input { min-height: 48px; padding: 12px 14px; border-radius: var(--r-sm); background: var(--bg); color: var(--text);
  border: 1px solid var(--border); font: 400 1rem/1.4 var(--font-sans); transition: border-color .25s, box-shadow .25s; }
.field__input:hover { border-color: var(--border-hover); }
.field__input:focus { outline: none; border-color: var(--accent-ink); box-shadow: 0 0 0 3px rgba(var(--accent-rgb), .35); }
.field__input[aria-invalid='true'] { border-color: var(--error); }
.field__input:disabled { opacity: .5; cursor: not-allowed; }
```

---

## 5. Layout Principles

**Container:**
- Max width: 1440px (`--container`), ozek tekst 62ch
- Padding: `--gutter: clamp(16px, 2.4vw, 32px)` (YAUYA uporablja 30px)

**Spacing Scale** (`--s-1 … --s-10`: 4, 8, 12, 16, 24, 32, 48, 64, 96, 144 px):
- Section padding: `clamp(80px, 12vw, 160px)` navpično
- Component gap: 24–32px
- Card internal padding: 20–32px

**Radii:** `--r-xs: 4px`, `--r-sm: 6px` (YAUYA 5px), `--r-md: 10px`, `--r-lg: 20px` (spodnji vogali kontakta, zgornji vogali drsečih panelov), pilula 999px.

**Grid:**
```css
.container { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); }
.bento { display: grid; gap: 12px; grid-template-columns: repeat(4, 1fr); grid-auto-rows: minmax(240px, auto);
  grid-template-areas: 'a a b b' 'a a c d' 'e e f g'; }
.pricing { display: grid; gap: 16px; grid-template-columns: repeat(3, 1fr); align-items: stretch; }
.split { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 5vw, 96px); }
```

**Slojevitost (z-index):** hero `0` (sticky »zavesa«) · vsebina `2` · nav `50` · noga `0` (sticky `bottom: 0`) · meni `60`.

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | brez sence, 1px `--border` | privzeto: ploščice, polja, kartice na temnem |
| Hairline | 1px `--paper-line` | kartice na papirju (YAUYA) |
| Raised | `0 1px 0 rgba(var(--white-rgb),.04) inset, 0 20px 40px -20px rgba(var(--shadow-rgb),.65)` | kartice projektov v skladu, meni |
| Glow | `0 0 0 1px rgba(var(--accent-rgb),.5), 0 24px 80px -24px rgba(var(--accent-rgb),.55)` | izpostavljeni paket, fokus CTA |
| Curtain | sekcija z `border-radius: var(--r-lg) var(--r-lg) 0 0` + senca `0 -18px 44px rgba(var(--shadow-rgb),.24)` | paneli, ki zdrsnejo čez pripete elemente |
| Grain | `background: var(--grain), var(--paper)` | lanene sekcije (pripet naslov, cenik) — tipna, papirna površina brez stroška v izvajanju |

Globino ustvarjajo **sloji in sticky prekrivanje**, ne težke sence. Vse sence so zeleno-črne (`--shadow-rgb`).

---

## 7. Animation & Interaction

**Motion Philosophy**: Samo `transform` in `opacity`. Gibanje sledi drsenju (scrub) ali se zgodi enkrat. Nikoli `filter: blur` na premikajočih se elementih.
**Tier**: L3

### Dependencies
```bash
npm i gsap@3.15.1 lenis@1.3.27   # SplitText in ScrollTrigger sta v paketu gsap (brezplačna)
```

### Base Setup
```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger, SplitText);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -navH } }); // na dotik nativno drsenje
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
```

**Easing tokens:**
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);          /* expo-out, glavni */
--ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1); /* YAUYA text-roll */
--ease-slide: cubic-bezier(0.62, 0.05, 0.14, 1);     /* Bombina poglavja */
```

### Entrance Animation
```css
[data-reveal] { opacity: 0; transform: translate3d(0, 24px, 0); }
[data-reveal].is-in { opacity: 1; transform: none; transition: opacity .9s var(--ease-out), transform .9s var(--ease-out); transition-delay: calc(var(--d, 0) * 80ms); }
```
Hero wordmark: črke iz maske (`SplitText`, `mask: 'chars'`), `yPercent: 110 → 0`, `stagger: .035`, `duration: 1.2`, `ease: 'expo.out'`; pika nato dvakrat utripne kot kurzor.

### Scroll Behavior
| Blok | Trigger | Driver | Učinek |
|------|---------|--------|--------|
| Hero zavesa | ovoj 200svh, hero `sticky` | CSS sticky + scrub | vsebina zdrsne čez hero; wordmark `yPercent 0 → -12`, canvas zatemni |
| Pripet naslov »Kaj delam« | `.pin-wrap` (YAUYA) | CSS sticky + ScrollTrigger scrub | pilule se razširijo `width 0 → 2.2em`; naslov ScrollFloat |
| Marquee | viewport | GSAP loop + `getVelocity()` | hitrost in smer sledita drsenju |
| Obljube (levo pin / desno swap) | sekcija 300vh | CSS sticky + ScrollTrigger progress | aktivni indeks 0–2, prizori crossfade + notranji scrub |
| Storitve | ploščice | IntersectionObserver | stagger reveal; notranje mikro-animacije |
| Projekti | `.pcard` sticky, `top +25px` | CSS sticky | YAUYA sklad; Ahil čelada paralaksa po napredku |
| Noga | `sticky bottom:0` | CSS | razkritje; na koncu pika »oživi« |

### Hover & Focus States
- Vsi interaktivni elementi: `:hover` + `:focus-visible` (2px `--accent-ink` outline, offset 3px).
- Gumbi: text-roll (500ms quart) + magnet (`(hover:hover)` samo, rAF, `x/y * .25`).
- Ploščice: SpotlightCard `--mx/--my` (rAF), obroba `--border-hover`.
- Kartice projektov: puščica »↗« se premakne `translate(3px,-3px)`.

### Special Effects
- **WebGL svila** (hero): valovite gube, barve `--bg → --accent-deep → --sage` (svila) z rahlo `--mist` tančico med gubami in `--sand` grebeni (topla svetloba); zatemnitev proti `--bg`, ne proti črni. Odziv na miško (lerp .06) s toplim peščenim sijem. Upodobitev pri 0,5× ločljivosti (mehka slika) in DPR ≤ 1,5; pavza ko hero ni viden ali je zavihek skrit. Fallback: CSS radialni gradienti.
- **SpotlightCard** (bento), **vrteča obroba** (BUSINESS), **count-up** (O meni), **ScrollReveal** (besede iz `--text-tertiary` v `--text`).
- **巧思**: ko je noga povsem razkrita, pika v wordmarku poskoči in zasveti, izpiše se »Prišli ste do konca strani. Naslednji korak je preprost — pokličite.«

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important;
    transition-duration: .01ms !important; scroll-behavior: auto !important; }
  [data-reveal] { opacity: 1 !important; transform: none !important; }
}
```
JS: brez Lenisa, brez SplitText/scrub animacij (končna stanja), shader nariše eno statično sličico, Lan obroč miruje, marquee stoji.

---

## 8. Do's and Don'ts

### Do
- Uporabljaj 1px obrobe in ogromno tipografijo za strukturo — to je YAUYA DNK.
- Drži vloge palete: žajbelj za dejanja in ploskve, pesek za poudarek na temnem, megla za sekundarno besedilo.
- Na lanu za malo besedilo in fokus uporabljaj `--accent-on-paper`; žajbelj samo za veliko besedilo in ikone.
- Pripete elemente delaj s CSS `position: sticky`; GSAP naj samo bere napredek.
- Vsako sekcijo začni z eyebrow »(0X) Ime«.
- Projektne vizuale zapri v njihove kartice z lastnimi tokeni.
- Vsako animacijo vezi na IntersectionObserver / ScrollTrigger in jo ustavi zunaj zaslona.
- Slike vedno prek `astro:assets` (AVIF/WebP, `srcset`, `loading="lazy"` razen hero).

### Don't
- ❌ Ne uporabljaj gradientnega besedila ali neonskih glow učinkov na naslovih sekcij.
- ❌ Ne dodajaj barv izven palete žajbelj / megla / pesek (in umirjenih semantičnih stanj) — nobene nasičene modre, vijolične ali neon zelene.
- ❌ Ne postavljaj peska na žajbelj (2,4:1) in žajblja kot malega besedila na temno podlago (3,3:1).
- ❌ Ne uporabljaj čisto črnih senc ali prekrivanj — vedno `--shadow-rgb` / `--bg-rgb`.
- ❌ Ne animiraj `filter: blur()`, `box-shadow`, `width/height/top/left` na elementih, ki se premikajo ob drsenju (izjemi: enkratna razširitev foto-pilul in mikro-vizuali v bentu, ki tečejo samo na zaslonu).
- ❌ Ne uporabljaj več kot enega WebGL canvasa.
- ❌ Ne uporabljaj GSAP `pin` tam, kjer zadošča CSS sticky.
- ❌ Ne uporabljaj emojijev kot ikon — samo inline SVG (lucide slog, 1.5px poteza).
- ❌ Ne uporabljaj generičnih stock fotografij ljudi, ki se rokujejo — samo resnični projekti in nevtralne fotografije delovnega prostora.
- ❌ Ne postavljaj besedila pod 16px v telo, ne pod 12px kjerkoli.
- ❌ Ne skrivaj kontakta: telefon mora biti vedno na en klik (nav, trak, kontakt, noga).
- ❌ Ne uporabljaj samodejnega drsenja (auto-scroll) ali ugrabitve kolesca.

---

## 9. Responsive Behavior

**Breakpoints:**
| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | > 1024px | nav: 3 stolpci + trak; obljube: levo pin / desno swap; bento 4 stolpci; cenik 3 + široka kartica |
| Tablet | 640–1024px | nav: hamburger + logo + klic; obljube: sklad (brez pina); bento 2 stolpca; cenik 1–2 stolpca; kartice projektov 90vw, `top` +15px |
| Mobile | < 640px | wordmark v dveh vrsticah; kartice projektov v stolpcu (vizual zgoraj), `top` +10px; bento 1 stolpec; obrazec v enem stolpcu |

**Touch Targets:** minimum 44 × 44px (gumbi 48px).
**Collapsing Strategy:** navigacija → hamburger z YAUYA spustnim menijem (sredinske povezave, 1px ločila, spodnji radij 10px); dvostolpčne postavitve → en stolpec; dekorativne mikro-animacije ostanejo, scrub pini izginejo.

```css
@media (max-width: 1024px) {
  :root { --nav-h-top: 60px; --nav-h-strip: 30px; }
  .bento { grid-template-columns: repeat(2, 1fr); grid-template-areas: 'a a' 'b b' 'c d' 'e e' 'f g'; }
  .pricing { grid-template-columns: 1fr; max-width: 560px; margin-inline: auto; }
  .pcard { width: 90vw; top: calc(var(--nav-h) + 16px + var(--i) * 15px); }
}
@media (max-width: 640px) {
  .bento { grid-template-columns: 1fr; grid-template-areas: 'a' 'b' 'c' 'd' 'e' 'f' 'g'; }
  .pcard { grid-template-columns: 1fr; grid-template-rows: 44% 1fr; height: min(78svh, 640px); top: calc(var(--nav-h) + 12px + var(--i) * 10px); }
}
```
