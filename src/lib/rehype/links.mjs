// src/lib/rehype/links.mjs — the base path on root-relative links, in the
// Sätteri hast phase (DEPLOY.md).
//
// Authors write site links root-relative: [Read](/en/writing/…/). When the
// site is built for a project page (SITE_BASE=/<repo>/), every href that
// starts with a single "/" gets the base: /en/… → /<repo>/en/…. Links with
// a scheme (https:, mailto:), protocol-relative links (//host) and
// fragments (#id) are left alone, and so is a link that already carries the
// base. With the default base "/" the factory returns null and the plugin is
// not in the pipeline at all.
//
//   links({ base: '/braga-portfolio/' })   → a hast plugin
//   links({ base: '/' })                   → null (nothing to do)

/** @param {{ base?: string }} [options] */
export default function links(options = {}) {
  const prefix = (options.base ?? '/').replace(/\/+$/, ''); // '' or '/repo'
  if (!prefix) return null;
  return {
    name: 'bk-base-links',
    element: {
      // links, and the sources of vault media (img, video, audio, source)
      filter: ['a', 'img', 'video', 'audio', 'source'],
      visit(node, ctx) {
        const attr = node.tagName === 'a' ? 'href' : 'src';
        const href = node.properties && node.properties[attr];
        if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return;
        if (href === prefix || href.startsWith(`${prefix}/`)) return;
        ctx.setProperty(node, attr, prefix + href);
      },
    },
  };
}
