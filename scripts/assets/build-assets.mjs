#!/usr/bin/env node
// ============================================================
// scripts/assets/build-assets.mjs — the generated images (HANDOFF 24,
// AUDIT A-28 / P-10). Type only: no drawn mark anywhere.
//
//   npm run assets
//
// Renders, with Playwright's Chromium and the project's own faces and
// tokens (public/fonts/, design-system/tokens.css, light theme):
//
//   public/favicon-32.png    the letter B in BKribitz 800, ink on the
//   public/favicon-180.png   surface colour, square (32 · 180 touch icon)
//   public/share-card.png    1200 × 630, the P-10 template as a site card:
//                            wordmark and kicker; the name with the 7px
//                            accent square, the role, one line; a hairline
//                            under the head, an ink rule over the foot
//
// Base.astro links the two icons and names the card in og:image /
// twitter:image. Run it after a change to the faces, the tokens, the
// name, the role or the line; commit the PNGs. Nothing is fetched from the
// network: every request the page makes is answered from this repository.
//
// Options: --out <dir> (default public/), --chromium <path> (default
// $ASSETS_CHROMIUM, else /opt/pw-browsers/chromium when it exists, else
// Playwright's own browser).
// ============================================================
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, extname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const { chromium } = await import(pathToFileURL(join(ROOT, 'node_modules/playwright/index.mjs')).href);
// site identity (name, wordmark, role, location): the same module the pages read
const { site } = await import(pathToFileURL(join(ROOT, 'src/lib/site.ts')).href);

const argv = process.argv.slice(2);
const val = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const OUT = resolve(val('--out', join(ROOT, 'public')));
const CHROMIUM = val('--chromium', process.env.ASSETS_CHROMIUM || '/opt/pw-browsers/chromium');

// Copy that is not in site.ts (src/lib/i18n.ts and the home page cannot be
// imported outside Vite). Sources, verbatim:
const COPY = {
  kicker: '00 / Portfolio',                                      // i18n.ts 'cover.kicker' (en)
  line: 'Marketing experience, translated into analytical work.', // src/pages/[lang]/index.astro, copy.en.lead, first sentence
  evidence: 'Evidence before claims',                             // i18n.ts 'cover.evidence' (en)
};

const ORIGIN = 'http://assets.local';
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2' };

/** @param {string} s */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** A page of the light theme with the tokens and the faces; `body` is the markup, `css` its rules. */
const page = (css, body) => `<!doctype html>
<html lang="en" data-theme="light">
<head><meta charset="utf-8"><link rel="stylesheet" href="/tokens.css">
<style>
  html, body { margin: 0; padding: 0; background: var(--surface); color: var(--ink); }
  * { box-sizing: border-box; }
  ${css}
</style></head>
<body>${body}</body>
</html>`;

const favicon = (size, fontSize, tracking) => page(`
  .icon { width: ${size}px; height: ${size}px; display: grid; place-items: center; background: var(--surface); color: var(--ink);
    font: var(--w-wordmark) ${fontSize}px / 1 var(--font-display); letter-spacing: ${tracking}; }
`, `<div class="icon">B</div>`);

