/** En vir resnice za kontaktne podatke in osnovne nastavitve strani. */
export const SITE = {
  name: 'Site Craft Studio',
  url: 'https://sitecraftstudio.si',
  owner: 'Marko Adžaga',
  ownerTitle: 'mag. inž. rač. in inf.',
  phone: '+386 40 336 379',
  phoneHref: 'tel:+38640336379',
  email: 'marko.4adzaga.4@gmail.com',
  emailHref: 'mailto:marko.4adzaga.4@gmail.com',
  title: 'Site Craft Studio. — Izdelava spletnih strani v enem tednu',
  description:
    'Profesionalne spletne strani za podjetja, izdelane v enem tednu. Oblikovanje, razvoj, gostovanje, domena, SEO in vzdrževanje — za vse poskrbim jaz. Paketi že od 49 € na mesec.',
  locale: 'sl_SI',
} as const;

export type NavItem = { id: string; label: string };

/** Sidra sekcij na prvi strani (vrstni red = vrstni red na strani). */
export const NAV: NavItem[] = [
  { id: 'storitve', label: 'Storitve' },
  { id: 'cenik', label: 'Cenik' },
  { id: 'o-meni', label: 'O meni' },
  { id: 'projekti', label: 'Projekti' },
];
