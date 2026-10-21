// src/lib/remark/callouts.mjs — Obsidian callouts and ==marks== for the
// Sätteri mdast phase (Astro 7's default Markdown processor; the file sits
// under remark/ because it does what a remark plugin would do).
//
// Authoring (Obsidian syntax):
//   > [!type] Title            → <div class="callout" data-callout="type">
//   > [!type|wide] Title       → … data-callout-metadata="wide"
//   > [!faq]- Question         → <details class="callout" data-callout="faq">
//                                (- closed, + open; the summary is the title)
//   > [!spec] Model inputs     → list items "Term — value" become <dl><dt><dd>
//   > [!metrics] Key figures   → list items "value — label" become
//                                <li><b>value</b><span>label</span></li>;
//                                ==value== keeps its <mark> inside <b> and the
//                                item gets class="key" (the earned figure)
//   > [!bookmark] Next         → the single link becomes the card:
//                                <a href><b>text</b><span class="sub">rest</span>
//                                <span class="glyph" aria-hidden="true">→</span></a>
//   > [!cta] Call to action    → <a href>text <span class="glyph">↗</span></a>
//   ==text== in a paragraph    → <mark>text</mark> (list items and table
//                                cells too; headings stay plain)
//   a callout inside a callout → built by the outer one, any depth
//
// Two passes, in order: marks first (so a metrics value can carry its mark),
// then the callouts. Both build plain mdast/custom nodes that the processor
// renders through data.hName / data.hProperties (the vocabulary of
// design-system/components.css, section 3; no class is invented here).

/** Inline node types a text node may sit inside and still be "in a paragraph". */
const INLINE = new Set(['emphasis', 'strong', 'delete', 'link', 'linkReference', 'superscript', 'subscript']);
const MARK = /==([^=\n]+?)==/g;
const MARKER = /^\[!([A-Za-z0-9_-]+)(?:\|([^\]]*))?\]([+-])?[ \t]*/;
const SEPARATOR = /\s+[—–]\s+|\s+[—–]$/; // "Term — value" (em or en dash); a dash at the end of a text node hands the rest to the next node
const EXTERNAL = /^[a-z][a-z0-9+.-]*:/i;    // an absolute URL (http:, https:, mailto:) gets ↗

/** @param {string} type */
const titleCase = (type) => type.charAt(0).toUpperCase() + type.slice(1);

/**
 * A fresh, mutable copy of a materialised subtree (positions are not read, so
 * a JSON round trip loses nothing the renderer needs).
 * @template T
 * @param {T} nodes
 * @returns {T}
 */
const clone = (nodes) => JSON.parse(JSON.stringify(nodes));

/** @param {string} tag @param {Record<string, unknown>} [props] @param {any[]} [children] */
const el = (tag, props, children = []) => ({
  type: `bk-${tag}`,
  data: { hName: tag, ...(props && Object.keys(props).length ? { hProperties: props } : {}) },
  children,
});
/** @param {string} value */
const text = (value) => ({ type: 'text', value });
/** @param {string} value */
const mark = (value) => ({ type: 'mark', data: { hName: 'mark' }, children: [text(value)] });

/**
 * Splits text nodes on ==…== into text and mark nodes. Pure.
 * @param {any[]} nodes
 * @returns {{ nodes: any[], changed: boolean }}
 */
function markify(nodes) {
  const out = [];
  let changed = false;
  for (const n of nodes) {
    if (n.type !== 'text' || !MARK.test(n.value)) { out.push(n); MARK.lastIndex = 0; continue; }
    MARK.lastIndex = 0;
    const parts = n.value.split(MARK);
    parts.forEach((p, i) => { if (i % 2) out.push(mark(p)); else if (p) out.push(text(p)); });
    changed = true;
  }
  return { nodes: out, changed };
}

/**
 * The first block ancestor of a text node, walking up through inline nodes.
 * @param {any} node @param {any} ctx
 */
function blockAncestor(node, ctx) {
  let p = ctx.parent(node);
  while (p && INLINE.has(p.type)) p = ctx.parent(p);
  return p;
}

/** Blocks whose text may carry ==marks== (Obsidian highlights there too; headings stay plain). */
const MARK_BLOCKS = new Set(['paragraph', 'tableCell']);

/** Pass 1: ==text== → <mark> inside paragraphs (list items included) and table cells. */
export const marks = {
  name: 'bk-marks',
  text(node, ctx) {
    if (!node.value.includes('==')) return;
    const block = blockAncestor(node, ctx);
    if (!block || !MARK_BLOCKS.has(block.type)) return;
    const { nodes, changed } = markify([clone(node)]);
    if (changed) ctx.replaceNode(node, nodes);
  },
};

