// src/lib/remark/code-lang.mjs — fence languages, checked before the
// highlighter (Sätteri mdast phase).
//
// Astro's Prism wrapper returns the code UNESCAPED when Prism has no grammar
// for the fence's language (```foo), so its text would be parsed as HTML: a
// "<script>" inside the fence would become a script element. This pass sends
// a language Prism cannot load to `text` (Prism's plain grammar escapes
// everything) and keeps the authored name for the code bar in the document
// data bag (read by src/lib/rehype/code.mjs). A known language written in
// capitals (```Python) is lower-cased, as Prism's registry is. ```math is
// left alone: KaTeX renders it. The fence's content is never touched.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
/** @type {{ languages: Record<string, { alias?: string | string[] }> }} */
const components = require('prismjs/components.json');

/** Data-bag key: Map of fence text → authored language name. */
export const CODE_LABELS = 'bkCodeLabels';

/** Every language id and alias Prism can load, plus its core plain grammars and Astro's own two. */
const KNOWN = new Set(['plain', 'plaintext', 'text', 'txt', 'astro', 'ts']);
for (const [id, def] of Object.entries(components.languages)) {
  if (id === 'meta') continue;
  KNOWN.add(id);
  if (def && def.alias) for (const a of Array.isArray(def.alias) ? def.alias : [def.alias]) KNOWN.add(a);
}

export const codeLang = {
  name: 'bk-code-lang',
  /** @param {any} node @param {any} ctx */
  code(node, ctx) {
    const lang = typeof node.lang === 'string' ? node.lang : '';
    if (!lang) return;
    const key = lang.toLowerCase();
    if (key === 'math') return;
    if (KNOWN.has(key)) {
      if (key !== lang) ctx.setProperty(node, 'lang', key);
      return;
    }
    let labels = ctx.data[CODE_LABELS];
    if (!(labels instanceof Map)) labels = ctx.data[CODE_LABELS] = new Map();
    labels.set(String(node.value ?? ''), key);
    ctx.setProperty(node, 'lang', 'text');
    ctx.report({ message: `code fence language "${lang}" is unknown to Prism: rendered as plain text`, node, severity: 'warning' });
  },
};

export default codeLang;