// The P-10 template at 1200 × 630 (1cqw = 12px in the specimen): inset
// 60 / 60 / 54, three rows. Wordmark 800 with D-009a tracking; mono labels
// 18px, 0.08em, upper case, ink-2; the role at 91px (7.6cqw), 700, −0.03em,
// balanced over two lines inside 82% of the width; the 7px accent square.
const card = page(`
  .card { position: relative; width: 1200px; height: 630px; overflow: hidden; background: var(--surface); }
  .frame { position: absolute; inset: 60px 60px 54px; display: grid; grid-template-rows: auto 1fr auto; }
  .head { display: flex; justify-content: space-between; align-items: baseline; gap: 24px;
    padding-bottom: 18px; border-bottom: 1px solid var(--mid); }
  .mark { font: var(--w-wordmark) 38px / 1 var(--font-display); letter-spacing: -0.07em; text-transform: uppercase; color: var(--ink); }
  .mono { font: 400 18px / 1.2 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-2);
    font-variant-numeric: var(--num); }
  .body { align-self: center; min-width: 0; }
  .name { display: flex; align-items: center; gap: 14px; color: var(--ink); }
  .name::before { content: ""; width: 7px; height: 7px; background: var(--accent-01); flex: none; }
  .role { margin: 24px 0 0; max-width: 82%; font: var(--w-display) 91px / 1.02 var(--font-display); letter-spacing: -0.03em;
    text-wrap: balance; color: var(--ink); }
  .line { margin: 36px 0 0; font: 400 30px / 1.3 var(--font-body); color: var(--ink-2); }
  .foot { display: flex; justify-content: space-between; gap: 24px; border-top: 1px solid var(--ink); padding-top: 18px; }
`, `<div class="card"><div class="frame">
  <div class="head"><span class="mark">${esc(site.wordmark)}</span><span class="mono">${esc(COPY.kicker)}</span></div>
  <div class="body">
    <div class="mono name">${esc(site.name)}</div>
    <div class="role">${esc(site.role.en)}</div>
    <p class="line">${esc(COPY.line)}</p>
  </div>
  <div class="foot mono"><span>${esc(COPY.evidence)}</span><span>${esc(site.location.en)}</span></div>
</div></div>`);

const JOBS = [
  { file: 'favicon-32.png', width: 32, height: 32, html: favicon(32, 26, '0') },
  { file: 'favicon-180.png', width: 180, height: 180, html: favicon(180, 148, '-0.02em') },
  { file: 'share-card.png', width: 1200, height: 630, html: card },
];

/** Answers the page's requests from the repository: the page itself, tokens.css, /fonts/*. */
function fileFor(pathname, jobs) {
  if (pathname === '/tokens.css') return { body: readFileSync(join(ROOT, 'design-system/tokens.css')), type: TYPES['.css'] };
  if (pathname.startsWith('/fonts/')) {
    const p = join(ROOT, 'public/fonts', basename(pathname));
    if (existsSync(p)) return { body: readFileSync(p), type: TYPES[extname(p)] || 'application/octet-stream' };
  }
  const job = jobs.find((j) => `/${j.file}.html` === pathname);
  if (job) return { body: job.html, type: TYPES['.html'] };
  return null;
}

mkdirSync(OUT, { recursive: true });
const launch = { headless: true };
if (CHROMIUM && existsSync(CHROMIUM)) launch.executablePath = CHROMIUM;
const browser = await chromium.launch(launch);
try {
  const context = await browser.newContext({ deviceScaleFactor: 1, colorScheme: 'light' });
  await context.route('**/*', (route) => {
    const u = new URL(route.request().url());
    const hit = u.origin === ORIGIN ? fileFor(u.pathname, JOBS) : null;
    if (!hit) return route.abort('blockedbyclient');
    return route.fulfill({ status: 200, contentType: hit.type, body: hit.body });
  });
  for (const job of JOBS) {
    const tab = await context.newPage();
    await tab.setViewportSize({ width: job.width, height: job.height });
    await tab.goto(`${ORIGIN}/${job.file}.html`, { waitUntil: 'load' });
    await tab.evaluate(() => document.fonts.ready);
    const faces = await tab.evaluate(() => ({
      display: document.fonts.check('800 26px BKribitz'),
      mono: document.fonts.check('400 18px "BKribitz Mono"'),
    }));
    if (!faces.display || (job.file === 'share-card.png' && !faces.mono)) {
      throw new Error(`${job.file}: the project faces did not load (${JSON.stringify(faces)})`);
    }
    const out = join(OUT, job.file);
    await tab.screenshot({ path: out, clip: { x: 0, y: 0, width: job.width, height: job.height } });
    console.log(`assets · ${out} · ${job.width}×${job.height}`);
    await tab.close();
  }
} finally {
  await browser.close();
}
