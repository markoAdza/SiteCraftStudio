/**
 * Skupna nastavitev gibanja (DESIGN.md §7).
 * - Lenis gladko drsenje (samo brez prefers-reduced-motion, na dotik nativno)
 * - GSAP + ScrollTrigger + SplitText
 * - [data-reveal]        enkraten vstop (IntersectionObserver)
 * - [data-inview]        razred .is-visible, ko je element na zaslonu (pavza CSS animacij)
 * - [data-float]         ScrollFloat za naslove (scrub)
 * - [data-scroll-reveal] ScrollReveal za odstavke (besede se prižigajo)
 * - [data-count]         count-up števci
 * - [data-magnet]        magnetni CTA (samo miška)
 * - [data-spotlight]     svetloba, ki sledi miški (--mx/--my)
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/* ------------------------------------------------------------------ Lenis */
export const lenis: Lenis | null = reduceMotion ? null : new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
}

/** Višina sticky navigacije (zgornja vrstica + trak). */
export function navOffset(): number {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  return nav ? Math.round(nav.getBoundingClientRect().height) : 0;
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function scrollToTarget(target: HTMLElement | 0) {
  if (target === 0) {
    if (lenis) lenis.scrollTo(0, { duration: 1.6, easing: easeOutExpo });
    else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    return;
  }
  const noOffset = target.hasAttribute('data-no-offset');
  const offset = noOffset ? 0 : navOffset();
  if (lenis) {
    // Lenis sam upošteva scroll-padding-top (= višina navigacije); pri pripetih
    // naslovih (data-no-offset) ga izničimo, da je ovoj točno na vrhu.
    lenis.scrollTo(target, { offset: noOffset ? navOffset() : 0, duration: 1.6, easing: easeOutExpo });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
}

/* ------------------------------------------------- Sidra na isti strani */
document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
  const link = (event.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
  if (!link || link.target === '_blank') return;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
  const id = decodeURIComponent(url.hash.slice(1));
  const target = id === 'top' ? 0 : document.getElementById(id);
  if (target === null) return;
  event.preventDefault();
  scrollToTarget(target);
  history.replaceState(null, '', id === 'top' ? window.location.pathname : `#${id}`);
  if (target !== 0) {
    // Fokus za tipkovnico in bralnike zaslona, brez skoka
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
});

/* ------------------------------------------------------------- Reveal */
const revealIO = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      el.classList.add('is-in');
      revealIO.unobserve(el);
      if (reduceMotion || typeof el.animate !== 'function') continue;
      const d = Number(el.style.getPropertyValue('--d')) || 0;
      const timing: KeyframeAnimationOptions = {
        duration: 950,
        delay: d * 90,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'backwards',
      };
      el.animate([{ opacity: 0 }, { opacity: 1 }], timing);
      // translate se prišteje obstoječemu odmiku komponente (npr. dvignjen paket)
      el.animate([{ translate: '0 26px' }, { translate: '0 0' }], { ...timing, composite: 'add' });
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
);
document.querySelectorAll('[data-reveal]').forEach((el) => revealIO.observe(el));

/* ------------------------------------------- Vidnost (pavza animacij) */
const inviewIO = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) entry.target.classList.toggle('is-visible', entry.isIntersecting);
  },
  { rootMargin: '15% 0px 15% 0px' },
);
document.querySelectorAll('[data-inview]').forEach((el) => inviewIO.observe(el));

/** Pokliče `cb(true|false)`, ko element vstopi/izstopi iz zaslona. */
export function watchVisibility(el: Element, cb: (visible: boolean) => void, rootMargin = '10% 0px') {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => cb(e.isIntersecting)), { rootMargin });
  io.observe(el);
  return () => io.disconnect();
}

