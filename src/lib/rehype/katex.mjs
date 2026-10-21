// src/lib/rehype/katex.mjs — KaTeX at build for the Sätteri hast phase.
// The same job as rehype-katex (which runs only on the unified processor
// that Astro 7 no longer installs): every <code class="language-math"> that
// the math feature emits is rendered to HTML plus MathML (AUDIT §8); a
// display block replaces its <pre>. The page ships no math script; the KaTeX
// stylesheet and fonts are served from /fonts/katex/.
//
// A formula KaTeX cannot parse fails the build, naming the file and the
// formula: the error fallback would render red text with an inline style,
// which the design system forbids.
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

/**
 * @param {import('katex').KatexOptions} [options]  merged over the defaults
 *   { output: 'htmlAndMathml', strict: false }
 */
export default function katexPlugin(options = {}) {
  const settings = { output: 'htmlAndMathml', strict: false, ...options };
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
        const nodes = 'children' in tree ? tree.children : [];
        ctx.replaceNode(inPre ? parent : node, nodes);
      },
    },
  };
}
