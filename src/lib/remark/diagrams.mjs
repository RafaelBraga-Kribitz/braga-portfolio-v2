// src/lib/remark/diagrams.mjs — two kinds of code fence that are not code
// (owner, 23 Oct 2026; Sätteri mdast phase, after code-lang.mjs):
//
//   ```mermaid    a diagram, drawn at build into inline SVG in the site's
//                 colours (src/lib/vault/mermaid.mjs), in figure.fig
//                 [data-kind="diagram"]; its first %% comment line, or
//                 accTitle, names it for screen readers. If it cannot be
//                 drawn here, the source shows as a code panel instead.
//   ```dataview   a Dataview query run over the published notes
//                 (src/lib/vault/dataview.mjs): LIST → a list of links,
//                 TABLE → a table, styled as every list and table. A query
//                 that does not parse renders nothing and is reported
//                 (npm run vault:check names it with the error).
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { renderMermaid } from '../vault/mermaid.mjs';
import { parseQuery, runQuery, field } from '../vault/dataview.mjs';
import { vaultIndex, noteForFile, resolveNote } from '../vault/index.mjs';
import { date as formatDate } from '../format.mjs';

const text = (value) => ({ type: 'text', value });

const LABEL = {
  en: { diagram: 'Diagram', note: 'Note', empty: 'Nothing matches yet.' },
  de: { diagram: 'Diagramm', note: 'Notiz', empty: 'Noch keine Treffer.' },
};

function langOf(ctx) {
  const index = vaultIndex();
  const note = ctx.fileURL ? noteForFile(index, fileURLToPath(ctx.fileURL)) : undefined;
  const fm = ctx.data.astro && ctx.data.astro.frontmatter;
  return { index, note, lang: note?.place?.lang ?? (fm && fm.lang === 'de' ? 'de' : 'en') };
}

/** A cell value: a note → its link; a date → the page's date form; a list → joined. */
function cell(v, lang) {
  if (v && typeof v === 'object' && !Array.isArray(v) && v.data) return v.url ? [{ type: 'link', url: v.url, children: [text(v.data.title)] }] : [text(v.data.title)];
  if (Array.isArray(v)) return [text(v.join(', '))];
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return [text(formatDate(v, lang))];
  if (v === undefined || v === null) return [text('–')];
  return [text(String(v))];
}

export const diagrams = {
  name: 'bk-diagrams',
  async code(node, ctx) {
    const lang = typeof node.lang === 'string' ? node.lang.toLowerCase() : '';
    if (lang !== 'mermaid' && lang !== 'dataview') return;
    const doc = langOf(ctx);
    const w = LABEL[doc.lang] ?? LABEL.en;

    if (lang === 'mermaid') {
      const code = String(node.value ?? '');
      const id = createHash('sha1').update(code).digest('hex').slice(0, 8);
      const out = await renderMermaid(code, id);
      if (!out.svg) {
        ctx.report({ message: `mermaid: the diagram could not be drawn (${out.error}); its source is shown instead`, node, severity: 'warning' });
        ctx.setProperty(node, 'lang', 'text');
        return;
      }
      const title = (/^\s*accTitle:\s*(.+)$/m.exec(code) ?? /^\s*%%\s*(.+?)\s*$/m.exec(code))?.[1] ?? w.diagram;
      const svg = out.svg.replace(/<svg\b/, `<svg role="img" aria-label="${title.replace(/"/g, '&quot;')}"`);
      ctx.replaceNode(node, { raw: `<figure class="fig" data-kind="diagram" data-width="wide"><div class="diagram" tabindex="0" role="group" aria-label="${title.replace(/"/g, '&quot;')}">${svg}</div></figure>`, mdxExpressions: false });
      return;
    }

    // dataview
    let q;
    try { q = parseQuery(node.value); } catch (e) {
      ctx.report({ message: `dataview: ${e.message}`, node, severity: 'warning' });
      ctx.removeNode(node);
      return;
    }
    const rows = runQuery(q, doc.index.notes, doc.note, (t) => resolveNote(doc.index, t, doc.note));
    if (!rows.length) {
      ctx.replaceNode(node, { type: 'paragraph', children: [{ type: 'emphasis', children: [text(w.empty)] }] });
      return;
    }
    if (q.mode === 'list') {
      const f = q.fields[0];
      ctx.replaceNode(node, {
        type: 'list', ordered: false, spread: false,
        children: rows.map((n) => ({
          type: 'listItem', spread: false,
          children: [{ type: 'paragraph', children: [...cell(n, doc.lang), ...(f ? [text(' · '), ...cell(field(n, f.expr), doc.lang)] : [])] }],
        })),
      });
      return;
    }
    const head = [...(q.withoutId ? [] : [w.note]), ...q.fields.map((f) => f.name)];
    ctx.replaceNode(node, {
      type: 'table',
      align: head.map(() => null),
      children: [
        { type: 'tableRow', children: head.map((h) => ({ type: 'tableCell', children: [text(h)] })) },
        ...rows.map((n) => ({
          type: 'tableRow',
          children: [
            ...(q.withoutId ? [] : [{ type: 'tableCell', children: cell(n, doc.lang) }]),
            ...q.fields.map((f) => ({ type: 'tableCell', children: cell(field(n, f.expr), doc.lang) })),
          ],
        })),
      ],
    });
  },
};

export default diagrams;
