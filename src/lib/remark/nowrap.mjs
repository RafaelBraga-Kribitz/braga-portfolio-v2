// Keep short site references and decimal intervals together in running
// prose. The narrow grammar deliberately excludes years and ISO dates.
// Markdown code/math are leaf nodes; links and raw HTML are untouched.
const MATCH = /(?:[a-z][a-z\d+.-]*:\/\/|www\.)[^\s<>]+|(?<![\p{L}\p{N}_./:#-])(?:0[1-4]-\d{2}(?:-\d{3})?|\d+[.,]\d+–\d+[.,]\d+)(?![\p{L}\p{N}_/:#-]|\.[\p{L}\p{N}_])/giu;

export default {
  name: 'bk-nowrap-references',
  text(node, ctx) {
    let ancestor = ctx.parent(node);
    let prose = false;
    while (ancestor) {
      if (['link', 'linkReference', 'heading', 'html'].includes(ancestor.type)) return;
      if (['paragraph', 'tableCell'].includes(ancestor.type)) prose = true;
      ancestor = ctx.parent(ancestor);
    }
    if (!prose) return;
    const value = node.value;
    const parts = [];
    let last = 0;
    for (const match of value.matchAll(MATCH)) {
      if (match[0].length > 20 || /^(?:[a-z][a-z\d+.-]*:\/\/|www\.)/i.test(match[0])) continue;
      if (match.index > last) parts.push({ type: 'text', value: value.slice(last, match.index) });
      parts.push({ type: 'nowrapReference', data: { hName: 'span', hProperties: { className: ['text-nowrap'] } }, children: [{ type: 'text', value: match[0] }] });
      last = match.index + match[0].length;
    }
    if (!parts.length) return;
    if (last < value.length) parts.push({ type: 'text', value: value.slice(last) });
    ctx.replaceNode(node, parts);
  },
};
