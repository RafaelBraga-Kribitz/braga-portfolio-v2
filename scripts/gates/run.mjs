#!/usr/bin/env node
// ============================================================
// scripts/gates/run.mjs — run the gates over a built site.
//
//   node scripts/gates/run.mjs [--dir dist] [--pages /en/,/en/work/]
//        [--widths 320,390,768,1024,1280,1440] [--themes light,dark]
//        [--quick] [--json out.json] [--expect expect.json]
//        [--site https://…] [--base /repo/] [--concurrency 3] [--verbose]
//        [--pending tests/gates/pending-routes.json | --no-pending] [--draft-langs de]
//
// Enumerates every index.html and 404.html under --dir, serves the folder
// (scripts/gates/server.mjs), and for each page runs
//   once           L-01…L-07 over the raw HTML file (pageFacts → staticGates)
//   width × theme  G-01…G-14 in the rendered page (pageGates)
//   390, 1280      A-01 axe (wcag2a, wcag2aa, wcag21aa), both themes
// One browser; one context per theme (theme set by an init script that
// writes localStorage['bk-theme'], as the reader's stored choice would);
// three pages in parallel. --quick: 390 and 1280, light only, no axe.
//
// --base: a build made with SITE_BASE (a project-page deploy, DEPLOY.md)
// is served under that path, every page is opened under it, and every
// internal URL must carry it (L-01 fails a local link outside it). The
// default is $SITE_BASE, as the build reads it, so `npm run verify` with
// SITE_BASE set checks the build it made. Page paths in the table, in
// --pages and in the pending list stay relative to the build root
// (/en/work/), as the files are.
//
// Pending routes: pages of the site map that a later phase builds. A link
// to one is reported (L-01 counts it, a `pending` row lists them) but does
// not fail; an entry whose page now exists fails the run until it is
// removed, so the list only shrinks. Read by default, whatever --dir is
// (a scratch build gets the verdict dist gets); --no-pending opts out.
//
// --draft-langs de: the languages whose every page must show the draft
// mark (gate L-07; DRAFT_LANGS in src/lib/i18n.ts). '' when approved.
//
// Prints a compact table (page · gate · status · detail), writes the JSON
// report, exits 1 on any failure. With --expect it instead exits 0 only when
// the failures match the expectation file exactly (the fixture self-test).
// See tests/gates/README.md.
// ============================================================
import { readFileSync, writeFileSync, readdirSync, statSync, realpathSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';   // the declared package (it re-exports playwright's launchers)
import { AxeBuilder } from '@axe-core/playwright';
import { serve, basePrefix } from './server.mjs';
import { GATES, GATE_NAME, pageGates, pageFacts, staticGates, axeGate, pagePathOf, skipped, fileFor } from './checks.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const AXE_WIDTHS = [390, 1280];

