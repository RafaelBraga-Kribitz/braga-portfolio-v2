// src/lib/remark/sidenotes.mjs — footnotes as hanging side notes (owner,
// 24 Oct 2026; the pattern of braga-design-system-template, tokens/
// canvas.css .noteref / .sidenote). A note with `footnotes: side` in its
// properties gets no footnotes section: each [^n] becomes a small mono
// number in the text and the definition's words hang in the right margin
// of the document, level with the top of the paragraph that refers to
// them, under a hairline (components.css, section 6). Below 1280 the note
// follows the reference in the text, opened by a rule on its left. Other notes keep
// GFM footnotes. Sätteri mdast phase, after obsidian.mjs.
const text = (value) => ({ type: 'text', value });
const el = (hName, className, children, extra = {}) => ({ type: 'bk-x', data: { hName, hProperties: { className, ...extra } }, children });

function sideOn(ctx) {
  const fm = ctx.data && ctx.data.astro && ctx.data.astro.frontmatter;
  return Boolean(fm && fm.footnotes === 'side');
}

function rootOf(ctx, node) {
  let n = node;
  for (let p = ctx.parent(n); p; p = ctx.parent(n)) n = p;
  return n;
}

/** Every [^id] in document order, numbered from 1 (first reference wins). */
function numbering(root) {
  const order = new Map();
  (function walk(n) {
    if (!n || n.type === 'footnoteDefinition') return;
    if (n.type === 'footnoteReference' && !order.has(n.identifier)) order.set(n.identifier, order.size + 1);
    for (const c of n.children ?? []) walk(c);
  })(root);
  return order;
}

/** The note's number and words for a reference, or undefined. */
function lookup(root, ref) {
  const def = (root.children ?? []).find((c) => c.type === 'footnoteDefinition' && c.identifier === ref.identifier);
  if (!def) return undefined;
  const n = String(numbering(root).get(ref.identifier) ?? '');
  const body = (def.children ?? []).flatMap((c, i) => (c.type === 'paragraph' ? [...(i ? [text(' ')] : []), ...(c.children ?? [])] : []));
  return { n, body };
}
// each copy gets its own plain copy of the definition's words: one tree
// node cannot stand in two places
const copy = (nodes) => JSON.parse(JSON.stringify(nodes, (k, v) => (k === 'position' ? undefined : v)));
const note = (n, body, place) => el('span', ['sidenote'], [el('span', ['ref'], [text(n)]), text(' '), ...copy(body)], { role: 'note', dataPlace: place });

export const sidenotes = {
  name: 'bk-sidenotes',
  // two copies of each note, one shown at a time (display: none takes the
  // other out of the accessibility tree too): in the margin, level with the
  // top of the paragraph, from 1280; in the text, after the reference,
  // below. The paragraph is rebuilt in one replace (a prepend beside a
  // child's replace does not survive the pass).
  paragraph(node, ctx) {
    if (!sideOn(ctx)) return;
    const root = rootOf(ctx, node);
    const margin = [];
    const swap = (children) => children.flatMap((c) => {
      if (c.type === 'footnoteReference') {
        const found = lookup(root, c);
        if (!found) return [c];
        margin.push(note(found.n, found.body, 'margin'));
        return [el('sup', ['noteref'], [text(found.n)]), note(found.n, found.body, 'inline')];
      }
      return c.children ? [{ ...c, children: swap(c.children) }] : [c];
    });
    const children = swap(copy(node.children ?? []));
    if (!margin.length) return;
    ctx.replaceNode(node, { type: 'paragraph', children: [...margin, ...children] });
  },
  footnoteDefinition(node, ctx) {
    if (sideOn(ctx)) ctx.removeNode(node);
  },
};

export default sidenotes;
