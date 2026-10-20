// Site identity. One source for the shell, the footer, the Impressum and
// the <head>. Links that are empty strings are omitted by the templates
// (never invent a LinkedIn or Kaggle URL: handoff profile.yaml, COPY-01).

export type Lang = 'en' | 'de';
export const LANGS: readonly Lang[] = ['en', 'de'];

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
  url: 'https://rafaelbragakribitz.github.io',
  github: 'https://github.com/RafaelBraga-Kribitz',
  linkedin: '',
  kaggle: '',
};
