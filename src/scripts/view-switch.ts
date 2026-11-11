/**
 * Preklop med kratko predstavitvijo (/) in celotno spletno podobo (/celotna/).
 * Povezave z [data-view="full"|"min"] ob kliku zapomnijo izbiro; preusmeritev ob
 * naslednjem obisku / uredi inline skripta v Base.astro (viewRedirect).
 */
import { VIEW_KEY } from '../data/site';

document.querySelectorAll<HTMLAnchorElement>('a[data-view]').forEach((a) => {
  a.addEventListener('click', () => {
    try {
      localStorage.setItem(VIEW_KEY, a.dataset.view === 'full' ? 'full' : 'min');
    } catch {}
  });
});
