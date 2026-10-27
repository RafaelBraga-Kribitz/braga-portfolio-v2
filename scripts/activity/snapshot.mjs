// scripts/activity/snapshot.mjs — the build log's data (owner, 26 Oct 2026).
//
// For every published project note with a `repository:` on GitHub, reads the
// repository's history with git (a bare clone in .cache/activity/, fetched
// again on each run; no API, no token) and writes src/data/activity.json:
// commits per weekday × hour and per day, merged pull requests, and the
// hand-written lines added by kind. The file is committed, so a build never
// needs the network; `npm run activity` refreshes it, and the Pages workflow
// runs it before the build (a failure there keeps the committed file).
//
// What counts:
//   commits   the default branch, merges left out, bots left out (BOTS)
//   time      the author's timestamp in Europe/Vienna
//   lines     lines added by kind (KINDS); data, generated files, figures,
//             notebooks and lockfiles are left out, so the count is what a
//             person wrote
//
//   node scripts/activity/snapshot.mjs [--offline]   (--offline: no fetch)

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CACHE = join(root, '.cache/activity');
const OUT = join(root, 'src/data/activity.json');
const VAULT = join(root, 'vault/Projects');
const TZ = 'Europe/Vienna';
const BOTS = /\[bot\]$|^governance-sync-bot$|^github-actions$|^dependabot$/i;
const offline = process.argv.includes('--offline');

// first match wins; a path that matches none is not counted
const KINDS = [
  ['tests', (p) => /(^|\/)(tests?|__tests__|spec)\//.test(p) || /(^|\/)(test_[^/]+|[^/]+_test)\.[a-z]+$|\.(test|spec)\.[a-z]+$/.test(p)],
  ['ci', (p) => /^\.github\//.test(p) || /(^|\/)(Dockerfile|Makefile|pyproject\.toml|setup\.cfg|tox\.ini|\.pre-commit-config\.yaml|requirements[^/]*\.txt)$/.test(p)],
  ['docs', (p) => /\.(md|qmd|rst|cff)$/i.test(p)],
  ['code', (p) => /\.(py|r|sql|js|mjs|ts|tsx|jsx|sh|jl|scala|go|rs)$/i.test(p)],
];

const git = (dir, args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 });

/** Published project notes with a GitHub repository: slug → repository URL. */
function projects() {
  const out = new Map();
  for (const lang of readdirSync(VAULT)) {
    const dir = join(VAULT, lang);
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
      const m = /^---\n([\s\S]*?)\n---/.exec(readFileSync(join(dir, f), 'utf8'));
      if (!m) continue;
      const fm = parse(m[1]);
      if (fm.publish !== true || !fm.slug || !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(fm.repository ?? '')) continue;
      out.set(fm.slug, fm.repository.replace(/\/$/, ''));
    }
  }
  return out;
}

function sync(url) {
  const dir = join(CACHE, url.replace(/^https:\/\/github\.com\//, '').replace('/', '__') + '.git');
  if (offline) {
    if (!existsSync(dir)) throw new Error(`no cached clone of ${url} (run without --offline)`);
  } else if (existsSync(dir)) {
    git(dir, ['fetch', '--quiet', '--prune', 'origin', '+refs/heads/*:refs/heads/*']);
  } else {
    mkdirSync(CACHE, { recursive: true });
    execFileSync('git', ['clone', '--quiet', '--bare', url, dir]);
  }
  return dir;
}

const viennaParts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23', weekday: 'short' });
const WEEKDAY = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
function local(iso) {
  const p = Object.fromEntries(viennaParts.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, weekday: WEEKDAY[p.weekday], hour: Number(p.hour) };
}

function read(dir) {
  const head = git(dir, ['rev-parse', 'HEAD']).trim();
  const prs = git(dir, ['log', '--merges', '--format=%s', 'HEAD']).split('\n').filter((s) => /^Merge pull request #\d+/.test(s)).length;
  const log = git(dir, ['log', '--no-merges', '--numstat', '--format=@%aI%x09%an', 'HEAD']);
  const weekHour = Array.from({ length: 7 }, () => Array(24).fill(0));
  const daily = {};
  const lines = Object.fromEntries(KINDS.map(([k]) => [k, 0]));
  let commits = 0, bot = false;
  for (const row of log.split('\n')) {
    if (row.startsWith('@')) {
      const [iso, author] = row.slice(1).split('\t');
      bot = BOTS.test(author);
      if (bot) continue;
      commits++;
      const t = local(iso);
      weekHour[t.weekday][t.hour]++;
      daily[t.day] = (daily[t.day] ?? 0) + 1;
    } else if (row && !bot) {
      const [add, , path] = row.split('\t');
      if (add === '-') continue; // binary
      const kind = KINDS.find(([, test]) => test(path));
      if (kind) lines[kind[0]] += Number(add);
    }
  }
  const days = Object.keys(daily).sort();
  return { head, commits, prs, first: days[0], last: days.at(-1), activeDays: days.length, weekHour, daily: Object.fromEntries(days.map((d) => [d, daily[d]])), lines };
}

const out = { generated: new Date().toISOString().slice(0, 10), timeZone: TZ, projects: {} };
for (const [slug, url] of [...projects()].sort()) {
  out.projects[slug] = { repository: url, ...read(sync(url)) };
  const p = out.projects[slug];
  console.log(`${slug}: ${p.commits} commits, ${p.prs} pull requests, ${p.first} → ${p.last}`);
}
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
console.log(`wrote ${OUT.slice(root.length + 1)}`);