/**
 * Splits a paragraph's inline children at the first "Term — value" separator.
 * @param {any[]} inline
 * @returns {{ before: any[], after: any[] } | null}
 */
function splitAtSeparator(inline) {
  for (let i = 0; i < inline.length; i++) {
    const n = inline[i];
    if (n.type !== 'text') continue;
    const m = SEPARATOR.exec(n.value);
    if (!m) continue;
    const before = inline.slice(0, i);
    const head = n.value.slice(0, m.index);
    const tail = n.value.slice(m.index + m[0].length);
    if (head) before.push(text(head));
    const after = tail ? [text(tail)] : [];
    after.push(...inline.slice(i + 1));
    return { before, after };
  }
  return null;
}

/**
 * The inline children of a list item: its first paragraph (a tight item).
 * @param {any} item
 */
const itemInline = (item) => {
  const p = item.children && item.children.find((c) => c.type === 'paragraph');
  return p ? p.children : [];
};

/**
 * Splits the first paragraph of the blockquote into the marker, the title
 * (the rest of the first line) and the content that follows.
 * @param {any[]} blocks  cloned blockquote children
 */
function parseHead(blocks) {
  const first = blocks[0];
  if (!first || first.type !== 'paragraph' || !first.children.length) return null;
  const t0 = first.children[0];
  if (t0.type !== 'text') return null;
  const m = MARKER.exec(t0.value);
  if (!m) return null;
  const type = m[1].toLowerCase();
  const metadata = (m[2] || '').trim();
  const fold = m[3] || '';
  // the title runs to the end of the first line; the content starts after it
  const rest = t0.value.slice(m[0].length);
  const nl = rest.indexOf('\n');
  const title = [];
  const contentInline = [];
  if (nl >= 0) {
    if (rest.slice(0, nl)) title.push(text(rest.slice(0, nl)));
    const tail = rest.slice(nl + 1);
    if (tail) contentInline.push(text(tail));
    contentInline.push(...first.children.slice(1));
  } else {
    if (rest) title.push(text(rest));
    let i = 1;
    for (; i < first.children.length; i++) {
      const n = first.children[i];
      if (n.type === 'text' && n.value.includes('\n')) {
        const k = n.value.indexOf('\n');
        if (n.value.slice(0, k)) title.push(text(n.value.slice(0, k)));
        if (n.value.slice(k + 1)) contentInline.push(text(n.value.slice(k + 1)));
        contentInline.push(...first.children.slice(i + 1));
        break;
      }
      title.push(n);
    }
  }
  const content = blocks.slice(1);
  if (contentInline.length) content.unshift({ type: 'paragraph', children: contentInline });
  return { type, metadata, fold, title, content };
}

/**
 * spec: the first list → <dl>.
 * @param {any[]} content @param {any} ctx @param {any} node
 */
function specList(content, ctx, node) {
  const i = content.findIndex((b) => b.type === 'list');
  if (i < 0) return;
  const rows = [];
  for (const item of content[i].children) {
    const inline = itemInline(item);
    const split = splitAtSeparator(inline);
    if (!split) {
      ctx.report({ message: 'spec callout: a list item has no "Term — value" separator', node, severity: 'warning' });
      rows.push(el('dt', {}, inline), el('dd', {}, []));
      continue;
    }
    rows.push(el('dt', {}, split.before), el('dd', {}, split.after));
  }
  content[i] = el('dl', {}, rows);
}

/**
 * metrics: the first list → <ul><li class?><b>value</b><span>label</span></li>.
 * @param {any[]} content @param {any} ctx @param {any} node
 */
function metricsList(content, ctx, node) {
  const i = content.findIndex((b) => b.type === 'list');
  if (i < 0) return;
  const items = [];
  for (const item of content[i].children) {
    const inline = itemInline(item);
    const split = splitAtSeparator(inline) || { before: inline, after: [] };
    if (!splitAtSeparator(inline)) ctx.report({ message: 'metrics callout: a list item has no "value — label" separator', node, severity: 'warning' });
    const key = split.before.some((n) => n.type === 'mark');
    items.push(el('li', key ? { className: ['key'] } : {}, [el('b', {}, split.before), el('span', {}, split.after)]));
  }
  content[i] = el('ul', {}, items);
}

/**
 * The first link in the content, with the inline nodes around it.
 * @param {any[]} content
 */
