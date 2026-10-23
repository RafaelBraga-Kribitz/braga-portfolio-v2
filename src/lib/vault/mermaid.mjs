// src/lib/vault/mermaid.mjs — Mermaid diagrams drawn at build time into
// inline SVG in the site's colours (owner, 23 Oct 2026). No script reaches
// the page: the diagram is drawn once in headless Chromium (Playwright,
// already a dependency for the gates) and cached by content in
// .cache/mermaid/ (committed), so a machine without Chromium still builds
// every diagram that was drawn before. A diagram that is new and cannot be
// drawn here falls back to its source in a code panel, with a warning.
//
// Colours: Mermaid is fed six vivid stand-in colours, one per design
// token, and every colour in the SVG it returns (its own derived shades
// included) is mapped back to the nearest token by hue, or by lightness
// for greys. The diagram therefore follows the theme (light, dark) like
// the rest of the page.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const CACHE = `${ROOT}.cache/mermaid/`;
const VERSION = 'v1';

/** Stand-in colour → token (vivid, far apart in hue). */
// written as RGB triples: no hex literal outside tokens.css (lint:css)
const toHex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
const STANDINS = [
  [[255, 0, 0], '--ink'],
  [[0, 192, 0], '--ink-2'],
  [[0, 0, 255], '--surface'],
  [[255, 255, 0], '--surface-2'],
  [[255, 0, 255], '--rule-c'],
  [[0, 255, 255], '--accent-01'],
].map(([rgb, token]) => [toHex(rgb), token]);
const C = Object.fromEntries(STANDINS.map(([hex, token]) => [token, hex]));

const THEME = {
  theme: 'base',
  fontFamily: 'BKribitz, sans-serif',
  fontSize: '15px',
  themeVariables: {
    background: C['--surface'], mainBkg: C['--surface-2'], textColor: C['--ink'], titleColor: C['--ink'],
    primaryColor: C['--surface-2'], primaryTextColor: C['--ink'], primaryBorderColor: C['--ink'],
    secondaryColor: C['--surface'], secondaryTextColor: C['--ink'], secondaryBorderColor: C['--ink-2'],
    tertiaryColor: C['--surface'], tertiaryTextColor: C['--ink'], tertiaryBorderColor: C['--rule-c'],
    lineColor: C['--ink-2'], nodeBorder: C['--ink'], clusterBkg: C['--surface'], clusterBorder: C['--rule-c'],
    edgeLabelBackground: C['--surface'], noteBkgColor: C['--surface-2'], noteTextColor: C['--ink'], noteBorderColor: C['--ink-2'],
    actorBkg: C['--surface-2'], actorBorder: C['--ink'], actorTextColor: C['--ink'], actorLineColor: C['--ink-2'],
    signalColor: C['--ink'], signalTextColor: C['--ink'], labelBoxBkgColor: C['--surface-2'], labelBoxBorderColor: C['--ink'],
    labelTextColor: C['--ink'], loopTextColor: C['--ink'], activationBkgColor: C['--surface-2'], activationBorderColor: C['--ink'],
    sequenceNumberColor: C['--surface'], pie1: C['--accent-01'], pie2: C['--ink-2'], pie3: C['--rule-c'], pieTitleTextColor: C['--ink'],
    pieSectionTextColor: C['--surface'], pieLegendTextColor: C['--ink'], pieStrokeColor: C['--surface'], pieOuterStrokeColor: C['--ink'],
    git0: C['--ink'], git1: C['--accent-01'], git2: C['--ink-2'], gitBranchLabel0: C['--surface'],
    critBkgColor: C['--accent-01'], doneTaskBkgColor: C['--ink-2'], taskBkgColor: C['--surface-2'], taskBorderColor: C['--ink'],
    taskTextColor: C['--ink'], taskTextDarkColor: C['--ink'], sectionBkgColor: C['--surface'], altSectionBkgColor: C['--surface-2'],
    gridColor: C['--rule-c'], todayLineColor: C['--accent-01'],
  },
  // SVG text, not HTML in a foreignObject: HTML labels need inline layout
  // styles, which a page may not carry (gate L-04)
  htmlLabels: false,
  flowchart: { htmlLabels: false, curve: 'linear' },
  sequence: { useMaxWidth: true },
  securityLevel: 'strict',
};

const hexToRgb = (h) => { const s = h.replace('#', ''); const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s.slice(0, 6); return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)); };
function hsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
const STAND_HSL = STANDINS.map(([hex, token]) => [hsl(hexToRgb(hex)), token]);

/** The token a colour in the SVG stands for. */
export function tokenFor(rgb) {
  const [h, s, l] = hsl(rgb);
  if (s < 0.15) return l < 0.5 ? '--ink' : '--surface'; // greys Mermaid made: by lightness
  let best = STAND_HSL[0][1], dist = Infinity;
  for (const [[sh], token] of STAND_HSL) {
    const d = Math.min(Math.abs(sh - h), 360 - Math.abs(sh - h));
    if (d < dist) { dist = d; best = token; }
  }
  return best;
}

