// src/lib/rehype/math.mjs — display mathematics in the Sätteri hast phase.
// After KaTeX, each display block (<span class="katex-display">) becomes
//
//   <div class="math"><div class="math-body">…</div><span class="eq-no">(n)</span></div>
//
// numbered in document order, per page. When the document's frontmatter has
// a code (01-04), the number derives from it — (01-04-1) — as Templates §04
// says: never typed. Two passes (the inner wrapper first, then the outer one
// with its number), because a node built in a pass cannot be wrapped again
// in the same pass.
const COUNTER = 'bkEquation';

/** @param {any} node @param {string} name */
const hasClass = (node, name) => !!node && node.type === 'element' && Array.isArray(node.properties && node.properties.className) && node.properties.className.includes(name);

export const mathBody = {
  name: 'bk-math-body',
  element: {
    filter: ['span'],
    visit(node, ctx) {
      if (!hasClass(node, 'katex-display')) return;
      if (hasClass(ctx.parent(node), 'math-body')) return;
      ctx.wrapNode(node, { type: 'element', tagName: 'div', properties: { className: ['math-body'] }, children: [] });
    },
  },
};

export const mathNumber = {
  name: 'bk-math-number',
  element: {
    filter: ['div'],
    visit(node, ctx) {
      if (!hasClass(node, 'math-body')) return;
      if (hasClass(ctx.parent(node), 'math')) return;
      const n = (typeof ctx.data[COUNTER] === 'number' ? ctx.data[COUNTER] : 0) + 1;
      ctx.data[COUNTER] = n;
      const fm = ctx.data.astro && ctx.data.astro.frontmatter;
      const code = fm && typeof fm.code === 'string' && fm.code ? `${fm.code}-` : '';
      ctx.wrapNode(node, {
        type: 'element', tagName: 'div', properties: { className: ['math'] },
        children: [{ type: 'element', tagName: 'span', properties: { className: ['eq-no'] }, children: [{ type: 'text', value: `(${code}${n})` }] }],
      });
    },
  },
};

export default [mathBody, mathNumber];
