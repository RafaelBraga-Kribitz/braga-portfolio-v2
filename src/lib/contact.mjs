// The contact button (owner, 23 Oct 2026). One accent button that reads
// as the email address; on hover (or keyboard focus) it splits in two:
// "Copy" on the left, "Open" on the right, each with its own highlight.
// Shared by src/components/ContactActions.astro and the mailto cta callout
// of the Markdown pipeline (src/lib/remark/callouts.mjs), so the strings
// and the encoding live here rather than in i18n.ts.
//
// The address never appears in the HTML. It is stored as its two halves,
// each reversed (data-u="ztirbik…", data-d="moc.liamg"), with no "@";
// CSS draws it with content: attr(data-d) "@" attr(data-u) under a
// right-to-left override, so it reads correctly but is generated text:
// it cannot be selected or copied by hand, and a scraper reading the
// source finds no address. The inline shell script in Base.astro
// reassembles it only when Copy or Open is clicked. This raises the cost
// of scraping; it does not make it impossible (a scraper that runs CSS
// and the script can still read it).

/** Button labels by language. `failed` says how to recover. */
export const MAIL_LABELS = {
  en: { copy: 'Copy', open: 'Open', copied: 'Copied', failed: 'Use Open', copyName: 'Copy the email address', openName: 'Write an email' },
  de: { copy: 'Kopieren', open: 'Öffnen', copied: 'Kopiert', failed: 'Öffnen nutzen', copyName: 'E-Mail-Adresse kopieren', openName: 'E-Mail schreiben' },
};

const reverse = (s) => Array.from(s).reverse().join('');

/** The two reversed halves of an address: { u, d }. */
export function mailParts(address) {
  const [user, domain] = String(address).split('@');
  return { u: reverse(user), d: reverse(domain ?? '') };
}

/** The address out of a mailto: URL, without the query. */
export function mailtoAddress(url) {
  return decodeURIComponent(String(url).replace(/^mailto:/i, '').split('?')[0]);
}
