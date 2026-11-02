import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { serve } from '../../scripts/gates/server.mjs';

let browser;
let server;
before(async () => {
  server = await serve(fileURLToPath(new URL('../../dist', import.meta.url)));
  const executable = process.env.GATES_CHROMIUM || '/opt/pw-browsers/chromium';
  browser = await chromium.launch(existsSync(executable) ? { executablePath: executable } : {});
});
after(async () => {
  await browser?.close();
  await server?.close();
});

// The 767/768 boundary catches mobile-only overrides; both languages
// exercise the compact navigation without depending on its implementation.
for (const width of [320, 390, 639, 767, 768, 1280]) {
  for (const lang of ['en', 'de']) {
    for (const theme of ['light', 'dark']) {
      test(`sticky glass shell: ${lang}, ${theme}, ${width}px`, async () => {
        const page = await browser.newPage({ viewport: { width, height: 800 } });
        try {
          await page.addInitScript((value) => localStorage.setItem('bk-theme', value), theme);
          await page.goto(`${server.url}/${lang}/`);
          await page.evaluate(() => document.fonts.ready);
          await page.evaluate(() => window.scrollTo(0, 500));
          await page.waitForFunction(() => window.scrollY >= 500);
          const state = await page.evaluate(() => {
            const shell = document.querySelector('header.shell');
            const doors = document.querySelector('.shell-doors');
            const rect = shell.getBoundingClientRect();
            const nav = doors.getBoundingClientRect();
            const style = getComputedStyle(shell);
            return {
              top: rect.top, bottom: rect.bottom, height: rect.height,
              nav_top: nav.top, nav_bottom: nav.bottom,
              border_width: parseFloat(style.borderBottomWidth),
              border_style: style.borderBottomStyle,
              backdrop: style.backdropFilter || style.webkitBackdropFilter,
              background: style.backgroundColor,
              surface: getComputedStyle(document.body).backgroundColor,
              offset: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--shell-h')),
              scroll_padding: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
            };
          });
          assert.equal(state.top, 0, 'the complete header remains at the viewport top after scrolling');
          assert.ok(state.nav_top >= 0 && state.nav_bottom <= state.bottom, 'the secondary navigation stays inside the visible sticky header');
          assert.equal(state.border_width, 1, 'the full-width bottom hairline is painted');
          assert.equal(state.border_style, 'solid');
          assert.match(state.backdrop, /blur\(18px\)/, 'both rows share the original glass');
          assert.notEqual(state.background, state.surface, 'the glass has a translucent surface tint');
          assert.ok(Math.abs(state.offset - state.height) <= 1, 'anchor and sticky-content offsets account for both rows, within a hairline');
          assert.ok(state.scroll_padding >= state.height + 15, 'anchors clear the complete header');
        } finally {
          await page.close();
        }
      });
    }
  }
}

test('reduced transparency keeps the sticky shell opaque', async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  try {
    const session = await page.context().newCDPSession(page);
    await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
    await page.goto(`${server.url}/en/`);
    const state = await page.evaluate(() => {
      const style = getComputedStyle(document.querySelector('header.shell'));
      return { backdrop: style.backdropFilter, background: style.backgroundColor, surface: getComputedStyle(document.body).backgroundColor };
    });
    assert.equal(state.backdrop, 'none');
    assert.equal(state.background, state.surface);
  } finally {
    await page.close();
  }
});
