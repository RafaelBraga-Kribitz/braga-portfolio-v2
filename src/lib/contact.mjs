// The contact path (UX pass, 22 Oct 2026): every way to write ends in the
// same pair, a mailto link and a "Copy address" button, so a reader
// without a mail client is never left at a dead end. The button ships
// with `hidden` and the inline shell script in Base.astro reveals it and
// swaps its label (data-label / data-copied / data-failed) for two
// seconds after a click. Shared by the Astro components and the cta
// callout of the Markdown pipeline (src/lib/remark/callouts.mjs), so the
// strings live here rather than in i18n.ts.

/** Button labels by language. `failed` says how to recover. */
export const COPY_LABELS = {
  en: { label: 'Copy address', copied: 'Copied', failed: 'Copy failed · select the address' },
  de: { label: 'Adresse kopieren', copied: 'Kopiert', failed: 'Kopieren fehlgeschlagen · Adresse markieren' },
};

/** The address out of a mailto: URL, without the query. */
export function mailtoAddress(url) {
  return decodeURIComponent(String(url).replace(/^mailto:/i, '').split('?')[0]);
}

/** Attributes of the copy button (hast property names). */
export function copyButtonProps(lang, address) {
  const w = COPY_LABELS[lang === 'de' ? 'de' : 'en'];
  return { type: 'button', className: ['button'], dataCopy: address, dataLabel: w.label, dataCopied: w.copied, dataFailed: w.failed, ariaLive: 'polite', hidden: true };
}