/* ---------------- arguments ---------------- */
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const val = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] !== undefined && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
if (flag('--help') || flag('-h')) {
  const lines = readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n');
  console.log(lines.slice(2, lines.findIndex((l, i) => i > 2 && l.startsWith('// ====='))).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(0);
}
const quick = flag('--quick');
const opts = {
  dir: resolve(val('--dir', join(ROOT, 'dist'))),
  pages: val('--pages', '') ? val('--pages', '').split(',').map((s) => s.trim()).filter(Boolean) : null,
  widths: (val('--widths', quick ? '390,1280' : '320,390,768,1024,1280,1440')).split(',').map(Number).filter((n) => n > 0),
  themes: (val('--themes', quick ? 'light' : 'light,dark')).split(',').map((s) => s.trim()).filter(Boolean),
  axe: !quick && !flag('--no-axe'),
  json: val('--json', ''),
  expect: val('--expect', ''),
  verbose: flag('--verbose'),
  concurrency: Math.max(1, Number(val('--concurrency', 3)) || 3),
  site: val('--site', siteFromConfig()),
  base: basePrefix(val('--base', process.env.SITE_BASE || '')),
  chromium: val('--chromium', process.env.GATES_CHROMIUM || '/opt/pw-browsers/chromium'),
  height: Number(val('--height', 900)) || 900,
  // the pending list applies to every build, --dir or not: a scratch build
  // of the same source must get the same verdict as dist (--no-pending opts out)
  pending: flag('--no-pending') ? '' : val('--pending', join(ROOT, 'tests/gates/pending-routes.json')),
  // languages whose pages must carry the draft mark (gate L-07); mirrors
  // DRAFT_LANGS in src/lib/i18n.ts — empty both when the owner approves
  draftLangs: val('--draft-langs', 'de').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
};

function siteFromConfig() {
  try {
    const m = /\bsite:\s*['"]([^'"]+)['"]/.exec(readFileSync(join(ROOT, 'astro.config.mjs'), 'utf8'));
    return m ? m[1] : '';
  } catch { return ''; }
}

/* ---------------- pages ---------------- */
function enumerate(dir) {
  const files = [];
  const seen = new Set();
  const walk = (d) => {
    let real; try { real = realpathSync(d); } catch { return; }
    if (seen.has(real)) return; seen.add(real);
    for (const name of readdirSync(d).sort()) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      const p = join(d, name);
      let st; try { st = statSync(p); } catch { continue; }
      if (st.isDirectory()) walk(p);
      else if (name === 'index.html' || name === '404.html') files.push(p);
    }
  };
  walk(dir);
  return files.map((file) => ({ file, path: pagePathOf(relative(dir, file)) }));
}
const normWanted = (p) => { let s = p.startsWith('/') ? p : '/' + p; if (!s.endsWith('/') && !s.endsWith('.html') && !s.endsWith('*')) s += '/'; return s; };
const wanted = (p) => !opts.pages || opts.pages.map(normWanted).some((w) => (w.endsWith('*') ? p.startsWith(w.slice(0, -1)) : p === w));

/* ---------------- run ---------------- */
const t0 = Date.now();
if (!existsSync(opts.dir)) { console.error(`gates: no such directory ${opts.dir} (build first, or pass --dir)`); process.exit(2); }
const allPages = enumerate(opts.dir);
const pages = allPages.filter((p) => wanted(p.path));
if (!pages.length) { console.error(`gates: no index.html or 404.html under ${opts.dir}${opts.pages ? ' matching --pages' : ''}`); process.exit(2); }

// pending routes (see the header): the set, and the entries that now exist
let pending = null;
const pendingStale = [];
if (opts.pending && existsSync(opts.pending)) {
  const list = JSON.parse(readFileSync(opts.pending, 'utf8')).routes || [];
  pending = new Set(list);
  for (const r of list) if (fileFor(opts.dir, r)) pendingStale.push(r);
} else if (opts.pending && argv.includes('--pending')) {
  console.error(`gates: no such pending file ${opts.pending}`); process.exit(2);
}

const srv = await serve(opts.dir, { base: opts.base });
const launch = { headless: true };
if (opts.chromium && existsSync(opts.chromium)) launch.executablePath = opts.chromium;
const browser = await chromium.launch(launch);
const site = opts.site ? new URL(opts.site) : null;
const tty = process.stderr.isTTY;

