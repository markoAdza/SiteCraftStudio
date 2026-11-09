/** Projekti za YAUYA-sklad kartic. Vizual vsake kartice je ločena komponenta. */
export type Project = {
  id: 'lan' | 'ahil' | 'bombina' | 'internal';
  title: string;
  meta: string;
  description: string;
  tags: string[];
  url?: string;
  featured?: boolean;
  /** Skrit projekt se ne prikaže na strani (ostane v podatkih). */
  hidden?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: 'lan',
    title: 'Fast Food Lan',
    meta: 'Hitra prehrana · Hrastnik',
    description:
      'Drzna in hitra stran za lokal s hitro prehrano: cenik na en klik, klic za naročilo neposredno s telefona, delovni čas na prvi pogled in prepoznavna podoba, ki diši po žaru.',
    tags: ['Cenik', 'Klik za klic', 'Delovni čas', 'Mobile-first'],
    url: 'https://fast-food-lan.vercel.app/',
    featured: true,
  },
  {
    id: 'bombina',
    title: 'Bistro Bombina',
    meta: 'Bistro · Trbovlje',
    description:
      'Topla stran za bistro: celozaslonski uvod s čopičastim logotipom, tedenska ponudba in jedilnik z alergeni, catering, mnenja gostov, Instagram in dvojezična vsebina.',
    tags: ['Dvojezično', 'Jedilnik', 'Catering', 'Mnenja gostov'],
    url: 'https://bombina-v2.vercel.app/',
    hidden: true,
  },
  {
    id: 'ahil',
    title: 'Ahil fitnes',
    meta: 'Fitnes 24/7 · Hrastnik, Trbovlje, Sevnica',
    description:
      'Premium predstavitev fitnesa, odprtega 24 ur na dan: temna, močna vizualna podoba z bronasto Ahilovo čelado in jasna pot do včlanitve na vseh treh lokacijah.',
    tags: ['24/7', '3 lokacije', 'Paralaksa', 'Mobile-first'],
    url: 'https://ahilfitnes.vercel.app/',
  },
  {
    id: 'internal',
    title: 'Interne poslovne rešitve',
    meta: 'Zaupno · Za podjetja',
    description:
      'Za podjetja izdelujem tudi interne spletne aplikacije in poslovne rešitve, ki jih zaradi zaupnosti ne morem javno prikazati. O njih z veseljem povem več v osebnem pogovoru.',
    tags: ['Nadzorne plošče', 'Orodja po meri', 'Avtomatizacija'],
  },
];
