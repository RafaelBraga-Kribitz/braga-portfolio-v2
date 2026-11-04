// src/lib/rehype/tables.mjs — tables in the Sätteri hast phase.
// 1. Alignment: the processor writes GFM column alignment as an inline
//    style (text-align), which the design system forbids; it becomes the
//    align attribute the stylesheet reads (th[align="right"] → mono, right).
// 2. Every <table> is wrapped in <div class="table-scroll" tabindex="0"> so
//    a wide table scrolls inside its wrapper and only there (gate G-06);
//    tabindex="0" keeps that scroll region reachable by keyboard (WCAG
//    2.1.1, axe scrollable-region-focusable), as .math-body does.
// 3. A table of four or more columns also gets data-cue on the wrapper, the
//    scroll cue in the page's language (the same words as an evidence
//    figure's, SCROLL_CUE in remark/callouts.mjs); components.css shows it
//    below 560px, where such a table keeps a minimum column width and so
//    scrolls sideways. A table of one to three columns gets no cue.
// Two passes: the cells first, the wrapper second.
import { SCROLL_CUE } from '../remark/callouts.mjs';
const ALIGN = /text-align\s*:\s*(left|right|center)\s*;?/i;

export const cellAlign = {
  name: 'bk-table-align',
  element: {
    filter: ['th', 'td'],
    visit(node, ctx) {
      const style = node.properties && node.properties.style;
      if (typeof style !== 'string') return;
      const m = ALIGN.exec(style);
      if (m && !node.properties.align) ctx.setProperty(node, 'align', m[1].toLowerCase());
      const rest = style.replace(ALIGN, '').trim();
      ctx.setProperty(node, 'style', rest ? rest : null);
    },
  },
};

/** The cells in the first row of a table (hast), 0 when there is none. @param {any} node */
function columns(node) {
  const row = (n) => {
    if (!n || n.type !== 'element') return null;
    if (n.tagName === 'tr') return n;
    for (const c of n.children || []) { const r = row(c); if (r) return r; }
    return null;
  };
  const tr = row(node);
  return tr ? (tr.children || []).filter((c) => c.type === 'element' && (c.tagName === 'th' || c.tagName === 'td')).length : 0;
}

export const tableScroll = {
  name: 'bk-table-scroll',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      const parent = ctx.parent(node);
      const classes = parent && parent.type === 'element' && parent.properties ? parent.properties.className : undefined;
      if (Array.isArray(classes) && classes.includes('table-scroll')) return; // already wrapped (hand-written HTML)
      const fm = ctx.data && ctx.data.astro && ctx.data.astro.frontmatter;
      const cue = columns(node) >= 4 ? { dataCue: SCROLL_CUE[fm && fm.lang === 'de' ? 'de' : 'en'] } : {};
      ctx.wrapNode(node, { type: 'element', tagName: 'div', properties: { className: ['table-scroll'], tabIndex: 0, ...cue }, children: [] });
    },
  },
};

export default [cellAlign, tableScroll];