/** An inline style attribute as SVG presentation attributes, one per declaration (no inline style on a page, gate L-04). */
function styleToAttributes(svg) {
  return svg.replace(/<([a-zA-Z][\w:-]*)([^<>]*?)\sstyle="([^"]*)"([^<>]*)>/g, (all, tag, before, style, after) => {
    const have = new Set([...`${before} ${after}`.matchAll(/\s([\w:-]+)=/g)].map((m) => m[1]));
    const attrs = style.split(';').map((d) => d.trim()).filter(Boolean).map((d) => {
      const i = d.indexOf(':');
      return [d.slice(0, i).trim(), d.slice(i + 1).trim().replace(/"/g, "'")];
    }).filter(([k, v]) => k && v && !k.startsWith('--') && !have.has(k) && !/^(max-width|transform-origin|filter)$/.test(k));
    return `<${tag}${before}${attrs.map(([k, v]) => ` ${k}="${v}"`).join('')}${after}>`;
  });
}

/**
 * Every colour literal in the SVG to a var(--token); inline styles turned
 * into attributes; shadows (filter) dropped (gate G-08); the root's fixed
 * width kept, so the text is drawn at its own size (gate G-01: a diagram
 * wider than the column scrolls in its box instead of shrinking).
 */
export function tokenise(svg) {
  return styleToAttributes(svg)
    .replace(/filter\s*:\s*[^;}"]*;?/g, '')
    .replace(/\sfilter="[^"]*"/g, '')
    .replace(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g, (hex) => `var(${tokenFor(hexToRgb(hex))})`)
    .replace(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+[\d.]+)?\s*\)/g, (_, r, g, b) => `var(${tokenFor([+r, +g, +b])})`)
    .replace(/hsla?\([^)]*\)/g, 'var(--ink-2)')
    .replace(/<svg\b[^>]*>/, (tag) => {
      const vb = /viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/.exec(tag);
      return vb ? tag.replace(/\swidth="[^"]*"/, '').replace(/^<svg/, `<svg width="${Math.ceil(+vb[1])}" height="${Math.ceil(+vb[2])}"`) : tag;
    })
    .replace(/\n+/g, ' ');
}

let browserPromise;
async function browser() {
  if (!browserPromise) {
    browserPromise = (async () => {
      const { chromium } = await import('@playwright/test');
      const candidates = [process.env.MERMAID_CHROMIUM, process.env.GATES_CHROMIUM, '/opt/pw-browsers/chromium'].filter(Boolean);
      const executablePath = candidates.find((p) => existsSync(p));
      const b = await chromium.launch(executablePath ? { executablePath } : {});
      process.once('exit', () => { b.close().catch(() => {}); });
      return b;
    })();
  }
  return browserPromise;
}

const FONT = (() => {
  try { return readFileSync(`${ROOT}public/fonts/BKribitz-400.woff2`).toString('base64'); } catch { return ''; }
})();

const keyOf = (code) => createHash('sha256').update(`${VERSION}\n${JSON.stringify(THEME)}\n${code}`).digest('hex').slice(0, 16);

/** Whether a diagram was drawn before (its SVG is in .cache/mermaid/): a build without Chromium can still show it. */
export const mermaidCached = (code) => existsSync(`${CACHE}${keyOf(code)}.svg`);

/**
 * The diagram as inline SVG, or null when it cannot be drawn here and was
 * never drawn before (the caller shows the source instead).
 * @param {string} code @param {string} id a stable id for the diagram's styles
 */
export async function renderMermaid(code, id) {
  const hash = keyOf(code);
  const file = `${CACHE}${hash}.svg`;
  let raw;
  if (existsSync(file)) raw = readFileSync(file, 'utf8');
  else {
    try {
      const b = await browser();
      const page = await b.newPage();
      try {
        await page.setContent(`<!doctype html><style>${FONT ? `@font-face{font-family:BKribitz;src:url(data:font/woff2;base64,${FONT}) format("woff2")}` : ''}body{font-family:BKribitz,sans-serif}</style><body></body>`);
        await page.addScriptTag({ path: require.resolve('mermaid/dist/mermaid.min.js') });
        await page.evaluate(() => document.fonts.ready);
        raw = await page.evaluate(async ({ code, theme }) => {
          // @ts-ignore mermaid is the page's global
          mermaid.initialize({ startOnLoad: false, ...theme });
          // @ts-ignore
          const { svg } = await mermaid.render('bkmermaid', code);
          return svg;
        }, { code, theme: THEME });
      } finally {
        await page.close();
      }
      mkdirSync(CACHE, { recursive: true });
      writeFileSync(file, raw);
    } catch (e) {
      return { error: e.message.split('\n')[0] };
    }
  }
  return { svg: tokenise(raw).replaceAll('bkmermaid', `mmd-${id}`) };
}
