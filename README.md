# Braga · portfolio v2

The second attempt at Rafael Braga-Kribitz's portfolio: a static Astro site built on the
v2 design system (ultramarine accent, BKribitz type, hairlines, IBCS charts), in English
and German, with no JavaScript on content pages.

## Run it locally

Requires Node 22 (`.nvmrc`) and git.

```bash
mkdir -p ~/Dev && cd ~/Dev
git clone https://github.com/RafaelBraga-Kribitz/braga-portfolio-v2.git
cd braga-portfolio-v2
npm ci
npm run dev            # http://localhost:4321/en/
```

The quality gates use Playwright's Chromium. Install it once per machine:

```bash
npx playwright install chromium
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serves `dist/` |
| `npm run check` | Astro and TypeScript diagnostics |
| `npm run lint` | No inline styles; no hex outside tokens, 12px floor, class contract, contrast table; `tokens.json` in step with `tokens.css` |
| `npm run test:unit` | Number/date formatting cases, the tool maths and the typed-input parser, with hand-computed references |
| `npm run test:gates` | Sixteen design gates (one accent per section and rules open, never close among them), links, hreflang, scripts policy and axe on every built page, at six widths in both themes |
| `npm run vault:check` | Audits the vault: broken links and embeds, missing translations, bad properties, Dataview queries that do not parse |
| `npm run tokens:export` | Writes `design-system/tokens.json` from `tokens.css` |
| `npm run vault:sync` | Copies the design-system CSS into the vault's Obsidian snippets |
| `npm run activity` | Refreshes the project build logs' data (`src/data/activity.json`) from each project repository's git history; a ```` ```buildlog ```` fence in a project note draws it |
| `npm run verify` | All of the above in order |

## Where things are

| Path | Holds |
|---|---|
| `design-system/` | The design system of record (v2.1): the stylesheets, `tokens.json` for tools outside the site, and `DECISIONS.md` (what changed since the handoff, and the rules for README banners, diagrams and charts). Start with its README. |
| `vault/` | The content as an Obsidian vault: projects, essays, notes, pages and legal pages (EN and DE), attachments, templates. Open it in Obsidian; start with `vault/_guide/Start here.md`. Only notes with `publish: true` reach the site. |
| `src/pages/` | Routes for both language trees (`/en/`, `/de/`). |
| `src/components/`, `src/layouts/` | The site patterns (shell, cover, listing, document, evidence figure, bench) and the base layout. |
| `src/lib/` | Routes, chrome strings (i18n), formatting by language, the Markdown pipeline, tool maths. |
| `scripts/gates/`, `scripts/lint/` | The gates runner and the lint rules. |
| `handoff/` | The design handoff as received: decisions, audit, specimens, v2 tokens, source content. Read-only; superseded where `design-system/DECISIONS.md` says otherwise. |
| `BUILD-BRIEF.md`, `docs/PAGE-BRIEF.md` | The working briefs the build follows. |

## How work flows between the cloud session and this repository

- `main` holds states that build and pass `npm run verify`.
- Work in progress from the cloud session is pushed to `build/*` branches, each with a
  draft pull request. Review there, then merge into `main`.
- Work locally on your own branch; the cloud session pulls `main` before it starts a new
  step, so local changes are never overwritten.
