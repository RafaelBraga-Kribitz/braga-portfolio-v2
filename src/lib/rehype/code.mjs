// src/lib/rehype/code.mjs — code blocks in the Sätteri hast phase (D-035).
// Astro's Prism highlighter (syntaxHighlight: 'prism', class-based, no inline
// styles) hands over <pre class="language-x"><code class="language-x"> with
// <span class="token …"> runs. This pass turns it into the panel of
// Templates §03 / components.css:
//
//   <div class="code" data-lang="x" data-wrap="on">
//     <div class="code-bar"><span>x</span><span class="code-tools">
//       <button type="button" class="code-wrap" aria-pressed="true">Wrap · on</button>
//       <button type="button" class="code-copy">Copy</button></span></div>
//     <pre><code class="language-x">…</code></pre>
//   </div>
//
// and maps Prism's token classes onto the six token classes the stylesheet
// styles (tok-kw, tok-fn, tok-str, tok-num, tok-cm, tok-op); a token outside
// the six is unwrapped and reads as an identifier (code-ink). Wrap is on by
// default and the block is complete without code.js (the buttons are inert).
// Each panel sets `hasCode: true` in the document's plugin frontmatter, which
// the page templates read from render(entry).remarkPluginFrontmatter.
//
// The button labels follow the document's language (frontmatter `lang`, as
// footnotes.mjs does): the build writes the first label, and the labels
// code.js swaps in later travel as data attributes (data-on / data-off on
// Wrap, data-copied / data-failed on Copy, data-label: the resting label),
// so public/scripts/code.js carries no strings of its own. The German
// labels are agent drafts awaiting the owner's approval (O-05).

import { CODE_LABELS } from '../remark/code-lang.mjs';

/** The panel's chrome strings by document language. */
export const CODE_STRINGS = {
  en: { on: 'Wrap · on', off: 'Wrap · off', copy: 'Copy', copied: 'Copied', failed: 'Copy failed' },
  de: { on: 'Umbruch · an', off: 'Umbruch · aus', copy: 'Kopieren', copied: 'Kopiert', failed: 'Kopieren fehlgeschlagen' },
};

/** Prism token class → the six-token palette (first match in class order wins). */
const TOKENS = {
  comment: 'tok-cm', prolog: 'tok-cm', doctype: 'tok-cm', cdata: 'tok-cm', shebang: 'tok-cm',
  keyword: 'tok-kw', boolean: 'tok-kw', atrule: 'tok-kw', rule: 'tok-kw', important: 'tok-kw', directive: 'tok-kw',
  function: 'tok-fn', 'class-name': 'tok-fn', builtin: 'tok-fn', decorator: 'tok-fn', tag: 'tok-fn', selector: 'tok-fn', 'function-variable': 'tok-fn', annotation: 'tok-fn',
  string: 'tok-str', char: 'tok-str', 'attr-value': 'tok-str', 'template-string': 'tok-str', 'triple-quoted-string': 'tok-str', regex: 'tok-str', url: 'tok-str', symbol: 'tok-str',
  number: 'tok-num', constant: 'tok-num', unit: 'tok-num', hexcode: 'tok-num', entity: 'tok-num',
  operator: 'tok-op', punctuation: 'tok-op', 'attr-equals': 'tok-op', arrow: 'tok-op',
};
const LABEL = { plaintext: 'text', text: 'text', txt: 'text' };

/** @param {string} tag @param {Record<string, unknown>} properties @param {any[]} children */
const h = (tag, properties, children) => ({ type: 'element', tagName: tag, properties, children });
/** @param {string} value */
const t = (value) => ({ type: 'text', value });

/**
 * Rewrites Prism's token spans to the six classes; unwraps everything else.
 * Prism emits nothing but text and token spans, so any other element is
 * markup that leaked through an unhighlighted fence (see
 * src/lib/remark/code-lang.mjs): it is unwrapped to its text, never kept.
 * Pure.
 * @param {any[]} nodes
 * @returns {any[]}
 */
function retoken(nodes) {
  const out = [];
  for (const n of nodes) {
    if (n.type === 'text') { out.push(n); continue; }
    if (n.type !== 'element') continue; // comments, raw: dropped
    const children = retoken(n.children || []);
    const classes = Array.isArray(n.properties && n.properties.className) ? n.properties.className : [];
    const cls = n.tagName === 'span' && classes.includes('token') ? classes.map((c) => TOKENS[c]).find(Boolean) : undefined;
    if (cls) out.push(h('span', { className: [cls] }, children));
    else out.push(...children);
  }
  return out;
}

export const codePanel = {
  name: 'bk-code',
  element: {
    filter: ['pre'],
    visit(node, ctx) {
      const code = (node.children || []).find((c) => c.type === 'element' && c.tagName === 'code');
      if (!code) return;
      const classes = Array.isArray(code.properties && code.properties.className) ? code.properties.className : [];
      const langClass = classes.find((c) => typeof c === 'string' && c.startsWith('language-'));
      const lang = langClass ? langClass.slice('language-'.length) : 'plaintext';
      if (lang === 'math' || classes.includes('math-display')) return; // KaTeX's, not ours
      const parent = ctx.parent(node);
      const pclass = parent && parent.type === 'element' && parent.properties ? parent.properties.className : undefined;
      if (Array.isArray(pclass) && pclass.includes('code')) return; // already a panel
      const body = JSON.parse(JSON.stringify(code.children || []));
      // a fence language Prism does not know was rendered as text; its
      // authored name is in the data bag (src/lib/remark/code-lang.mjs)
      const labels = ctx.data[CODE_LABELS];
      const authored = labels instanceof Map ? labels.get(ctx.textContent(code).replace(/\n$/, '')) : undefined;
      // tell the page it has a code panel: render(entry).remarkPluginFrontmatter.hasCode
      // switches Base's hasCode (the one page that loads /scripts/code.js)
      const fm = ctx.data.astro && ctx.data.astro.frontmatter;
      if (fm && typeof fm === 'object') fm.hasCode = true;
      const w = CODE_STRINGS[fm && fm.lang === 'de' ? 'de' : 'en'];
      return h('div', { className: ['code'], dataLang: authored || lang, dataWrap: 'on' }, [
        h('div', { className: ['code-bar'] }, [
          h('span', {}, [t(authored || LABEL[lang] || lang)]),
          h('span', { className: ['code-tools'] }, [
            h('button', { type: 'button', className: ['code-wrap'], ariaPressed: 'true', dataOn: w.on, dataOff: w.off }, [t(w.on)]),
            h('button', { type: 'button', className: ['code-copy'], dataLabel: w.copy, dataCopied: w.copied, dataFailed: w.failed }, [t(w.copy)]),
          ]),
        ]),
        h('pre', {}, [h('code', { className: [`language-${lang}`] }, retoken(body))]),
      ]);
    },
  },
};

export default codePanel;