function findLink(content) {
  for (let b = 0; b < content.length; b++) {
    const block = content[b];
    if (block.type !== 'paragraph') continue;
    const i = block.children.findIndex((n) => n.type === 'link');
    if (i < 0) continue;
    return { block: b, index: i, link: block.children[i], inline: block.children };
  }
  return null;
}

/** Drops a leading separator (dash, dot, colon, spaces) from a run of inline nodes. */
function trimLead(nodes) {
  const out = clone(nodes);
  while (out.length && out[0].type === 'text') {
    out[0].value = out[0].value.replace(/^[\s—–·:]+/, '');
    if (out[0].value) break;
    out.shift();
  }
  return out;
}

/** @param {string} url */
const glyph = (url) => el('span', { className: ['glyph'], ariaHidden: 'true' }, [text(EXTERNAL.test(url) ? '↗' : '→')]);

/**
 * bookmark: the single link becomes the whole card.
 * @param {any[]} content @param {any} ctx @param {any} node
 */
function bookmarkLink(content, ctx, node) {
  const found = findLink(content);
  if (!found) { ctx.report({ message: 'bookmark callout: no link in the content', node, severity: 'warning' }); return; }
  let sub = trimLead(found.inline.slice(found.index + 1));
  if (!sub.length) {
    const next = content[found.block + 1];
    if (next && next.type === 'paragraph') { sub = next.children; content.splice(found.block + 1, 1); }
  }
  const children = [el('b', {}, found.link.children)];
  if (sub.length) children.push(el('span', { className: ['sub'] }, sub));
  children.push(glyph(found.link.url));
  content[found.block] = el('a', { href: found.link.url, ...(found.link.title ? { title: found.link.title } : {}) }, children);
}

/**
 * cta: the single link becomes the button.
 * @param {any[]} content @param {any} ctx @param {any} node
 */
function ctaLink(content, ctx, node) {
  const found = findLink(content);
  if (!found) { ctx.report({ message: 'cta callout: no link in the content', node, severity: 'warning' }); return; }
  content[found.block] = el('a', { href: found.link.url }, [...found.link.children, text(' '), glyph(found.link.url)]);
}

/**
 * Builds the callout for a blockquote's (cloned) children, or null when the
 * blockquote is an ordinary quotation. Callouts nested inside are built here
 * too: a node replaced in a pass cannot be replaced again from inside.
 * @param {any[]} blocks @param {any} ctx @param {any} node
 */
function build(blocks, ctx, node) {
  const head = parseHead(blocks);
  if (!head) return null;
  const { type, metadata, fold } = head;
  const content = head.content;
  nest(content, ctx, node);
  const title = head.title.length ? head.title : [text(type === 'cta' ? 'Call to action' : titleCase(type))];
  if (type === 'spec') specList(content, ctx, node);
  else if (type === 'metrics') metricsList(content, ctx, node);
  else if (type === 'bookmark') bookmarkLink(content, ctx, node);
  else if (type === 'cta') ctaLink(content, ctx, node);
  const faq = type === 'faq';
  const props = { className: ['callout'], dataCallout: type };
  if (metadata) props.dataCalloutMetadata = metadata;
  if (faq && fold === '+') props.open = true;
  return el(faq ? 'details' : 'div', props, [
    el(faq ? 'summary' : 'div', { className: ['callout-title'] }, title),
    el('div', { className: ['callout-content'] }, content),
  ]);
}

/**
 * Replaces, in place, every callout blockquote below these nodes.
 * @param {any[]} nodes @param {any} ctx @param {any} node
 */
function nest(nodes, ctx, node) {
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.type === 'blockquote') {
      const built = build(n.children, ctx, node);
      if (built) { nodes[i] = built; continue; }
    }
    if (Array.isArray(n.children)) nest(n.children, ctx, node);
  }
}

/** Whether a blockquote opens with a callout marker. @param {any} bq */
const isCallout = (bq) => {
  const first = bq.children && bq.children[0];
  const t0 = first && first.type === 'paragraph' && first.children && first.children[0];
  return !!t0 && t0.type === 'text' && MARKER.test(t0.value);
};

/** Pass 2: the callouts. */
export const callouts = {
  name: 'bk-callouts',
  blockquote(node, ctx) {
    // a callout inside a callout is built by the outer one (nest)
    for (let p = ctx.parent(node); p; p = ctx.parent(p)) {
      if (p.type === 'blockquote' && isCallout(p)) return;
    }
    const built = build(clone(node.children), ctx, node);
    if (built) ctx.replaceNode(node, built); // else an ordinary quotation stays a <blockquote>
  },
};

export default [marks, callouts];