try {
  // 1 · facts for every page (twins are needed for L-02), from the raw file
  const factsCtx = await browser.newContext();
  const factsPage = await factsCtx.newPage();
  const facts = new Map();
  for (const p of allPages) facts.set(p.path, await factsPage.evaluate(pageFacts, readFileSync(p.file, 'utf8')));
  await factsCtx.close();

  const report = new Map(); // path → { static, runs: [], missing:Set, errors:[] }
  for (const p of pages) {
    const f = facts.get(p.path);
    report.set(p.path, {
      page: p.path, file: relative(ROOT, p.file) || p.file, redirect: f.refresh !== null,
      static: staticGates(p.path, f, { dir: opts.dir, site, pages: facts, pending, base: opts.base, draftLangs: opts.draftLangs }), runs: [], missing: new Set(), errors: [],
    });
  }

  // 2 · rendered gates: page × theme × width (+ axe at 390 / 1280)
  const axeWidths = opts.axe ? opts.widths.filter((w) => AXE_WIDTHS.includes(w)) : [];
  const jobs = [];
  for (const theme of opts.themes) for (const p of pages) {
    if (report.get(p.path).redirect) continue;
    for (const width of opts.widths) jobs.push({ path: p.path, theme, width, axe: axeWidths.includes(width) });
  }
  const contexts = {};
  for (const theme of opts.themes) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: opts.height }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'no-preference' });
    await ctx.addInitScript((t) => { try { localStorage.setItem('bk-theme', t); } catch (e) { /* storage blocked */ } }, theme);
    contexts[theme] = ctx;
  }
  const origin = srv.url;
  const makePage = async (theme) => {
    const page = await contexts[theme].newPage();
    const state = { foreign: [], missing: [], errors: [] };
    await page.route((u) => /^https?:$/.test(u.protocol) && u.origin !== origin, (route) => { state.foreign.push(route.request().url()); route.abort('blockedbyclient').catch(() => {}); });
    page.on('response', (r) => { const u = new URL(r.url()); if (u.origin === origin && r.status() >= 400 && u.pathname !== '/favicon.ico') state.missing.push(`${u.pathname} → ${r.status()}`); });
    page.on('pageerror', (e) => state.errors.push(String(e && e.message || e).slice(0, 160)));
    return { page, state };
  };

  let done = 0;
  const queue = jobs.slice();
  await Promise.all(Array.from({ length: Math.min(opts.concurrency, queue.length) }, async () => {
    const mine = {};
    for (let job = queue.shift(); job; job = queue.shift()) {
      const w = (mine[job.theme] ||= await makePage(job.theme));
      w.state.foreign = []; w.state.missing = []; w.state.errors = [];
      const entry = report.get(job.path);
      const run = { width: job.width, theme: job.theme, applied: '', results: [] };
      try {
        await w.page.setViewportSize({ width: job.width, height: opts.height });
        await w.page.goto(origin + opts.base + job.path, { waitUntil: 'load', timeout: 30000 });
        await w.page.waitForFunction(() => !document.querySelector('astro-island[ssr]'), null, { timeout: 5000 }).catch(() => {});
        const g = await w.page.evaluate(pageGates, { foreign: w.state.foreign });
        run.applied = g.theme;
        run.results.push(...g.results);
        if (job.axe) run.results.push(await axeGate(w.page, AxeBuilder));
      } catch (e) {
        run.results.push({ id: 'RUN', name: 'Page run', status: 'fail', count: 1, total: 1, summary: 'the page could not be checked', offenders: [String(e && e.message || e).split('\n')[0].slice(0, 200)] });
      }
      for (const m of w.state.missing) entry.missing.add(m);
      for (const e of w.state.errors) if (!entry.errors.includes(e)) entry.errors.push(e);
      entry.runs.push(run);
      done++;
      if (tty) process.stderr.write(`\r  gates ${done}/${jobs.length}`);
    }
    for (const t of Object.keys(mine)) await mine[t].page.close();
  }));
  if (tty && jobs.length) process.stderr.write('\r' + ' '.repeat(30) + '\r');

  // 3 · aggregate per page × gate across the contexts
  const ctxLabel = (r) => `${r.width}/${r.theme}`;
  const pagesOut = [];
  const themeOrder = (t) => opts.themes.indexOf(t);
  for (const p of pages) {
    const e = report.get(p.path);
    e.runs.sort((a, b) => themeOrder(a.theme) - themeOrder(b.theme) || a.width - b.width);
    if (e.missing.size) {
      const l01 = e.static.find((r) => r.id === 'L-01');
      const extra = Array.from(e.missing).map((m) => `runtime request ${m}`);
      l01.offenders = [...l01.offenders, ...extra]; l01.count += extra.length; l01.status = 'fail';
      l01.summary = `${l01.count} internal references do not resolve`;
    }
    const gates = [];
    for (const [id] of GATES) {
      const st = e.static.find((r) => r.id === id);
      if (st) { gates.push({ ...st, contexts: 1, failing: st.status === 'fail' ? ['static'] : [], all: st.offenders }); continue; }
      const runs = e.runs.map((r) => ({ ctx: ctxLabel(r), res: r.results.find((x) => x.id === id) })).filter((x) => x.res);
      if (!runs.length) {
        gates.push({ ...skipped(id, e.redirect ? 'redirect page: rendered gates do not apply' : id === 'A-01' ? (opts.axe ? `no width of ${AXE_WIDTHS.join('/')} in --widths` : 'axe off (--quick)') : 'not run'), contexts: 0, failing: [], all: [] });
        continue;
      }
      const failing = runs.filter((x) => x.res.status === 'fail');
      const first = failing[0]?.res || runs[0].res;
      const all = Array.from(new Set(failing.flatMap((x) => x.res.offenders))).slice(0, 60);
      gates.push({ id, name: GATE_NAME[id], status: failing.length ? 'fail' : 'pass', count: first.count, total: first.total, summary: first.summary, offenders: first.offenders, contexts: runs.length, failing: failing.map((x) => x.ctx), all });
    }
    const runErr = e.runs.flatMap((r) => r.results.filter((x) => x.id === 'RUN').map((x) => ({ ctx: ctxLabel(r), ...x })));
    if (runErr.length) gates.push({ id: 'RUN', name: 'Page run', status: 'fail', count: runErr.length, total: e.runs.length, summary: `${runErr.length} contexts could not be checked`, offenders: runErr.map((x) => `${x.ctx}: ${x.offenders[0]}`).slice(0, 6), contexts: e.runs.length, failing: runErr.map((x) => x.ctx), all: [] });
    const themeMiss = e.runs.filter((r) => r.theme !== 'light' && r.applied !== r.theme).map(ctxLabel);
    pagesOut.push({ page: p.path, file: e.file, redirect: e.redirect, gates, warnings: [
      ...(themeMiss.length ? [`theme not applied (data-theme ≠ requested) in ${themeMiss.length} contexts: the pre-paint script did not run`] : []),
      ...e.errors.map((x) => `page error: ${x}`),
    ], runs: e.runs });
  }

  // 4 · table
  const cols = Math.max(100, process.stdout.columns || 160);
  const pw = Math.min(44, Math.max(4, ...pagesOut.map((p) => p.page.length)));
  const pad = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s.padEnd(n));
  const line = (a, b, c, d) => { const s = `${pad(a, pw)}  ${pad(b, 5)}  ${pad(c, 4)}  ${d}`; return s.length > cols ? s.slice(0, cols - 1) + '…' : s; };
  const ctxText = (g) => (g.failing[0] === 'static' ? 'static' : g.failing.length === g.contexts ? `all ${g.contexts} ctx` : `${g.failing.length}/${g.contexts} ctx (${g.failing.slice(0, 3).join(' ')}${g.failing.length > 3 ? ' …' : ''})`);
  const relDir = relative(process.cwd(), opts.dir);
  console.log(`gates · ${relDir && !relDir.startsWith('..') ? relDir : opts.dir}${opts.base ? ` (base ${opts.base}/)` : ''} · ${pages.length} page${pages.length === 1 ? '' : 's'} · widths ${opts.widths.join('/')} · ${opts.themes.join('+')}${opts.axe ? ' · axe at ' + (axeWidths.join('/') || '—') : ' · no axe'}`);
  console.log(line('PAGE', 'GATE', 'STAT', 'DETAIL'));
  let failRows = 0;
  const byGate = {};
  for (const p of pagesOut) {
    const fails = p.gates.filter((g) => g.status === 'fail');
    const passes = p.gates.filter((g) => g.status === 'pass');
    const skips = p.gates.filter((g) => g.status === 'skip');
    for (const g of fails) {
      failRows++; byGate[g.id] = (byGate[g.id] || 0) + 1;
      console.log(line(p.page, g.id, 'FAIL', `${g.name} · ${ctxText(g)} · ${g.summary}${g.offenders[0] ? ' · ' + g.offenders[0] : ''}`));
      if (opts.verbose) for (const o of g.all.slice(1, 8)) console.log(line('', '', '', '  ' + o));
    }
    if (opts.verbose) for (const g of [...passes, ...skips]) console.log(line(p.page, g.id, g.status, `${g.name} · ${g.summary}`));
    else {
      if (passes.length) console.log(line(p.page, 'rest', 'pass', `${passes.map((g) => g.id).join(' ')}${p.runs.length ? ` · ${p.runs.length} contexts` : ''}`));
      if (skips.length) console.log(line(p.page, 'skip', '—', skips.map((g) => `${g.id} (${g.summary})`).join(' · ')));
    }
    for (const w of p.warnings) console.log(line(p.page, 'warn', '!', w));
  }
  if (pending) {
    const linked = new Set(pagesOut.flatMap((p) => p.gates.find((g) => g.id === 'L-01')?.pending || []));
    const shownPending = relative(process.cwd(), opts.pending);
    console.log(line('pending', '', '·', `${pending.size} routes listed in ${shownPending}, ${linked.size} linked from this build (links to them are not failures)`));
    for (const r of pendingStale) { failRows++; byGate.PENDING = (byGate.PENDING || 0) + 1; console.log(line('pending', 'L-01', 'FAIL', `${r} is built now: remove it from ${shownPending}`)); }
  }
  const failingPages = pagesOut.filter((p) => p.gates.some((g) => g.status === 'fail')).length;
  const seconds = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`${pages.length} pages · ${jobs.length} rendered contexts · ${failRows} failing gate${failRows === 1 ? '' : 's'} on ${failingPages} page${failingPages === 1 ? '' : 's'}${failRows ? ' (' + Object.entries(byGate).map(([k, n]) => `${k}×${n}`).join(' ') + ')' : ''} · ${seconds} s`);

  // 5 · expectation (fixture self-test)
  let expectOk = null;
  if (opts.expect) {
    const exp = JSON.parse(readFileSync(resolve(opts.expect), 'utf8'));
    const problems = [];
    for (const p of pagesOut) {
      const want = exp[p.page];
      if (want === undefined) { problems.push(`${p.page}: no expectation recorded`); continue; }
      const wantMap = Array.isArray(want) ? Object.fromEntries(want.map((id) => [id, ''])) : want;
      const got = new Map(p.gates.filter((g) => g.status === 'fail').map((g) => [g.id, g]));
      for (const [id, needle] of Object.entries(wantMap)) {
        const g = got.get(id);
        if (!g) problems.push(`${p.page}: expected ${id} to fail, it ${p.gates.find((x) => x.id === id)?.status || 'did not run'}`);
        else for (const n of [].concat(needle || [])) if (![g.summary, ...g.all, ...g.offenders].some((o) => o.includes(n))) problems.push(`${p.page}: ${id} failed, but no offender mentions “${n}”`);
      }
      for (const id of got.keys()) if (!(id in wantMap)) problems.push(`${p.page}: ${id} failed unexpectedly · ${got.get(id).summary}`);
    }
    for (const k of Object.keys(exp)) if (!pagesOut.some((p) => p.page === k)) problems.push(`${k}: expected page not found`);
    expectOk = problems.length === 0;
    console.log(expectOk ? `expect · ${opts.expect}: every expected failure seen, nothing unexpected` : `expect · ${opts.expect}: ${problems.length} mismatch${problems.length === 1 ? '' : 'es'}`);
    for (const pr of problems) console.log('  ' + pr);
  }

  // 6 · JSON
  if (opts.json) {
    const out = resolve(opts.json);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify({
      dir: opts.dir, served: srv.url, startedAt: new Date(t0).toISOString(), seconds: Number(seconds),
      options: { widths: opts.widths, themes: opts.themes, axe: opts.axe, axeWidths, quick, pages: opts.pages, site: opts.site, base: opts.base || '/' },
      summary: { pages: pages.length, contexts: jobs.length, failingGates: failRows, failingPages, byGate, expectOk, pending: pending ? { file: opts.pending, routes: pending.size, stale: pendingStale } : null },
      pages: pagesOut.map((p) => ({ ...p, runs: p.runs.map((r) => ({ width: r.width, theme: r.theme, applied: r.applied, results: r.results })) })),
    }, null, 2));
    const shown = relative(process.cwd(), out);
    console.log(`json · ${shown && !shown.startsWith('..') ? shown : out}`);
  }
  process.exitCode = opts.expect ? (expectOk ? 0 : 1) : failRows ? 1 : 0;
} finally {
  await browser.close();
  await srv.close();
}
