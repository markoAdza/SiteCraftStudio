# Site Craft Studio. — sitecraftstudio.si

Predstavitvena stran studia za izdelavo spletnih strani. Zgrajena z **Astro 6** (statični izvoz), gostovana na **Cloudflare Pages**. Kontaktni obrazec teče kot **Cloudflare Pages Function** (Resend + Turnstile).

- Dizajn sistem in pravila: [`DESIGN.md`](DESIGN.md)
- Vsebina (kontakt, cenik, projekti): [`src/data/`](src/data/)

## Hitri začetek

```bash
npm install
npm run dev        # razvoj: http://localhost:4321 (brez /api/contact)
npm run build      # gradnja v ./dist
npm run preview    # wrangler pages dev ./dist — stran + Pages Functions (obrazec)
npm run check      # preverjanje tipov (astro check)
```

> **Node:** projekt uporablja Node 22.12+ (glej `.node-version`). Astro 7 zahteva Node ≥ 22.23.4 — ko posodobiš Node, lahko nadgradiš z `npx @astrojs/upgrade`.

Za lokalni test obrazca kopiraj `.dev.vars.example` v `.dev.vars` in vpiši ključe (glej spodaj).

## Struktura

```
functions/api/contact.ts   Pages Function: validacija → past za bote → Turnstile → Resend
public/                    favicon, og.png, robots.txt, _headers (varnostne glave + cache)
src/
  data/                    site.ts (telefon, e-pošta, meni), pricing.ts, projects.ts
  styles/                  tokens.css (vse barve/tipografija/razmiki), global.css
  layouts/Base.astro       <head>: SEO, OG, JSON-LD, prednalaganje pisave
  components/              Hero (WebGL), Nav, PinnedTitle, Marquee, Promises, Services,
                           Pricing, About, Projects (+ projects/*), Contact, Footer
  scripts/                 motion.ts (Lenis + GSAP), hero-shader.ts, contact-form.ts
  pages/                   index, politika-zasebnosti, 404
```

## Urejanje vsebine

| Kaj | Kje |
|---|---|
| Telefon, e-pošta, meni | `src/data/site.ts` |
| Paketi in cene | `src/data/pricing.ts` (tudi `PLANS` v `functions/api/contact.ts`, če spremeniš imena paketov) |
| Projekti (besedila, povezave) | `src/data/projects.ts` |
| Fotografija »O meni« | zamenjaj `src/assets/about/portrait-placeholder.jpg` (portret 4:5, ≥ 900 × 1125 px) |
| Barve, pisave | `src/styles/tokens.css` (+ posodobi `DESIGN.md`) |

## Kontaktni obrazec (Resend + Turnstile)

1. **Resend** — ustvari račun na [resend.com](https://resend.com) → *Domains* → dodaj `sitecraftstudio.si` in pri ponudniku DNS vpiši zapise, ki jih prikaže Resend (SPF/DKIM). Nato ustvari **API ključ**.
   - Dokler domena ni potrjena, lahko testiraš s `CONTACT_FROM="Site Craft Studio <onboarding@resend.dev>"` (pošilja samo na e-pošto lastnika Resend računa).
2. **Turnstile** — Cloudflare → *Turnstile* → *Add widget*: hostnames `sitecraftstudio.si`, `www.sitecraftstudio.si` in `<projekt>.pages.dev`. Dobiš **site key** in **secret key**.
3. **Spremenljivke v Cloudflare Pages** (*Settings → Variables and Secrets*, za Production in Preview):

| Ime | Tip | Vrednost |
|---|---|---|
| `RESEND_API_KEY` | Secret | Resend API ključ |
| `TURNSTILE_SECRET_KEY` | Secret | Turnstile secret key |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build variable | Turnstile site key (vgradi se v HTML ob gradnji) |
| `CONTACT_TO`, `CONTACT_FROM` | Var | že nastavljeno v `wrangler.toml` |

Brez `PUBLIC_TURNSTILE_SITE_KEY` se uporabi Cloudflarov **testni** ključ (prikaže »samo za preverjanje«) in obrazec v produkciji ne bo deloval — to je namerno (brez tihega spama).

## Objava na Cloudflare Pages

**A) Git integracija (priporočeno)** — potisni repozitorij na GitHub, nato Cloudflare → *Workers & Pages → Create → Pages → Connect to Git*:
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: zgornja tabela (+ `NODE_VERSION=22.12.0`, če gradnja ne prebere `.node-version`)

Mapa `functions/` se samodejno objavi kot Pages Functions.

**B) Neposredna objava iz računalnika**

```bash
npx wrangler login
npm run deploy     # astro build + wrangler pages deploy ./dist (iz korena projekta → vključi functions/)
```

### Domena sitecraftstudio.si

Pages → projekt → *Custom domains* → dodaj `sitecraftstudio.si` in `www.sitecraftstudio.si`.
Za korensko domeno (apex) mora biti DNS cona na Cloudflare: pri registrarju `.si` domene zamenjaj imenske strežnike (nameserverje) na tiste, ki ti jih dodeli Cloudflare. Nato Cloudflare sam uredi zapise in SSL.

## Pred objavo — preveri

- [ ] Prava fotografija v »O meni«
- [ ] Resend + Turnstile ključi nastavljeni, testno sporočilo prispe
- [ ] Pravni podatki v `src/pages/politika-zasebnosti.astro` (oblika dejavnosti, naslov) — besedilo je osnutek
- [ ] Opomba o DDV pri cenah (če je potrebna)

## Zasluge

- Pisave: [Domine](https://fonts.google.com/specimen/Domine), [Geist / Geist Mono](https://vercel.com/font) — SIL Open Font License, gostovane lokalno (Fontsource).
- Animacije: [GSAP](https://gsap.com) (ScrollTrigger, SplitText — brezplačna licenca), [Lenis](https://lenis.darkroom.engineering) (MIT).
- Ikone: [Lucide](https://lucide.dev) (ISC).
- Gibanje navdihnjeno z [vue-bits / react-bits](https://github.com/DavidHDev/vue-bits) by DavidHDev (MIT) — ScrollFloat, ScrollReveal, SpotlightCard, Magnet.
- Placeholder fotografija »O meni«: [Unsplash](https://unsplash.com/photos/1555066931-4365d14bab8c) (Unsplash License), obdelana v duoton palete (zeleno-črna → žajbelj → pesek).
- Posnetki zaslona in sredstva projektov: lastni projekti (Fast Food Lan, Ahil fitnes, Bistro Bombina). Fotografija ozadja Ahil: Unsplash (glej projekt Ahil, `public/images/CREDITS.md`).
