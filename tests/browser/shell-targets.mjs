// Focused G-05/G-06 regression over actual generated pages. --source
// reversibly overlays current shell CSS/copy before a controller rebuild.
import { chromium } from '@playwright/test';
import { serve } from '../../scripts/gates/server.mjs';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const arg = (name, fallback) => { const i = process.argv.indexOf(name); return i < 0 ? fallback : process.argv[i + 1]; };
const source = process.argv.includes('--source');
const css = readFileSync(new URL('../../design-system/layout.css', import.meta.url), 'utf8');
const shell = readFileSync(new URL('../../src/components/Shell.astro', import.meta.url), 'utf8');
const themeRule = css.match(/\.shell-theme\s*\{[^}]+\}/)?.[0];
if (source) {
  assert.match(themeRule, /flex-shrink:\s*0/);
  assert.match(themeRule, /min-width:\s*44px/);
  assert.match(shell, /lang === 'en' \? ' · only' : ' · nur Deutsch'/);
}
const server = await serve(arg('--dir', 'dist'));
const browser = await chromium.launch({ headless: true, ...(existsSync('/usr/bin/chromium') ? { executablePath: '/usr/bin/chromium' } : {}) });
const results = [];
try {
  for (const width of [320, 390]) for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, colorScheme: theme });
    const page = await context.newPage();
    for (const route of ['/en/', '/de/', '/en/notes/sphere/', '/en/writing/growth-without-value/', '/404.html']) {
      await page.goto(server.url + route);
      await page.evaluate(() => document.fonts.ready);
      if (source) {
        await page.addStyleTag({ content: themeRule });
        await page.locator('.shell-lang-other').evaluate(el => { if (el.textContent.includes('English only')) el.textContent = ' · only'; });
      }
      const facts = await page.evaluate(() => {
        const button = document.querySelector('.shell-theme');
        const box = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        const link = document.querySelector('.shell-lang');
        return { width: box.width, height: box.height, shrink: style.flexShrink, overflow: document.documentElement.scrollWidth > innerWidth, label: link.getAttribute('aria-label'), text: link.textContent };
      });
      if (['/en/notes/sphere/', '/en/writing/growth-without-value/', '/404.html'].includes(route)) assert.equal(facts.label, 'English only · German home');
      results.push({ route, viewport: width, theme, ...facts });
    }
    await context.close();
  }
} finally { await browser.close(); await server.close(); }
const failures = results.filter(r => r.width < 44 || r.height < 44 || r.overflow);
writeFileSync(arg('--out', '/tmp/shell-targets.json'), JSON.stringify({ sourceOverlay: source, results, failures }, null, 2));
console.log(JSON.stringify({ sourceOverlay: source, contexts: results.length, failures }, null, 2));
assert.equal(failures.length, 0, 'theme target must remain 44 × 44 and shell must not overflow');
