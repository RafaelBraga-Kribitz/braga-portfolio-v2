// src/lib/remark/task-lists.mjs — GFM task lists are not part of the
// authoring vocabulary (Sätteri mdast phase).
//
// Sätteri's GFM switch turns task lists on with tables and strikethrough,
// and has no separate toggle. A `- [ ] item` would reach the page as an
// unlabelled, disabled 13 × 13 checkbox: axe "label" (critical) and a
// target under 24 / 44px (gate G-05). The design system has no checkbox
// and no glyph for one (D-030), so a task list fails the build, naming the
// file; write a plain list and state the status in words.

export const taskLists = {
  name: 'bk-task-lists',
  /** @param {any} node @param {any} ctx */
  listItem(node, ctx) {
    if (typeof node.checked !== 'boolean') return;
    const where = ctx.fileURL ? ctx.fileURL.pathname : 'markdown';
    throw new Error(`task list in ${where}: "- [ ]" / "- [x]" items are not supported (no checkbox in the design system); write a plain list and state the status in words (src/content/README.md §4).`);
  },
};

export default taskLists;
