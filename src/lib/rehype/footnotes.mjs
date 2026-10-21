// src/lib/rehype/footnotes.mjs — the GFM footnotes section by page language.
// The processor's label and back-reference strings are global (English, set
// in astro.config.mjs with ← as the backref glyph, the one in D-030); this
// pass localises them for a German document (frontmatter lang: de).
const LABEL = { en: 'Footnotes', de: 'Fußnoten' };
const BACK = { en: 'Back to reference', de: 'Zurück zu Verweis' };

export default function footnotes(factory) {
  const fm = factory && factory.data && factory.data.astro && factory.data.astro.frontmatter;
  const lang = fm && fm.lang === 'de' ? 'de' : 'en';
  if (lang === 'en') return null; // nothing to do: the configured strings are English
  return {
    name: 'bk-footnotes',
    element: [
      {
        filter: ['h2'],
        visit(node, ctx) {
          if (!node.properties || node.properties.id !== 'footnote-label') return;
          ctx.setProperty(node, 'children', [{ type: 'text', value: LABEL[lang] }]);
        },
      },
      {
        filter: ['a'],
        visit(node, ctx) {
          const label = node.properties && node.properties.ariaLabel;
          if (typeof label !== 'string' || !label.startsWith(BACK.en)) return;
          ctx.setProperty(node, 'ariaLabel', label.replace(BACK.en, BACK[lang]));
        },
      },
    ],
  };
}
