// src/lib/remark/buildlog.mjs — the ```buildlog fence (owner, 26 Oct 2026;
// Sätteri mdast phase, after diagrams.mjs): in a project note, an empty
// fence becomes the project's build log, drawn from src/data/activity.json
// by src/lib/activity/render.mjs. The note's frontmatter gives the slug,
// the language and the code; a note without data loses the fence and the
// build reports it (npm run activity fetches the data).
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderBuildLog } from '../activity/render.mjs';

const DATA = fileURLToPath(new URL('../../data/activity.json', import.meta.url));
let cache;
const activity = () => (cache ??= existsSync(DATA) ? JSON.parse(readFileSync(DATA, 'utf8')) : { projects: {} });

export const buildlog = {
  name: 'bk-buildlog',
  code(node, ctx) {
    if (typeof node.lang !== 'string' || node.lang.toLowerCase() !== 'buildlog') return;
    const fm = (ctx.data.astro && ctx.data.astro.frontmatter) || {};
    const data = activity();
    const p = data.projects[fm.slug];
    if (!p) {
      ctx.report({ message: `buildlog: no activity data for "${fm.slug}" (run npm run activity)`, node, severity: 'warning' });
      ctx.removeNode(node);
      return;
    }
    const html = renderBuildLog(p, { lang: fm.lang === 'de' ? 'de' : 'en', code: String(fm.code ?? ''), generated: data.generated });
    ctx.replaceNode(node, { raw: html, mdxExpressions: false });
  },
};

export default buildlog;
