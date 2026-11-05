/**
 * Kontaktni obrazec:
 * - Turnstile se naloži lenobno (ko se obrazec približa zaslonu)
 * - validacija na odjemalcu s slovenskimi sporočili
 * - pošiljanje na /api/contact (Cloudflare Pages Function), stanja: pošiljam / uspeh / napaka
 */

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  getResponse: (id?: string) => string | undefined;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __onTurnstileLoad?: () => void;
  }
}

const MESSAGES = {
  ime: 'Prosimo, vpišite svoje ime in priimek.',
  email: 'Prosimo, vpišite veljaven e-poštni naslov.',
  sporocilo: 'Sporočilo naj ima vsaj 10 znakov.',
  soglasje: 'Za pošiljanje potrebujemo vaše soglasje.',
} as const;

type FieldName = keyof typeof MESSAGES;

export function initContactForm(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>('[data-status]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const holder = form.querySelector<HTMLElement>('[data-turnstile]');
  let widgetId: string | undefined;

  /* ------------------------------------------------------- Turnstile */
  function loadTurnstile() {
    if (!holder || document.querySelector('script[data-turnstile-api]')) return;
    window.__onTurnstileLoad = () => {
      if (!window.turnstile || !holder) return;
      widgetId = window.turnstile.render(holder, {
        sitekey: holder.dataset.sitekey,
        theme: 'dark',
        language: 'sl',
        size: 'flexible',
        appearance: 'always',
      });
    };
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__onTurnstileLoad';
    s.async = true;
    s.defer = true;
    s.dataset.turnstileApi = '';
    document.head.appendChild(s);
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        loadTurnstile();
        io.disconnect();
      }
    },
    { rootMargin: '600px 0px' },
  );
  io.observe(form);
  form.addEventListener('focusin', loadTurnstile, { once: true });

  /* ------------------------------------------------------- Validacija */
  function fieldError(name: FieldName): string {
    const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
    if (!el) return '';
    if (el instanceof HTMLInputElement && el.type === 'checkbox') return el.checked ? '' : MESSAGES[name];
    const value = el.value.trim();
    if (name === 'ime' && value.length < 2) return MESSAGES.ime;
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return MESSAGES.email;
    if (name === 'sporocilo' && value.length < 10) return MESSAGES.sporocilo;
    return '';
  }

  function showError(name: FieldName, message: string) {
    const el = form.elements.namedItem(name) as HTMLElement | null;
    const slot = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (el) el.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (slot) slot.textContent = message;
  }

  function validate(): boolean {
    let firstInvalid: HTMLElement | null = null;
    for (const name of Object.keys(MESSAGES) as FieldName[]) {
      const msg = fieldError(name);
      showError(name, msg);
      if (msg && !firstInvalid) firstInvalid = form.elements.namedItem(name) as HTMLElement | null;
    }
    firstInvalid?.focus();
    return firstInvalid === null;
  }

  // Sproti počisti napako, ko jo uporabnik popravi
  (Object.keys(MESSAGES) as FieldName[]).forEach((name) => {
    const el = form.elements.namedItem(name) as HTMLElement | null;
    el?.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true' && !fieldError(name)) showError(name, '');
    });
    el?.addEventListener('change', () => {
      if (el.getAttribute('aria-invalid') === 'true' && !fieldError(name)) showError(name, '');
    });
  });

  function setStatus(text: string, kind: '' | 'is-success' | 'is-error' = '') {
    if (!status) return;
    status.textContent = text;
    status.classList.remove('is-success', 'is-error');
    if (kind) status.classList.add(kind);
  }

  /* ------------------------------------------------------- Pošiljanje */
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validate()) {
      setStatus('Preverite označena polja.', 'is-error');
      return;
    }

    const data = new FormData(form);
    const token = window.turnstile?.getResponse(widgetId) ?? String(data.get('cf-turnstile-response') ?? '');
    if (!token) {
      loadTurnstile();
      setStatus('Počakajte trenutek, da se zaključi preverjanje proti spamu, in poskusite znova.', 'is-error');
      return;
    }
    data.set('cf-turnstile-response', token);

    submit?.setAttribute('aria-busy', 'true');
    setStatus('Pošiljam …');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        form.reset();
        (Object.keys(MESSAGES) as FieldName[]).forEach((n) => showError(n, ''));
        setStatus('Hvala! Sporočilo je poslano — odgovor prejmete v najkrajšem možnem času.', 'is-success');
      } else {
        setStatus(json.error ?? 'Pošiljanje ni uspelo. Poskusite znova ali pokličite +386 40 336 379.', 'is-error');
      }
    } catch {
      setStatus('Povezava ni uspela. Preverite internet in poskusite znova ali pokličite +386 40 336 379.', 'is-error');
    } finally {
      submit?.removeAttribute('aria-busy');
      window.turnstile?.reset(widgetId);
    }
  });
}
