// src/lib/remark/obsidian.mjs — Obsidian's Markdown on the site (owner,
// 23 Oct 2026). A Sätteri mdast pass that runs first, so the passes after
// it (callouts, bars) see ordinary links and nodes. The syntax reference
// is vault/_guide/Syntax reference.md.
//
//   # Title                the note's first H1 is its title: the page
//                          template sets it as the page's h1, so it is
//                          taken out of the body. Later "# " headings
//                          become h2, and a skipped level (## then ####)
//                          is closed up, so the outline never has a gap.
//   [[Note]] [[Note|text]] a link to the note's page (same language
//   [[Note#Heading]]       first); to a heading's anchor; [[#Heading]] on
//                          this page. A note that is not published reads
//                          as plain text: a private note never leaks.
//   ![[photo.png]]         an image (figure + caption, width "|300");
//   ![[a.png]] ![[b.png]]  two or more in one paragraph: a gallery;
//   ![[clip.mp4]]          video, audio (self-hosted, from the vault);
//   ![[file.pdf]]          a file card; ![[Note]] a card for that note.
//   ![alt](x.png "cap")    Markdown images resolve against the vault too.
//   YouTube / Vimeo URL    alone in a paragraph: a video card that links
//                          out (no third-party request, gate G-13).
//   #tag                   a link to the tag's page; #status/… and #draft
//                          are properties, not text, and are taken out.
//   %% comment %%          never published.  ^block-id  dropped.
//   key:: value            Dataview fields: a line of them is taken out
//   [key:: value]          (they are data), in a sentence the value stays.
//   - [ ] / [x] / [/] / [-] tasks: to do □, done ■, in progress ▤,
//                          cancelled (struck through), drawn by CSS, the
//                          state in words for screen readers; no checkbox.
import { fileURLToPath } from 'node:url';
import { slug as headingSlug } from 'github-slugger';
import { vaultIndex, noteForFile, resolveNote, resolveAttachment, mediaKind, mediaPath } from '../vault/index.mjs';
import { imageSize } from '../vault/image-size.mjs';

const el = (tag, props, children = []) => ({
  type: `bk-${tag}`,
  data: { hName: tag, ...(props && Object.keys(props).length ? { hProperties: props } : {}) },
  children,
});
const text = (value) => ({ type: 'text', value });

const WORDS = {
  en: { done: 'Done', open: 'To do', doing: 'In progress', cancelled: 'Cancelled', video: 'Video', audio: 'Audio', file: 'File', watch: 'Watch on', image: 'Image' },
  de: { done: 'Erledigt', open: 'Offen', doing: 'In Arbeit', cancelled: 'Abgebrochen', video: 'Video', audio: 'Audio', file: 'Datei', watch: 'Ansehen auf', image: 'Bild' },
};

