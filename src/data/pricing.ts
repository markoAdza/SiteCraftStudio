/**
 * Cenik: dve možnosti — mesečna naročnina (POPOLNA OSKRBA) ali enkratno plačilo.
 * Cene so v evrih; začetna postavitev je enkraten strošek.
 */
export type PlanFeature = {
  text: string;
  /** Prikaže se tudi na minimalni (kratki) predstavitvi. */
  key?: boolean;
};

export type Plan = {
  id: 'OSKRBA' | 'ENKRATNO';
  name: string;
  tagline: string;
  /** null = cena po dogovoru */
  price: number | null;
  setup: string;
  description: string;
  includes?: string;
  features: PlanFeature[];
  /** Urna postavka za dodatno delo, npr. '40 € / h'. */
  rate?: string;
  /** Napis na gumbu. */
  cta: string;
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: 'OSKRBA',
    name: 'POPOLNA OSKRBA',
    tagline: 'Mesečna naročnina',
    cta: 'Izberi popolno oskrbo',
    price: 60,
    setup: '+ 199 € enkratna postavitev',
    description: 'Za lastnike, ki želijo, da za njihovo spletno prisotnost v celoti poskrbim jaz.',
    includes: 'Kaj dobite:',
    featured: true,
    features: [
      { text: 'Spletna stran do 8 podstrani, prilagojena telefonom', key: true },
      { text: 'Izdelava logotipa in celostne grafične podobe' },
      { text: 'CMS: sami urejate storitve, cene, jedilnike, novice', key: true },
      { text: 'Posodobitve vsebine in spremembe strukture vključene', key: true },
      { text: 'Večjezična stran z enostavnim preklopom jezika' },
      { text: 'Osnovni SEO, kontaktni obrazec, klic z enim klikom' },
      { text: 'Gostovanje, SSL, varnostne kopije in nadzor', key: true },
      { text: 'Mesečno poročilo in prednostna podpora', key: true },
    ],
  },
];

/** Enkratno plačilo namesto mesečne naročnine — cena po dogovoru, delo po urah. */
export const ONE_TIME_PLAN: Plan = {
  id: 'ENKRATNO',
  name: 'ENKRATNO PLAČILO',
  tagline: 'Brez mesečne naročnine',
  cta: 'Povprašajte za ponudbo',
  price: null,
  setup: 'Enkratno plačilo · cena glede na obseg',
  description:
    'Raje plačate enkrat? Stran izdelam po meri za enkraten znesek, ki ga določiva glede na obseg. Kasnejše spremembe plačate po porabljenem času.',
  includes: 'Kaj dobite:',
  rate: '40 € / h',
  features: [
    { text: 'Spletna stran po meri, v vaši lasti', key: true },
    { text: 'Cena glede na obseg, po dogovoru', key: true },
    { text: 'Gostovanje vključeno', key: true },
    { text: 'Optimizacija za telefone in osnovni SEO' },
    { text: 'Spremembe, nadgradnje in objave: 40 € / h', key: true },
    { text: 'Brez vezave' },
  ],
};

/** Vse možnosti po vrsti (mesečna, enkratna). */
export const ALL_PLANS: Plan[] = [...PLANS, ONE_TIME_PLAN];

/** Možnosti za izbiro paketa v kontaktnem obrazcu (mora se ujemati s functions/api/contact.ts). */
export const PLAN_OPTIONS = [
  { value: 'Še ne vem', label: 'Še ne vem — svetujte mi' },
  { value: 'OSKRBA', label: 'POPOLNA OSKRBA — 60 € / mesec' },
  { value: 'ENKRATNO', label: 'ENKRATNO PLAČILO — po dogovoru' },
] as const;
