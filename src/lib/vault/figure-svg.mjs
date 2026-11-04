// src/lib/vault/figure-svg.mjs — the SVG a [!figure] callout inlines
// (src/lib/remark/callouts.mjs). A figure is drawn by scripts/figures/
// build.mjs into vault/Attachments/figures/; the page inlines the file so
// that its var(--token) colours follow the light/dark toggle. Whatever is
// inlined is checked here first, and a file that breaks a rule fails the
// build naming the file:
//   · a root <svg> with role="img", aria-labelledby, a <title> and a <desc>
//     that holds the data (at least one digit: the finding and the values)
//   · no <script>, <style>, <foreignObject>, no style attribute, no on…
//     event attribute, no external href, no colour literal in fill or stroke
//   · every id starts with "fig-<file name>-", so two figures on one page
//     cannot collide (the callout also refuses the same file twice)

/** The prefix every id in a figure file must carry: "fig-" and the file name without its extension. @param {string} file */
export const idPrefix = (file) => `fig-${String(file).split(/[\\/]/).pop().replace(/\.svg$/i, '').replace(/[^A-Za-z0-9]+/g, '-').toLowerCase()}-`;

/**
 * The checked, single-line SVG markup of a figure file.
 * @param {string} raw the file's text
 * @param {string} file its name, for the messages
 * @returns {string}
 */
export function inlineSvg(raw, file) {
  /** @param {string} msg */
  const fail = (msg) => { throw new Error(`figure ${file}: ${msg}`); };
  const src = String(raw).replace(/^﻿/, '').replace(/<\?xml[^>]*\?>/g, '').replace(/<!--[\s\S]*?-->/g, '').trim();
  if (!/^<svg[\s>]/.test(src) || !/<\/svg>$/.test(src)) fail('the file is not one <svg> element');
  const bad = [
    [/<script[\s>]/i, '<script>'],
    [/<style[\s>]/i, '<style> (colours are presentation attributes with var(--token))'],
    [/<foreignObject[\s>]/i, '<foreignObject>'],
    [/\sstyle\s*=/i, 'a style attribute'],
    [/\son[a-z]+\s*=/i, 'an on… event attribute'],
    [/\shref\s*=\s*["'](?!#)/i, 'an external href'],
    [/\sxlink:href\s*=\s*["'](?!#)/i, 'an external xlink:href'],
    [/\s(?:fill|stroke|stop-color|color)\s*=\s*["']\s*(?:#|rgb|hsl)/i, 'a colour literal (use var(--ink), var(--accent-01) and the other tokens)'],
  ];
  for (const [re, what] of bad) if (re.test(src)) fail(`contains ${what}`);
  const root = /^<svg\b[^>]*>/.exec(src)[0];
  if (!/\srole\s*=\s*["']img["']/.test(root)) fail('the root <svg> needs role="img"');
  if (!/\saria-labelledby\s*=\s*["'][^"']+["']/.test(root)) fail('the root <svg> needs aria-labelledby');
  if (!/\sviewBox\s*=/.test(root)) fail('the root <svg> needs a viewBox');
  if (!/^<svg\b[^>]*>\s*<title[\s>]/.test(src)) fail('<title> must be the first child of <svg>');
  const desc = /<desc[\s>]([\s\S]*?)<\/desc>/.exec(src);
  if (!desc) fail('a <desc> is missing');
  if (!/\d/.test(desc[1])) fail('the <desc> holds no digit: it must carry the finding and every plotted value');
  const prefix = idPrefix(file);
  for (const m of src.matchAll(/\sid\s*=\s*["']([^"']*)["']/g)) if (!m[1].startsWith(prefix)) fail(`the id “${m[1]}” must start with “${prefix}”`);
  return src.replace(/\s*\n\s*/g, ' ');
}
