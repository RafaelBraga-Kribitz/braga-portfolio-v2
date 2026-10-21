// Site identity. One source for the shell, the footer, the Impressum and
// the <head>. Links that are empty strings are omitted by the templates
// (never invent a LinkedIn or Kaggle URL: handoff profile.yaml, COPY-01).
//
// `url` is the origin only (the same value as `site` in astro.config.mjs):
// the GitHub Pages user site of the account RafaelBraga-Kribitz. A
// project-page deploy adds a base path (SITE_BASE, DEPLOY.md), which
// src/lib/routes.ts puts on every internal URL; never join `url` and a
// path by hand, use absolute() from routes.ts.

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
}

export const site: Site = {
  name: 'Rafael Braga-Kribitz',
  wordmark: 'BRAGA',
  role: { en: 'Marketing Data Analyst', de: 'Marketing Data Analyst' },
  email: 'rafaelbragakribitz@gmail.com',
  location: { en: 'Greater Graz, Austria', de: 'Großraum Graz, Österreich' },
  address: '8054 Seiersberg, Styria, Austria',
  url: 'https://rafaelbraga-kribitz.github.io',
  github: 'https://github.com/RafaelBraga-Kribitz',
  linkedin: '',
  kaggle: '',
};
