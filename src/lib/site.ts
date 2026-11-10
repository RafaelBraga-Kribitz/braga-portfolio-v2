// Site identity. One source for the shell, the footer, the Impressum and
// the <head>: the note website_vault/Site/Identity.md (owner, 10 Nov 2026;
// src/lib/vault/copy.mjs). Change the name, the role, the place or a
// profile link there, never here. Links that are empty are omitted by the
// templates (never invent a LinkedIn or Kaggle URL: handoff profile.yaml,
// COPY-01).
//
// `url` is the origin only (the same value as `site` in astro.config.mjs):
// the custom domain rafaelbragakribitz.com (public/CNAME, DEPLOY.md). A
// project-page deploy adds a base path (SITE_BASE, DEPLOY.md), which
// src/lib/routes.ts puts on every internal URL; never join `url` and a
// path by hand, use absolute() from routes.ts.

import { copyOf } from './vault/copy.mjs';

/** The two built route trees (D-011). The content schema (src/content.config.ts) reads this list. */
export const LANGS = ['en', 'de'] as const;
export type Lang = (typeof LANGS)[number];

export interface Site {
  name: string;
  wordmark: string;
  role: Record<Lang, string>;
  email: string;
  location: Record<Lang, string>;
  address: string;
  url: string;
  github: string;
  linkedin: string;
  kaggle: string;
  tableau: string;
}

/** Site/Identity.md read as the Site record (the origin is deployment, not copy: it stays here). */
function identity(): Site {
  const c = copyOf('Identity');
  return {
    name: c.name,
    wordmark: c.wordmark,
    role: { en: c.role_en, de: c.role_de },
    email: c.email,
    location: { en: c.location_en, de: c.location_de },
    address: c.address,
    url: 'https://rafaelbragakribitz.com',
    github: c.github ?? '',
    linkedin: c.linkedin ?? '',
    kaggle: c.kaggle ?? '',
    tableau: c.tableau ?? '',
  };
}

const KEYS = ['name', 'wordmark', 'role', 'email', 'location', 'address', 'url', 'github', 'linkedin', 'kaggle', 'tableau'] as const;

/** Read on every access, so `npm run dev` shows an edit made in Obsidian without a restart. */
export const site = Object.defineProperties({}, Object.fromEntries(KEYS.map((k) => [k, { enumerable: true, get: () => identity()[k] }]))) as Site;
