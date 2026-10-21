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
 * Rewrites Prism's token spans to the six classes; unwraps the rest. Pure.
 * @param {any[]} nodes
 * @returns {any[]}
 */
function retoken(nodes) {
  const out = [];
  for (const n of nodes) {
    if (n.type !== 'element') { out.push(n); continue; }
    const children = retoken(n.children || []);
    const classes = Array.isArray(n.properties && n.properties.className) ? n.properties.className : [];
    if (n.tagName === 'span' && classes.includes('token')) {
      const cls = classes.map((c) => TOKENS[c]).find(Boolean);
      if (cls) out.push(h('span', { className: [cls] }, children));
      else out.push(...children);
      continue;
    }
    out.push({ ...n, children });
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
      return h('div', { className: ['code'], dataLang: lang, dataWrap: 'on' }, [
        h('div', { className: ['code-bar'] }, [
          h('span', {}, [t(LABEL[lang] || lang)]),
          h('span', { className: ['code-tools'] }, [
            h('button', { type: 'button', className: ['code-wrap'], ariaPressed: 'true' }, [t('Wrap · on')]),
            h('button', { type: 'button', className: ['code-copy'] }, [t('Copy')]),
          ]),
        ]),
        h('pre', {}, [h('code', { className: [`language-${lang}`] }, retoken(body))]),
      ]);
    },
  },
};

export default codePanel;
