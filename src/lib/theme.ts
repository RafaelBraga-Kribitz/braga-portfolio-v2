// Theme plumbing shared by every page head (D-024): the two theme-color
// values and the pre-paint script. One source each, so the root redirect
// page and Base.astro cannot drift apart.
//
// themeColor: the painted canvas (--surface) of each theme, read from
// design-system/tokens.css at build time. A <meta name="theme-color">
// cannot read var(--surface), so its value is copied here by the build,
// never by hand: tokens.css stays the only file with a hex in it
// (lint:css checks src/ for hex values without exception).
//
// PREPAINT: the first script in <head>. With a stored choice
// (localStorage['bk-theme']) it sets data-theme on <html> and gives both
// theme-color metas the stored theme's colour (light is the first meta,
// dark the second), so the browser bar matches the page from the first
// paint. It must stay short (gate L-03 identifies it by size, ≤ 400 B).
import tokens from '../../design-system/tokens.css?raw';

/** The --surface hex of the block that opens at `opener` in tokens.css. */
function surfaceAfter(opener: RegExp, name: string): string {
  const m = opener.exec(tokens);
  if (!m) throw new Error(`theme: tokens.css has no ${name} block`);
  const from = m.index + m[0].length;
  const block = tokens.slice(from, tokens.indexOf('}', from));
  const hex = /--surface\s*:\s*(#[0-9A-Fa-f]{6})\s*;/.exec(block);
  if (!hex) throw new Error(`theme: no --surface hex in the ${name} block of tokens.css`);
  return hex[1].toUpperCase();
}

export const themeColor = {
  light: surfaceAfter(/(?:^|\n):root\s*\{/, 'light :root'),
  dark: surfaceAfter(/:root\[data-theme="dark"\]\s*,\s*\.dark\s*\{/, 'dark'),
} as const;

export const PREPAINT =
  "(function(){try{var t=localStorage.getItem('bk-theme');if(t==='light'||t==='dark'){var d=document,m=d.querySelectorAll('meta[name=theme-color]');d.documentElement.dataset.theme=t;if(m.length===2)m[0].content=m[1].content=m[t==='dark'?1:0].content}}catch(e){}})()";
