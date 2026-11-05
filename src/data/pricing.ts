/**
 * Paketi po specifikaciji (specifikacija-spletne-strani.pdf, poglavje 3.1).
 * Cene so v evrih na mesec; začetna postavitev je enkraten strošek.
 */
export type Plan = {
  id: 'BASIC' | 'BUSINESS' | 'PREMIUM' | 'BUSINESS ZERO';
  name: string;
  tagline: string;
  price: number;
  setup: string;
  description: string;
  includes?: string;
  features: string[];
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: 'BASIC',
    name: 'BASIC',
    tagline: 'Spletna prisotnost',
    price: 49,
    setup: '+ 199 € enkratna postavitev',
    description: 'Za podjetje, ki potrebuje profesionalno spletno stran brez nepotrebne kompleksnosti.',
    features: [
      'Do 4–5 podstrani',
      'Optimizacija za mobilne naprave',
      'Kontaktni obrazec in klic z enim klikom',
      'Osnovni SEO — vidnost na Googlu',
      'Urejanje delovnega časa',
      'Gostovanje, SSL, varnostne kopije in nadzor',
      'Tehnična podpora',
    ],
  },
  {
    id: 'BUSINESS',
    name: 'BUSINESS',
    tagline: 'Spletna prisotnost + CMS',
    price: 69,
    setup: '+ 199 € enkratna postavitev',
    description: 'Za podjetja, ki želijo sama urejati svojo vsebino.',
    includes: 'Vse iz paketa BASIC, plus:',
    featured: true,
    features: [
      'Dostop do CMS (sistem za urejanje vsebine)',
      'Izdelava logotipa',
      'Izdelava celostne grafične podobe',
      'Do 8 podstrani',
      'Strukturne nadgradnje spletne strani',
      'Prevod strani v druge jezike z enostavnim preklopom jezika',
      'Urejanje storitev in cen',
      'Urejanje novic in objav',
      'Urejanje obvestil',
      'Urejanje jedilnikov, cenikov …',
      '30 minut pomoči pri vsebini mesečno',
    ],
  },
  {
    id: 'PREMIUM',
    name: 'PREMIUM',
    tagline: 'Popolna oskrba',
    price: 99,
    setup: '+ 199 € enkratna postavitev',
    description: 'Za lastnike, ki želijo, da za večino njihove spletne prisotnosti poskrbim jaz.',
    includes: 'Vse iz paketa BUSINESS, plus:',
    features: [
      'Neomejeno spreminjanje strukture strani (novi elementi …)',
      '60 minut posodobitev vsebine mesečno',
      'Pomoč pri objavi ponudb in obvestil',
      'Mesečno poročilo o uspešnosti',
      'Prednostna podpora',
    ],
  },
];

export const ZERO_PLAN: Plan = {
  id: 'BUSINESS ZERO',
  name: 'BUSINESS ZERO',
  tagline: 'Brez začetnega vložka',
  price: 89,
  setup: '0 € postavitve · 12-mesečna začetna vezava',
  description:
    'Spletna stran brez velike začetne investicije. Dobite vse, kar vključuje paket BUSINESS — brez enkratnega stroška postavitve.',
  includes: 'Enako kot paket BUSINESS:',
  features: [
    'Dostop do CMS',
    'Logotip in celostna grafična podoba',
    'Do 8 podstrani',
    'Večjezičnost',
    '30 minut pomoči pri vsebini mesečno',
  ],
};

/** Možnosti za izbiro paketa v kontaktnem obrazcu (mora se ujemati s functions/api/contact.ts). */
export const PLAN_OPTIONS = [
  { value: 'Še ne vem', label: 'Še ne vem — svetujte mi' },
  { value: 'BASIC', label: 'BASIC — 49 € / mesec' },
  { value: 'BUSINESS', label: 'BUSINESS — 69 € / mesec' },
  { value: 'PREMIUM', label: 'PREMIUM — 99 € / mesec' },
  { value: 'BUSINESS ZERO', label: 'BUSINESS ZERO — 89 € / mesec' },
] as const;
