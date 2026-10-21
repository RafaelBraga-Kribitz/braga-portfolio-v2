// src/lib/rehype/tables.mjs — tables in the Sätteri hast phase.
// 1. Alignment: the processor writes GFM column alignment as an inline
//    style (text-align), which the design system forbids; it becomes the
//    align attribute the stylesheet reads (th[align="right"] → mono, right).
// 2. Every <table> is wrapped in <div class="table-scroll"> so a wide table
//    scrolls inside its wrapper and only there (gate G-06).
// Two passes: the cells first, the wrapper second.
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

export const tableScroll = {
  name: 'bk-table-scroll',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      const parent = ctx.parent(node);
      const classes = parent && parent.type === 'element' && parent.properties ? parent.properties.className : undefined;
      if (Array.isArray(classes) && classes.includes('table-scroll')) return; // already wrapped (hand-written HTML)
      ctx.wrapNode(node, { type: 'element', tagName: 'div', properties: { className: ['table-scroll'] }, children: [] });
    },
  },
};

export default [cellAlign, tableScroll];
