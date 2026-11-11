/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * 1. preveri izvor in velikost zahteve
 * 2. prebere polja obrazca, past za bote (spletna_stran) tiho »uspe«
 * 3. validira polja (enaka pravila kot na odjemalcu)
 * 4. preveri Cloudflare Turnstile žeton
 * 5. pošlje e-pošto prek Resend API (reply_to = obiskovalec)
 *
 * Okoljske spremenljivke (Cloudflare → Pages → Settings → Variables and Secrets):
 *   RESEND_API_KEY        (secret)  Resend API ključ
 *   TURNSTILE_SECRET_KEY  (secret)  Turnstile skrivni ključ
 *   CONTACT_TO            (var)     prejemnik, npr. marko.4adzaga.4@gmail.com
 *   CONTACT_FROM          (var)     pošiljatelj na potrjeni domeni, npr. "Site Craft Studio <obrazec@sitecraftstudio.si>"
 */

interface Env {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const PLANS = ['Še ne vem', 'OSKRBA', 'ENKRATNO'];
const MAX_BYTES = 32 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isAllowedOrigin(origin: string | null, requestUrl: string): boolean {
  if (!origin) return true; // nekateri odjemalci ne pošljejo Origin; Turnstile je glavna zaščita
  try {
    const o = new URL(origin);
    const self = new URL(requestUrl);
    return (
      o.host === self.host ||
      o.hostname === 'sitecraftstudio.si' ||
      o.hostname === 'www.sitecraftstudio.si' ||
      o.hostname.endsWith('.pages.dev') ||
      o.hostname === 'localhost' ||
      o.hostname === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  if (!isAllowedOrigin(request.headers.get('Origin'), request.url)) {
    return json({ ok: false, error: 'Zahteva ni dovoljena.' }, 403);
  }

  const length = Number(request.headers.get('Content-Length') ?? 0);
  if (length > MAX_BYTES) {
    return json({ ok: false, error: 'Sporočilo je predolgo.' }, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'Neveljavna zahteva.' }, 400);
  }

  const get = (key: string) => String(form.get(key) ?? '').trim();

  // Past za bote: človek tega polja ne vidi. Botu »uspe«, sporočilo pa zavržemo.
  if (get('spletna_stran')) return json({ ok: true });

  const name = get('ime');
  const email = get('email');
  const phone = get('telefon');
  const planRaw = get('paket');
  const message = get('sporocilo');
  const consent = form.get('soglasje');
  const token = get('cf-turnstile-response');

  const errors: string[] = [];
  if (name.length < 2 || name.length > 100) errors.push('ime');
  if (!EMAIL_RE.test(email) || email.length > 200) errors.push('email');
  if (phone.length > 40 || (phone && !/^[\d\s+()./-]+$/.test(phone))) errors.push('telefon');
  if (message.length < 10 || message.length > 5000) errors.push('sporocilo');
  if (!consent) errors.push('soglasje');
  if (errors.length) {
    return json({ ok: false, error: 'Preverite izpolnjena polja in poskusite znova.', fields: errors }, 422);
  }
  const plan = PLANS.includes(planRaw) ? planRaw : 'Še ne vem';

  if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.error('[contact] Manjkajo okoljske spremenljivke (TURNSTILE_SECRET_KEY / RESEND_API_KEY / CONTACT_TO / CONTACT_FROM).');
    return json({ ok: false, error: 'Obrazec trenutno ni na voljo. Pokličite +386 40 336 379.' }, 500);
  }

  if (!token) {
    return json({ ok: false, error: 'Preverjanje proti spamu ni zaključeno. Poskusite znova.' }, 400);
  }
  const human = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, request.headers.get('CF-Connecting-IP'));
  if (!human) {
    return json({ ok: false, error: 'Preverjanje proti spamu ni uspelo. Osvežite stran in poskusite znova.' }, 403);
  }

  const rows: [string, string][] = [
    ['Ime in priimek', name],
    ['E-pošta', email],
    ['Telefon', phone || '—'],
    ['Paket', plan],
  ];
  const html = `<!doctype html><html lang="sl"><body style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.5">
<h2 style="margin:0 0 16px">Novo povpraševanje s sitecraftstudio.si</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#666;padding-right:16px">${escapeHtml(k)}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`,
    )
    .join('')}</table>
<p style="margin:20px 0 6px;color:#666">Sporočilo:</p>
<div style="white-space:pre-wrap;border-left:3px solid #586a6a;padding:8px 14px">${escapeHtml(message)}</div>
<p style="margin-top:24px;color:#999;font-size:12px">Odgovorite neposredno na to e-pošto — odgovor gre na ${escapeHtml(email)}.</p>
</body></html>`;
  const text = `Novo povpraševanje s sitecraftstudio.si\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nSporočilo:\n${message}\n`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `Novo povpraševanje: ${name} (${plan})`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    console.error('[contact] Resend napaka', res.status, await res.text().catch(() => ''));
    return json({ ok: false, error: 'Pošiljanje ni uspelo. Poskusite znova ali pokličite +386 40 336 379.' }, 502);
  }

  return json({ ok: true });
};