const WIKI = /(!?)\[\[([^\]|#^]*)((?:#\^?)[^\]|]*)?(?:\|([^\]]*))?\]\]/g;
const TAG = /(^|[\s(])#([\p{L}\p{N}_/-]*[\p{L}_][\p{L}\p{N}_/-]*)/gu;
const VIDEO_HOST = /^https?:\/\/(?:www\.|m\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com|vimeo\.com)\//i;

/** Per-document state: the note, its language, the vault. */
function docOf(ctx) {
  if (ctx.data.bkObsidian) return ctx.data.bkObsidian;
  const index = vaultIndex();
  const abs = ctx.fileURL ? fileURLToPath(ctx.fileURL) : undefined;
  const note = abs ? noteForFile(index, abs) : undefined;
  const fm = ctx.data.astro && ctx.data.astro.frontmatter;
  const lang = note?.place?.lang ?? (fm && fm.lang === 'de' ? 'de' : 'en');
  const state = { index, note, lang, w: WORDS[lang] ?? WORDS.en, h1Seen: false, lastDepth: 1 };
  ctx.data.bkObsidian = state;
  return state;
}

/** A [[link]] → an mdast link, or plain text when the target is not on the site. */
function wikiLink(doc, target, sub, alias) {
  const heading = sub && !sub.startsWith('#^') ? sub.slice(1) : undefined;
  if (!target) {
    // [[#Heading]]: this page
    return heading ? { type: 'link', url: `#${headingSlug(heading)}`, children: [text(alias ?? heading)] } : text(alias ?? '');
  }
  const att = resolveAttachment(doc.index, target);
  if (att) return { type: 'link', url: mediaPath(att), children: [text(alias ?? target)] };
  const note = resolveNote(doc.index, target, doc.note);
  const label = alias ?? (heading ? `${note?.data.title ?? target} · ${heading}` : note?.data.title ?? target);
  if (!note || !note.live || !note.url) return text(label);
  return { type: 'link', url: note.url + (heading ? `#${headingSlug(heading)}` : ''), children: [text(label)] };
}

/** One embed as a block: figure (image, video, audio), a file card, a note card. */
function embedBlock(doc, target, sub, opt) {
  const att = resolveAttachment(doc.index, target);
  if (att) {
    const src = mediaPath(att);
    const width = /^\d+$/.test(opt ?? '') ? Number(opt) : undefined;
    const caption = opt && !width ? opt : undefined;
    const cap = caption ? [el('figcaption', { className: ['label'] }, [text(caption)])] : [];
    if (att.kind === 'image') {
      const size = imageSize(att.abs);
      const img = el('img', { src, alt: caption ?? '', loading: 'lazy', decoding: 'async', ...(size ?? {}) });
      return el('figure', { className: ['media'], ...(width ? { dataSize: width <= 320 ? 's' : width <= 560 ? 'm' : 'l' } : {}) }, [img, ...cap]);
    }
    if (att.kind === 'video') return el('figure', { className: ['media'] }, [el('video', { src, controls: true, preload: 'metadata', playsInline: true }, []), ...cap]);
    if (att.kind === 'audio') return el('figure', { className: ['media', 'media-audio'] }, [el('audio', { src, controls: true, preload: 'metadata' }, []), ...cap]);
    const name = att.rel.split('/').pop();
    return fileCard(src, caption ?? name, `${doc.w.file} · ${name.split('.').pop().toUpperCase()}`);
  }
  const note = resolveNote(doc.index, target, doc.note);
  if (note && note.live && note.url) {
    const heading = sub && !sub.startsWith('#^') ? sub.slice(1) : undefined;
    return el('div', { className: ['callout'], dataCallout: 'bookmark' }, [
      el('div', { className: ['callout-content'] }, [
        el('a', { href: note.url + (heading ? `#${headingSlug(heading)}` : '') }, [
          el('b', {}, [text(note.data.title + (heading ? ` · ${heading}` : ''))]),
          ...(note.data.summary ? [el('span', { className: ['sub'] }, [text(note.data.summary)])] : []),
          el('span', { className: ['glyph'], ariaHidden: 'true' }, [text('→')]),
        ]),
      ]),
    ]);
  }
  return null; // missing or private: nothing on the page (npm run vault:check names it)
}

const fileCard = (href, title, sub) => el('div', { className: ['callout'], dataCallout: 'bookmark' }, [
  el('div', { className: ['callout-content'] }, [
    el('a', { href }, [el('b', {}, [text(title)]), el('span', { className: ['sub'] }, [text(sub)]), el('span', { className: ['glyph'], ariaHidden: 'true' }, [text('↗')])]),
  ]),
]);

/** A video on YouTube or Vimeo: a card that links out (no embed, no request to the host until the reader clicks). */
function videoCard(doc, url, title) {
  const host = /vimeo/i.test(url) ? 'Vimeo' : 'YouTube';
  return fileCard(url, title && title !== url ? title : `${doc.w.video} · ${host}`, `${doc.w.watch} ${host}`);
}

/** Splits one text value into text, links and tag links. */
function inline(doc, value) {
  let s = value
    .replace(/%%[\s\S]*?%%/g, '')
    .replace(/\s\^[A-Za-z0-9-]+\s*$/, '')
    .replace(/\[([\p{L}\p{N}_ -]+)::[ \t]*([^\]]*)\]/gu, '$2');
  const out = [];
  let last = 0;
  const push = (t) => { if (t) out.push(text(t)); };
  // wikilinks and embeds first, then tags in the text between them
  const pieces = [];
  for (const m of s.matchAll(WIKI)) {
    pieces.push({ at: m.index, len: m[0].length, node: m[1] ? inlineEmbed(doc, m) : wikiLink(doc, m[2].trim(), m[3], m[4]) });
  }
  const tagged = (chunk) => {
    let i = 0;
    const res = [];
    for (const m of chunk.matchAll(TAG)) {
      const start = m.index + m[1].length;
      res.push(text(chunk.slice(i, start)));
      const tag = m[2].toLowerCase();
      if (!tag.startsWith('status/') && tag !== 'draft') {
        res.push({ type: 'link', url: `/${doc.lang}/tags/${tag.split('/').map(encodeURIComponent).join('/')}/`, data: { hProperties: { className: ['tag'] } }, children: [text(`#${m[2]}`)] });
      }
      i = m.index + m[0].length;
    }
    res.push(text(chunk.slice(i)));
    return res.filter((n) => n.type !== 'text' || n.value);
  };
  for (const p of pieces) {
    out.push(...tagged(s.slice(last, p.at)));
    if (p.node) out.push(p.node);
    last = p.at + p.len;
  }
  out.push(...tagged(s.slice(last)));
  return out.length ? out : [];
}

/** An embed inside a sentence: a plain link to the file or the note. */
function inlineEmbed(doc, m) {
  const att = resolveAttachment(doc.index, m[2].trim());
  if (att) return { type: 'link', url: mediaPath(att), children: [text(m[4] && !/^\d+$/.test(m[4]) ? m[4] : m[2].trim())] };
  return wikiLink(doc, m[2].trim(), m[3], m[4]);
}

const EMBEDS_ONLY = /^(?:\s*!\[\[[^\]]+\]\]\s*)+$/;
const FIELDS_ONLY = /^(?:[\p{L}\p{N}_ -]+::[^\n]*(?:\n|$))+$/u;

export const obsidian = {
  name: 'bk-obsidian',

  heading(node, ctx) {
    const doc = docOf(ctx);
    const parent = ctx.parent(node);
    if (node.depth === 1 && !doc.h1Seen && parent && parent.type === 'root') {
      // the first H1 is the title, set by the page template
      const before = parent.children.slice(0, ctx.indexOf(node)).filter((n) => n.type !== 'yaml' && n.type !== 'toml');
      if (before.length === 0) { doc.h1Seen = true; ctx.removeNode(node); return; }
    }
    // one h1 per page, and no skipped level
    const depth = Math.max(2, Math.min(node.depth, doc.lastDepth + 1));
    doc.lastDepth = depth;
    if (depth !== node.depth) ctx.setProperty(node, 'depth', depth);
  },

  paragraph(node, ctx) {
    const doc = docOf(ctx);
    const plain = ctx.textContent(node).trim();
    // a paragraph of %% comment %%, or of Dataview fields only: data, not text
    if (/^%%[\s\S]*%%$/.test(plain) || (FIELDS_ONLY.test(plain) && node.children.every((c) => c.type === 'text' || c.type === 'break'))) {
      ctx.removeNode(node);
      return;
    }
    // embeds alone in a paragraph: figures, a gallery, cards
    if (node.children.every((c) => c.type === 'text' || c.type === 'break') && EMBEDS_ONLY.test(plain)) {
      const blocks = [];
      const images = [];
      for (const m of plain.matchAll(WIKI)) {
        const block = embedBlock(doc, m[2].trim(), m[3], m[4]);
        if (!block) continue;
        if (block.data.hName === 'figure' && block.children[0]?.data?.hName === 'img') images.push(block);
        else blocks.push(block);
      }
      const out = images.length > 1
        ? [el('figure', { className: ['media-gallery'], dataCount: String(Math.min(images.length, 3)) }, images.map((f) => el('div', { className: ['media-cell'] }, f.children))), ...blocks]
        : [...images, ...blocks];
      ctx.replaceNode(node, out);
      return;
    }
    // a YouTube or Vimeo link alone in a paragraph: a video card
    if (node.children.length === 1 && node.children[0].type === 'link' && VIDEO_HOST.test(node.children[0].url)) {
      ctx.replaceNode(node, videoCard(doc, node.children[0].url, ctx.textContent(node.children[0])));
      return;
    }
    // a Markdown image alone in a paragraph: a figure, its title the caption
    if (node.children.length === 1 && node.children[0].type === 'image') {
      const img = node.children[0];
      const block = markdownImage(doc, img);
      if (block) ctx.replaceNode(node, block);
    }
  },

  image(node, ctx) {
    // a Markdown image inside a sentence: point it at the vault file, or
    // make a remote one a link (no third-party request, gate G-13)
    const doc = docOf(ctx);
    if (/^https?:/i.test(node.url)) {
      ctx.replaceNode(node, { type: 'link', url: node.url, children: [text(node.alt || doc.w.image)] });
      return;
    }
    const att = resolveAttachment(doc.index, node.url);
    if (att) ctx.setProperty(node, 'url', mediaPath(att));
  },

  text(node, ctx) {
    if (!/\[\[|#|%%|\^|::/.test(node.value)) return;
    const parent = ctx.parent(node);
    if (parent && (parent.type === 'link' || parent.type === 'linkReference')) return;
    const doc = docOf(ctx);
    const nodes = inline(doc, node.value);
    if (nodes.length === 1 && nodes[0].type === 'text' && nodes[0].value === node.value) return;
    ctx.replaceNode(node, nodes);
  },

  listItem(node, ctx) {
    const doc = docOf(ctx);
    let state = typeof node.checked === 'boolean' ? (node.checked ? 'done' : 'open') : undefined;
    // Obsidian's extra states arrive as text: "[/] …" in progress, "[-] …" cancelled
    const first = node.children[0];
    const t0 = first && first.type === 'paragraph' && first.children[0];
    if (!state && t0 && t0.type === 'text') {
      const m = /^\[([/\-xX ])\]\s+/.exec(t0.value);
      if (m) {
        state = { '/': 'doing', '-': 'cancelled', x: 'done', X: 'done', ' ': 'open' }[m[1]];
        ctx.setProperty(t0, 'value', t0.value.slice(m[0].length));
      }
    }
    if (!state) return;
    ctx.setProperty(node, 'checked', null);
    ctx.setProperty(node, 'data', { hProperties: { className: ['task'], dataTask: state } });
    if (first && first.type === 'paragraph') {
      ctx.prependChild(first, el('span', { className: ['sr-only'] }, [text(`${doc.w[state]}: `)]));
    }
  },
};

/** A Markdown image as a figure: the vault file, its size, the title as caption. */
function markdownImage(doc, img) {
  if (/^https?:/i.test(img.url)) return { type: 'paragraph', children: [{ type: 'link', url: img.url, children: [text(img.alt || doc.w.image)] }] };
  const att = resolveAttachment(doc.index, img.url);
  if (!att) return null;
  const size = att.kind === 'image' ? imageSize(att.abs) : undefined;
  return el('figure', { className: ['media'] }, [
    el('img', { src: mediaPath(att), alt: img.alt ?? '', loading: 'lazy', decoding: 'async', ...(size ?? {}) }),
    ...(img.title ? [el('figcaption', { className: ['label'] }, [text(img.title)])] : []),
  ]);
}

export default obsidian;