/* -------------------------------------------- ScrollFloat (naslovi) */
function scrollFloat(el: HTMLElement) {
  const start = el.dataset.floatStart ?? 'top bottom-=8%';
  const end = el.dataset.floatEnd ?? 'bottom center+=8%';
  const trigger = el.dataset.floatTrigger ? (el.closest(el.dataset.floatTrigger) ?? el) : el;
  // Samo besede/črke (ne vrstice) → razrez ni odvisen od širine, autoSplit ni potreben.
  const split = SplitText.create(el, { type: 'words,chars', tag: 'span', ignore: '.pill' });
  el.classList.add('is-split');
  gsap.fromTo(
    split.chars,
    { yPercent: 115, scaleY: 2.1, scaleX: 0.72, opacity: 0, transformOrigin: '50% 0%' },
    {
      yPercent: 0,
      scaleY: 1,
      scaleX: 1,
      opacity: 1,
      ease: 'back.inOut(2)',
      stagger: 0.025,
      scrollTrigger: { trigger, start, end, scrub: true },
    },
  );
}

/* ----------------------------------------- ScrollReveal (odstavki) */
function scrollReveal(el: HTMLElement) {
  // aria: 'none' — <p> ne sme imeti aria-label; besede v <span> bralniki preberejo normalno.
  const split = SplitText.create(el, { type: 'words', tag: 'span', aria: 'none' });
  el.classList.add('is-split');
  gsap.fromTo(
    split.words,
    { opacity: 0.16 },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: true },
    },
  );
}

/* ------------------------------------------------------------ Count-up */
function countUp(el: HTMLElement) {
  const to = Number(el.dataset.count);
  if (!Number.isFinite(to)) return;
  const obj = { v: 0 };
  el.textContent = '0';
  gsap.to(obj, {
    v: to,
    duration: 1.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => {
      el.textContent = String(Math.round(obj.v));
    },
  });
}

/* --------------------------------------------- Leno zaganjanje (TBT) */
/** Zažene `fn` po nalaganju strani, ko je glavna nit prosta. */
export function onIdle(fn: () => void, timeout = 1200) {
  const run = () => {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(() => fn(), { timeout });
    else setTimeout(fn, 120);
  };
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
}

let refreshQueued = 0;
/** Združi več zaporednih zahtev za ScrollTrigger.refresh() v eno. */
export function queueRefresh() {
  window.clearTimeout(refreshQueued);
  refreshQueued = window.setTimeout(() => ScrollTrigger.refresh(), 150);
}

/**
 * Elemente z dragim razrezom (SplitText) pripravi šele, ko se približajo
 * zaslonu (75 % višine vnaprej) — delo se razporedi skozi drsenje.
 */
function lazyInit(selector: string, init: (el: HTMLElement) => void) {
  const els = document.querySelectorAll<HTMLElement>(selector);
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        init(entry.target as HTMLElement);
      }
    },
    { rootMargin: '0px 0px 75% 0px' },
  );
  els.forEach((el) => io.observe(el));
}

/* -------------------------------------------------------------- Magnet */
function magnet(el: HTMLElement) {
  const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
    yTo((e.clientY - (r.top + r.height / 2)) * 0.38);
  });
  el.addEventListener('pointerleave', () => {
    xTo(0);
    yTo(0);
  });
}

/* ------------------------------------------------------- SpotlightCard */
function spotlight(el: HTMLElement) {
  let raf = 0;
  let x = 0;
  let y = 0;
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    x = e.clientX - r.left;
    y = e.clientY - r.top;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
      raf = 0;
    });
  });
}

/* -------------------------------------------------------------- Zagon */
if (canHover) document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach(spotlight);

if (!reduceMotion) {
  if (canHover) document.querySelectorAll<HTMLElement>('[data-magnet]').forEach(magnet);
  // Razrez besedila šele po nalaganju pisav (sicer bi se mere spremenile)
  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  fontsReady.then(() => {
    lazyInit('[data-float]', scrollFloat);
    lazyInit('[data-scroll-reveal]', scrollReveal);
    lazyInit('[data-count]', countUp);
  });
}

// Po nalaganju slik in pisav se postavitev spremeni → ena osvežitev merjenj
window.addEventListener('load', queueRefresh, { once: true });
document.fonts?.ready.then(queueRefresh);
