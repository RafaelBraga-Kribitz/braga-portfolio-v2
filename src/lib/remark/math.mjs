// src/lib/remark/math.mjs — the inline-math guard for the mdast phase.
// Sätteri's math feature pairs any two single dollars, so "$5 and $6" would
// become math. Pandoc's rule keeps prices out of it: the opening $ must be
// followed by a non-space, the closing $ preceded by a non-space and not
// followed by a digit. An inline-math node that breaks the rule goes back to
// literal text (the regression case of Templates §04: two $ in ordinary
// prose are never paired).
export const mathGuard = {
  name: 'bk-math-guard',
  inlineMath(node, ctx) {
    const v = node.value;
    const parent = ctx.parent(node);
    const i = ctx.indexOf(node);
    const next = parent && typeof i === 'number' ? parent.children[i + 1] : undefined;
    const nextChar = next && next.type === 'text' ? next.value.charAt(0) : '';
    const literal = v.length === 0 || /^\s/.test(v) || /\s$/.test(v) || /^\d/.test(nextChar);
    if (literal) ctx.replaceNode(node, { type: 'text', value: `$${v}$` });
  },
};

export default mathGuard;
