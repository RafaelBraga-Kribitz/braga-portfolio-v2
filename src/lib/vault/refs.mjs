// src/lib/vault/refs.mjs — the vault files a note uses: ![[embeds]],
// [[links]] to files, Markdown images and the `cover` property. The build
// copies only the files that published notes use (src/integrations/
// vault-media.mjs), so an attachment of a private note never leaves the
// vault; `npm run vault:check` reports the ones that do not resolve.
import { proseOnly } from './meta.mjs';
import { resolveAttachment, mediaKind } from './index.mjs';

/** Every file reference in a note, as written: [{ target, kind: 'embed'|'link'|'image'|'cover' }]. */
export function fileRefs(note) {
  const out = [];
  const body = proseOnly(note.body);
  for (const m of body.matchAll(/(!?)\[\[([^\]|#^]+)(?:[#^][^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
    const target = m[2].trim();
    if (m[1] || mediaKind(target)) out.push({ target, kind: m[1] ? 'embed' : 'link' });
  }
  for (const m of body.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    if (!/^https?:/i.test(m[1])) out.push({ target: decodeURIComponent(m[1]), kind: 'image' });
  }
  if (typeof note.data.cover === 'string') out.push({ target: note.data.cover.replace(/^\[\[|\]\]$/g, ''), kind: 'cover' });
  return out;
}

/** The attachments that published notes use, de-duplicated. */
export function usedAttachments(index) {
  const used = new Map();
  for (const note of index.notes.filter((n) => n.live)) {
    for (const ref of fileRefs(note)) {
      const att = resolveAttachment(index, ref.target);
      if (att) used.set(att.rel, att);
    }
  }
  return [...used.values()];
}
