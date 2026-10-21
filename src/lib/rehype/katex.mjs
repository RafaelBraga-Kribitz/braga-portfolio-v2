// src/lib/rehype/katex.mjs — KaTeX at build for the Sätteri hast phase.
// The same job as rehype-katex (which runs only on the unified processor
// that Astro 7 no longer installs): every <code class="language-math"> that
// the math feature emits becomes native MathML, as the Templates specimen
// §04 sets it:
//
//   inline   $p_1$        → <math>…</math>
//   display  $$ … $$      → <math display="block">…</math>  (replaces its <pre>;
//                            math.mjs then numbers it inside div.math)
//
// MathML only (decision of 21 Oct 2026, design-system/README.md): KaTeX's
// HTML layer writes inline style attributes (struts, vlists), which the
// no-inline-style rule forbids, and needs the KaTeX stylesheet and fonts.
// Native MathML needs neither; the browser lays it out. KaTeX's outer
// <span class="katex"> is dropped, so the page carries no KaTeX class.
// The TeX source stays in <annotation encoding="application/x-tex">.
//
// A formula KaTeX cannot parse fails the build, naming the file and the
// formula: the error fallback would render red text with an inline style.
//
// KaTeX writes <math xmlns="http://www.w3.org/1998/Math/MathML">; Sätteri's
// htmlToHast stores that attribute as ":xmlns", which serialises as an
// invalid attribute name. In HTML the parser puts <math> in the MathML
// namespace on its own, so the attribute is dropped before parsing.
import katex from 'katex';
import { htmlToHast } from 'satteri';

const MATHML_XMLNS = / xmlns="http:\/\/www\.w3\.org\/1998\/Math\/MathML"/g;

/** @param {string[] | undefined} classes @param {string} name */
const has = (classes, name) => Array.isArray(classes) && classes.includes(name);

/** The <math> elements of a parsed fragment, KaTeX's <span class="katex"> unwrapped. @param {any[]} nodes @returns {any[]} */
function mathOf(nodes) {
  const out = [];
  for (const n of nodes) {
    if (n.type !== 'element') continue;
    if (n.tagName === 'math') out.push(n);
    else if (Array.isArray(n.children)) out.push(...mathOf(n.children));
  }
  return out;
}

/**
 * @param {import('katex').KatexOptions} [options]  merged over the defaults
 *   { strict: false }; `output` is always 'mathml'
 */
export default function katexPlugin(options = {}) {
  const settings = { strict: false, ...options, output: /** @type {const} */ ('mathml') };
  return {
    name: 'bk-katex',
    element: {
      filter: ['code'],
      visit(node, ctx) {
        const classes = node.properties && node.properties.className;
        if (!has(classes, 'language-math') && !has(classes, 'math-display') && !has(classes, 'math-inline')) return;
        const parent = ctx.parent(node);
        const inPre = parent && parent.type === 'element' && parent.tagName === 'pre';
        const displayMode = inPre || has(classes, 'math-display');
        const value = ctx.textContent(node).replace(/\n$/, '');
        let html;
        try {
          html = katex.renderToString(value, { ...settings, displayMode, throwOnError: true });
        } catch (error) {
          const where = ctx.fileURL ? ctx.fileURL.pathname : 'markdown';
          throw new Error(`KaTeX could not render ${displayMode ? 'display' : 'inline'} math in ${where}: ${error instanceof Error ? error.message : String(error)}\n  ${value}`);
        }
        const tree = htmlToHast(html.replace(MATHML_XMLNS, ''), { fragment: true });
        const nodes = mathOf('children' in tree ? tree.children : []);
        if (nodes.length !== 1) throw new Error(`KaTeX returned ${nodes.length} <math> elements for: ${value}`);
        ctx.replaceNode(inPre ? parent : node, nodes);
      },
    },
  };
}
