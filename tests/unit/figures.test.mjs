// tests/unit/figures.test.mjs — the designed figures: the generator
// (scripts/figures/build.mjs), the SVG rules (src/lib/vault/figure-svg.mjs)
// and the [!figure] callout (src/lib/remark/callouts.mjs). Run: npm run test:unit
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import obsidian from '../../src/lib/remark/obsidian.mjs';
import callouts from '../../src/lib/remark/callouts.mjs';
import { inlineSvg, idPrefix } from '../../src/lib/vault/figure-svg.mjs';
import { buildAll, assertData, diffAgainstDisk, findings, FUNNEL, SKILLS_TOP, WAVES, TCO, HEAT, ROAS, heatContrast } from '../../scripts/figures/build.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));

describe('figures · generator', () => {
  it('draws 14 files, 7 figures in English and German', () => {
    const built = buildAll();
    assert.equal(built.size, 14);
    for (const lang of ['en', 'de']) assert.equal([...built.keys()].filter((k) => k.endsWith(`.${lang}.svg`)).length, 7);
  });

  it('the files on disk are what the script draws (npm run figures -- --check)', () => {
    assert.deepEqual(diffAgainstDisk(), []);
    const r = spawnSync(process.execPath, ['scripts/figures/build.mjs', '--check'], { cwd: root, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr || r.stdout);
  });

  it('every flow and every interval holds, and a table that does not hold fails', () => {
    assertData();
    assert.equal(FUNNEL.out + FUNNEL.inScope, FUNNEL.raw);
    assert.equal(FUNNEL.core + FUNNEL.adjacent + FUNNEL.duplicates, FUNNEL.inScope);
    FUNNEL.out += 1;
    try { assert.throws(() => assertData(), /FUNNEL out of scope/); } finally { FUNNEL.out -= 1; }
    SKILLS_TOP[0].count += 200;
    try { assert.throws(() => assertData(), /SKILLS_TOP sql/); } finally { SKILLS_TOP[0].count -= 200; }
    WAVES[0].caught = true;
    try { assert.throws(() => assertData(), /WAVES 0315/); } finally { WAVES[0].caught = false; }
    TCO[0].mean = 1;
    try { assert.throws(() => assertData(), /TCO lean-hybrid/); } finally { TCO[0].mean = 461414; }
    assertData();
  });

  it('the intervals hold their medians, and every heatmap row holds seven family shares', () => {
    for (const r of ROAS) assert.ok(r.lo <= r.median && r.median <= r.hi, r.id);
    for (const r of HEAT) assert.equal(Object.keys(r.v).length, 7, r.id);
  });

  it('ink text stays above 4.5:1 on the darkest heat cell, light and dark', () => {
    const c = heatContrast();
    assert.ok(c.light >= 4.5 && c.dark >= 4.5, JSON.stringify(c));
  });

  describe('every file obeys the SVG rules', () => {
    for (const [file, svg] of buildAll()) {
      it(file, () => {
        const one = inlineSvg(svg, file);
        assert.ok(one.startsWith('<svg') && !one.includes('\n'));
        assert.match(one, /^<svg [^>]*role="img"/);
        const vb = /viewBox="0 0 (\d+) (\d+)"/.exec(one);
        assert.ok(vb && Number(vb[1]) <= 720, `width ${vb && vb[1]} is over 720`);
        for (const m of one.matchAll(/font-size="([\d.]+)"/g)) assert.ok(Number(m[1]) >= 13, `font-size ${m[1]} is under 13`);
        assert.ok(!/<style|style=|<script|<image|#[0-9a-fA-F]{6}\b/.test(one));
        // colours are the six tokens only
        for (const m of one.matchAll(/(?:fill|stroke)="(var\(--[a-z0-9-]+\)|none)"/g)) assert.match(m[1], /^(none|var\(--(ink|ink-2|surface|surface-2|rule-c|accent-01)\))$/);
        for (const m of one.matchAll(/(?:fill|stroke)="([^"]*)"/g)) assert.match(m[1], /^(none|var\(--(ink|ink-2|surface|surface-2|rule-c|accent-01)\))$/, `colour ${m[1]}`);
        // the accent paints marks, never text
        for (const m of one.matchAll(/<text\b[^>]*>/g)) assert.ok(!/fill="var\(--accent-01\)"/.test(m[0]), 'accent text');
        // one title, one description, ids carry the file prefix
        assert.equal((one.match(/<title/g) || []).length, 1);
        assert.equal((one.match(/<desc/g) || []).length, 1);
        for (const m of one.matchAll(/ id="([^"]+)"/g)) assert.ok(m[1].startsWith(idPrefix(file)), m[1]);
      });
    }
  });

  it('numbers print by language: 12,429 and 40% in English, 12.429 and 4,38 in German', () => {
    const all = buildAll();
    assert.ok(all.get('01-01-funnel.en.svg').includes('>12,429<'));
    assert.ok(all.get('01-01-funnel.de.svg').includes('>12.429<'));
    assert.ok(all.get('01-01-skills-top.en.svg').includes('>40% (37–44)<'));
    assert.ok(all.get('01-01-skills-top.de.svg').includes('>40 % (37–44)<'));
    assert.ok(all.get('01-03-roas-interval.de.svg').includes('4,38'));
    assert.ok(all.get('01-03-roas-interval.en.svg').includes('4.38'));
  });

  it('a phone shows the interval plots and the module flow whole: natural width at most 480 (flow in English 360)', () => {
    const width = (f) => Number(/viewBox="0 0 (\d+)/.exec(buildAll().get(f))[1]);
    for (const n of ['01-01-skills-top', '01-02-tco-range', '01-03-roas-interval', '01-04-wave-intervals', '01-04-module-flow']) for (const l of ['en', 'de']) assert.ok(width(`${n}.${l}.svg`) <= 480, `${n}.${l}`);
    assert.ok(width('01-04-module-flow.en.svg') <= 360);
  });

  it('the <desc> carries the finding and the plotted values: a digit in each, and the finding first', () => {
    for (const [file, svg] of buildAll()) {
      const d = /<desc[^>]*>([^<]*)<\/desc>/.exec(svg)[1].replace(/&amp;/g, '&');
      assert.match(d, /\d/, file);
      assert.ok(d.startsWith(findings().get(file)), `${file}: the description starts with its finding`);
    }
    assert.match(buildAll().get('01-01-skills-heatmap.en.svg'), /SQL: Data engineering 69/);
    assert.match(buildAll().get('01-04-wave-intervals.en.svg'), /15 Mar: Observed margin −4\.50, Predictive mean 20\.27, 95% band −3\.2 to 44\.7, miss/);
  });

  it('a page heading is the finding of its figure, in both languages', () => {
    const f = findings();
    let checked = 0;
    for (const lang of ['en', 'de']) for (const file of readdirSync(`${root}website_vault/Projects/${lang}`)) {
      const md = readFileSync(`${root}website_vault/Projects/${lang}/${file}`, 'utf8').replace(/\r\n/g, '\n');
      for (const m of md.matchAll(/> \[!figure\] [^\n]*\n((?:> [^\n]*\n)*?)> !\[\[([^\]]+\.svg)\]\]/g)) {
        const heading = m[1].replace(/^> /gm, '').replace(/\n/g, ' ').trim().replace(/\u00A0/g, ' ');
        assert.equal(heading, f.get(m[2]).replace(/\u00A0/g, ' '), `${lang}/${file} · ${m[2]}`);
        checked++;
      }
    }
    assert.ok(checked >= 10, `${checked} figure headings checked`);
  });
});

describe('figures · figure-svg checks', () => {
  const ok = '<svg viewBox="0 0 10 10" role="img" aria-labelledby="fig-x-title fig-x-desc"><title id="fig-x-title">T</title><desc id="fig-x-desc">D 12</desc><rect fill="var(--ink)"/></svg>';
  it('accepts a clean file and flattens it to one line', () => {
    assert.equal(inlineSvg(ok.replace('><title', '>\n  <title'), 'x.svg').includes('\n'), false);
  });
  const cases = [
    ['a script', ok.replace('<rect', '<script>1</script><rect'), /<script>/],
    ['a style element', ok.replace('<rect', '<style>a{}</style><rect'), /<style>/],
    ['a style attribute', ok.replace('<rect', '<rect style="fill:red"'), /style attribute/],
    ['an event attribute', ok.replace('<rect', '<rect onclick="x()"'), /event attribute/],
    ['an external link', ok.replace('<rect', '<a href="https://example.test"/><rect'), /external href/],
    ['a colour literal', ok.replace('var(--ink)', '#ff0000'), /colour literal/],
    ['no role', ok.replace(' role="img"', ''), /role="img"/],
    ['no label', ok.replace(' aria-labelledby="fig-x-title fig-x-desc"', ''), /aria-labelledby/],
    ['no title first', ok.replace(/<title[^]*?<\/title>/, '<g/>'), /title/],
    ['no desc', ok.replace(/<desc[^]*?<\/desc>/, ''), /desc/],
    ['a desc without data', ok.replace('>D 12<', '>Words only<'), /no digit/],
    ['a foreign id', ok.replace('id="fig-x-desc"', 'id="desc"'), /must start with/],
    ['not an svg', '<div/>', /not one <svg>/],
  ];
  for (const [name, svg, re] of cases) {
    it(`refuses ${name}, naming the file`, () => assert.throws(() => inlineSvg(svg, 'x.svg'), (e) => e.message.startsWith('figure x.svg:') && re.test(e.message)));
  }
});

describe('figures · the [!figure] callout', async () => {
  const p = await createSatteriMarkdownProcessor({ syntaxHighlight: false, mdastPlugins: [obsidian, ...callouts] });
  const render = async (md, lang = 'en') => (await p.render(md, { frontmatter: { lang } })).code;
  const note = (embed, tail = 'caption: In scope means core.\n> source: market_summary, 16 Sep 2026.') => `> [!figure] Fig. 01-01-1 · From raw rows to core postings\n> 720 of 12,429 raw rows are core data-role postings.\n> ${embed}\n>\n> ${tail}\n`;

  it('becomes the evidence figure with the SVG inlined in a focusable group', async () => {
    const html = await render(note('![[01-01-funnel.en.svg]]'));
    assert.match(html, /^<figure class="evidence" data-width="wide">/);
    assert.match(html, /<p class="label">Fig\. 01-01-1 · From raw rows to core postings<\/p>/);
    assert.match(html, /<p class="evidence-heading display">720 of 12,429 raw rows are core data-role postings\.<\/p>/);
    assert.match(html, /<div class="diagram" tabindex="0" role="group" aria-label="720 of 12,429 raw rows are core data-role postings\."[^>]*>\s*<svg [^>]*role="img"/);
    assert.match(html, /data-scroll="" data-cue="← Scroll sideways →"/, 'a 720-wide figure scrolls on a phone and says so');
    assert.match(html, /<title id="fig-01-01-funnel-en-title">/);
    assert.match(html, /<figcaption>In scope means core\.<br><b>Source:<\/b> market_summary, 16 Sep 2026\.<\/figcaption>/);
    assert.ok(!/style=/.test(html), 'no style attribute reaches the page');
    assert.ok(!/<a /.test(html), 'the embed is not left as a link');
  });

  it('says Quelle in a German page', async () => {
    const html = await render(note('![[01-01-funnel.de.svg]]'), 'de');
    assert.match(html, /<b>Quelle:<\/b>/);
    assert.match(html, /fig-01-01-funnel-de-title/);
  });

  it('fails when the file is not in the vault, naming it', async () => {
    await assert.rejects(render(note('![[no-such-figure.svg]]')), /figure callout in .*no-such-figure\.svg/);
  });

  it('fails without a source', async () => {
    await assert.rejects(render(note('![[01-01-funnel.en.svg]]', 'caption: only a caption')), /source: is missing/);
  });

  it('fails on an unknown meta line', async () => {
    await assert.rejects(render(note('![[01-01-funnel.en.svg]]', 'caption: c\n> source: s\n> scale: 0–100')), /a line is not one of caption, source: “scale: 0–100”/);
  });

  it('fails without a finding', async () => {
    await assert.rejects(render('> [!figure] Fig. 01-01-1 · X\n> ![[01-01-funnel.en.svg]]\n>\n> source: s\n'), /no finding/);
  });

  it('fails when the same file is used twice on one page', async () => {
    const two = `${note('![[01-01-funnel.en.svg]]')}\n${note('![[01-01-funnel.en.svg]]')}`;
    await assert.rejects(render(two), /embedded twice on one page/);
  });

  it('lets two different figures share a page without clashing ids', async () => {
    const html = await render(`${note('![[01-01-funnel.en.svg]]')}\n${note('![[01-01-skills-top.en.svg]]')}`);
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
  });

  it('leaves [!bars] as it was, and the files named in the figure notes exist', async () => {
    const html = await render('> [!bars] Fig. 1 · Bars\n> Finding.\n> - A — 40\n>\n> scale: 0–100 · unit: %\n> source: s\n');
    assert.match(html, /<div class="ev-bar">/);
    for (const f of ['01-01-funnel.en.svg', '01-04-module-flow.de.svg']) assert.ok(readFileSync(`${root}website_vault/Attachments/figures/${f}`, 'utf8').startsWith('<svg'));
  });
});
