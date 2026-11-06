/**
 * Wordmark »Site Craft Studio.« (hero + noga): optično kerniranje po parih črk.
 *
 * Črke so ločeni elementi (maska v heroju, enoten videz v nogi), zato brskalnik ne
 * uporabi kerninga pisave. Vrednosti (em) so izračunane iz obrisov Domine 400:
 * polovična izravnava belega prostora med črkami + spodnja meja 0.045em najmanjšega
 * razmika (prečki f/t in serife a–f, t–u, d–i se ne dotikajo).
 *
 * Velja ob osnovnem razmiku --wm-track (tokens.css). Ob spremembi WM_KERN ali
 * --wm-track znova izmeri --wm-ratio in --wm-ratio-2l.
 */
export const WM_KERN: Record<string, number> = {
  Si: -0.01,
  te: 0.01,
  Cr: -0.006,
  ra: 0.011,
  af: 0.023,
  ft: 0.033,
  St: -0.002,
  tu: 0.026,
  ud: 0.006,
  di: 0.004,
  io: 0.005,
  'o.': -0.012,
};

/** Popravek razmika (em) za črko `ch`, ki ji sledi `next`. */
export const wmKern = (ch: string, next = ''): number => WM_KERN[ch + next] ?? 0;
