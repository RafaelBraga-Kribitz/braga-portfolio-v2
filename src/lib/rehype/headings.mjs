// src/lib/rehype/headings.mjs — stable ids on h2 and h3 in the Sätteri hast
// phase: the GitHub slug of the heading text (the same github-slugger Astro's
// own heading pass uses, so the ids it reports in render().headings are
// these). An id the author wrote is kept. Astro's pass still runs afterwards
// for h1–h6 and the headings list; this one guarantees the h2/h3 contract
// (the contents rail links) independently of it.
import GithubSlugger from 'github-slugger';

export default function headings() {
  const slugger = new GithubSlugger();
  return {
    name: 'bk-heading-ids',
    element: {
      filter: ['h2', 'h3'],
      visit(node, ctx) {
        if (node.properties && typeof node.properties.id === 'string' && node.properties.id) return;
        ctx.setProperty(node, 'id', slugger.slug(ctx.textContent(node)));
      },
    },
  };
}
