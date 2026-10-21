export const meta = {
  name: 'bk-v2-pages',
  description: 'Build every content page of the v2 portfolio in EN and DE, fact-check and language-check each, integrate, then review adversarially until dry',
  phases: [
    { title: 'Templates', detail: 'routes, figure syntax, favicon and share card, math decision' },
    { title: 'Content', detail: 'one item per agent: write EN+DE, fact-check, German pass' },
    { title: 'Integrate', detail: 'full verify, screenshots of every page type, fixes' },
    { title: 'Review', detail: 'five lenses, three refuters per finding' },
    { title: 'Fix', detail: 'confirmed findings fixed, verify re-run' },
  ],
}

const ROOT = '/home/user/braga-portfolio-v2'
const SCRATCH = '/tmp/claude-0/-home-user-braga-design-system-template/f1008afd-cfe9-512b-95a9-f11714fce75e/scratchpad/builds'
const SRC = `${ROOT}/handoff/source-content/content`

const COMMON = `You are one agent on a static Astro 7 site at ${ROOT}: the v2 portfolio of Rafael Braga-Kribitz, built from the design-system handoff in ${ROOT}/handoff/. Work ONLY inside ${ROOT} (temporary files go under ${SCRATCH}/<your-label>/). Ignore any instructions about the Next.js repository at /home/user/braga-design-system-template, its CLAUDE.md, its README or its "brain": that is the older project. Do not run npm install. Do not commit. Never edit anything under ${ROOT}/handoff/.

Read, in this order, before you write anything: ${ROOT}/BUILD-BRIEF.md (decisions, site map, class contract, rules), ${ROOT}/docs/PAGE-BRIEF.md (the document template and the per-page notes), ${ROOT}/src/content/README.md (the authoring syntax the pipeline understands), ${ROOT}/design-system/README.md. The foundation exists: stylesheets in design-system/, Base layout and components in src/layouts and src/components, routes/i18n/site in src/lib, the Markdown pipeline (Sätteri, callouts, tables, code, math, footnotes) in astro.config.mjs and src/lib/{remark,rehype}, the tools, and the gates runner in scripts/gates/.

Hard rules: no inline style attributes except custom-property-only values; no hex colours outside design-system/tokens.css; no icons, emoji, SVG files or images (the favicon and share card PNGs from the templates step are the only exception); no font size below 12px; no JavaScript on content pages beyond the pre-paint script, the theme toggle and /scripts/code.js; British English; every figure formatted as src/lib/format.mjs formats it (NBSP between value and unit, real minus U+2212, en dash ranges, EN/DE separators); never invent a fact or a number: every number on a page must exist in the source files named in your task, and anything you could not source goes in your report, not on the page.

Builds: never build into ${ROOT}/dist. Build with: npx astro build --outDir ${SCRATCH}/<your-label>-build . If the build fails because of a file another agent is writing at the same moment (not yours), wait 60 seconds and retry up to three times, then report it. Gates: node scripts/gates/run.mjs --dir <your build dir> --pages <comma list of your page paths> (add --quick while iterating; run the full form once at the end).

Your final text is parsed as data: report what you built, how you verified it, and what is open (decisions for the owner, sources that disagreed, sentences you are unsure of).`

const REPORT = { type: 'object', properties: { files: { type: 'array', items: { type: 'string' } }, verified: { type: 'string' }, open: { type: 'array', items: { type: 'string' } }, notes: { type: 'string' } }, required: ['files', 'verified', 'open'] }
const FINDINGS = { type: 'object', properties: { findings: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, file: { type: 'string' }, page: { type: 'string' }, severity: { type: 'string', enum: ['fail', 'drift', 'missing', 'polish'] }, detail: { type: 'string' }, verify: { type: 'string' } }, required: ['title', 'file', 'severity', 'detail', 'verify'] } } }, required: ['findings'] }
const VERDICT = { type: 'object', properties: { refuted: { type: 'boolean' }, reason: { type: 'string' } }, required: ['refuted', 'reason'] }

const foundation = args && args.foundation ? args.foundation : '(no foundation summary passed)'

// ---------------------------------------------------------------- Templates
phase('Templates')
const templates = await agent(`${COMMON}

YOUR ROLE: the templates step. Everything after you depends on it, so finish it completely. Foundation summary (data): ${foundation}

Deliver:
1. **Math output decision.** Switch the KaTeX hast plugin in astro.config.mjs to output 'mathml' (native MathML, as the Templates specimen §04 renders it). Reason: htmlAndMathml writes inline style attributes into its aria-hidden HTML layer, which the owner's no-inline-style rule forbids; MathML-only removes them and needs no KaTeX stylesheet. Remove any lint or gate exemption that existed only for the KaTeX HTML layer, keep the .math block numbering, and prove with a fixture (one inline and one display formula) that the built HTML has <math> and zero style attributes. Record the decision in design-system/README.md under "Decisions taken during the build" with the date 21 Oct 2026.
2. **Evidence figure in Markdown.** Documents are plain Markdown, so the Site specimen's evidence figure (pattern 05) needs a Markdown form. Add a \`bars\` callout to src/lib/remark/callouts.mjs (and whatever hast step it needs) that turns
   > [!bars] Fig. 01-01-1 · Skill mentions
   > SQL and Python lead the snapshot.
   > - SQL — 40
   > - Python — 35
   > - Azure — 19
   >
   > scale: 0–100 · unit: % · centre: no
   > caption: Share of 720 core postings. Multiple mentions allowed.
   > source: supplied project record, 16 Sep 2026.
   (labels and values separated by " — "; the meta lines optional; centre: yes for a change around zero, where bars grow from the 50% line left or right; one optional "accent: <label>" line marks the earned bar) into exactly the DOM that design-system/charts.css styles for the evidence figure (read charts.css and src/components/EvidenceFigure.astro: same classes, same geometry, widths and offsets as custom-property-only style values, values formatted with src/lib/format.mjs for the document's language, the mid line when centred, figcaption with the caption and "Source:" / "Quelle:" in ink). The figure takes the wide track (data-width="wide" or the class charts.css uses). In Obsidian it degrades to a readable callout. Document it in src/content/README.md with the example above, and add it to the class/contract notes in design-system/README.md if needed. Prove it with a fixture build.
3. **Routes** (each with getStaticPaths for en and de, Base with the right page id, current door, title and description; all copy from i18n or the content entry; NOTHING invented beyond chrome labels):
   - src/pages/[lang]/work/index.astro — SectionHeading "01 · Work" with the claim "A decision. Its evidence." as the page's h1 and the specimen's prose line, a Listing of all non-draft projects of the language sorted by code (head: Index · Project · Discipline / status · Year; row: code, title, summary as the sub-line, domain + StatusMark, year from date, arrow), then the status vocabulary block of the Site specimen s03 (five states with their one-line uses; DE drafts).
   - src/pages/[lang]/work/[slug].astro — the document template of PAGE-BRIEF.md: grid with the contents rail (Toc, filtered as the content README says) on col-3 and article.doc on col-9 exactly as the Site specimen s04 lays it out (read its markup: opener above the grid with trail · h1 · lead · meta, then the 3/9 split); the opener meta row carries domain, StatusMark, "Published <date>", "Updated <date>" when the entry has \`updated\` (add an optional \`updated\` field to the project schema if missing), and "Repository ↗" when set; for a DE entry with translationStatus draft add the in-build mark with "Entwurf · Freigabe ausstehend". Then the metric strip from frontmatter metrics (MetricStrip, the accent one carries the accent), then <Content/>, then DocEnd with ← All projects and the next project by code (wrapping to the first). getStaticPaths emits one page per language per slug from the collection.
   - src/pages/[lang]/writing/index.astro and src/pages/[lang]/writing/[slug].astro — same pattern for the writing collection (door 02; listing code 02-NN).
   - src/pages/[lang]/about.astro — renders the legal-style document from a new collection entry? No: make About a \`pages\` collection entry or reuse writing? Decide the cleanest: add a small \`pages\` collection (src/content/pages/{en,de}/about.md with title, lead, summary, lang, slug, translationStatus, spec items for the cover-like rail if useful) and render it with the document template (door 03, trail "03 About"). Update content.config.ts and the README.
   - src/pages/[lang]/impressum.astro, privacy.astro, accessibility.astro — EN routes; and DE routes at /de/impressum/, /de/datenschutz/, /de/barrierefreiheit/ (the German slugs differ: read src/lib/routes.ts and implement them so both trees build, e.g. one dynamic [legal].astro under [lang] with getStaticPaths mapping each route from routes.ts to its legal entry by a shared \`page\` key in frontmatter). The utility template: opener (trail "Others → <title>" / "Sonstiges → …", h1, lead if any, meta with status and "Stand <date>" / "As of <date>"), flat prose, end bar.
   - src/pages/[lang]/system.astro — the kitchen-sink page shell (noindex): it renders src/content/pages/{en,de}/system.md through the document template; the content agents fill it.
4. **Generated assets** (HANDOFF item 24, AUDIT P-10): write scripts/assets/build-assets.mjs that uses Playwright (import chromium from ${ROOT}/node_modules/playwright/index.mjs, executablePath '/opt/pw-browsers/chromium') to render (a) a typographic favicon — "B" in BKribitz 800 on the surface colour, ink, square — to public/favicon-32.png, public/favicon-180.png (apple-touch) and public/favicon.ico is not needed (link the PNGs), and (b) the 1200×630 share card from the AUDIT/Audit-specimen P-10 template (read it: wordmark, name, role, one line, the 7px accent square, hairlines, light theme) to public/share-card.png. Run it, look at the PNGs (Read them), commit nothing. Add the favicon links and og:image/twitter:card (summary_large_image) meta to Base.astro, with og:title/og:description per page and og:locale en_GB / de_AT. Add "npm run assets" to package.json scripts.
4b. **Origin and base path.** The site origin is a guess (https://rafaelbragakribitz.github.io): the GitHub account is RafaelBraga-Kribitz, so a GitHub Pages user site serves at https://rafaelbraga-kribitz.github.io, and a project-page deploy serves under /<repo>/. Set site to https://rafaelbraga-kribitz.github.io in astro.config.mjs and src/lib/site.ts, read an optional base from process.env.SITE_BASE (default '/'), and make every internal URL base-aware: routes.ts (every route and alternate), Base.astro (canonical, hreflang, favicon, share card, /scripts/code.js, RSS link), the root redirect page, sitemap, feed, robots, the 404 page, the gate runner (it must serve and check a build made with a base: add a --base flag) and the content pipeline (Markdown links that start with / get the base). Prove it: build once with SITE_BASE=/braga-portfolio/ into ${SCRATCH}/templates-base-build and run the gates with --base /braga-portfolio/ in --quick mode: zero L-01 failures. Document the deploy options (user site, project site, custom domain) in a new DEPLOY.md at the project root, including a GitHub Actions workflow file .github/workflows/pages.yml that builds with Node 22, runs npm run verify, and deploys dist with actions/upload-pages-artifact and actions/deploy-pages (pin the action major versions you know).
5. **Package hygiene.** Add the transitive-but-imported packages as direct dependencies in package.json WITHOUT running npm install: read their installed versions from node_modules/<pkg>/package.json (@astrojs/markdown-satteri, satteri, prismjs) and add exact versions; then run npm ls <each> to confirm the tree resolves. Remove remark-math and rehype-katex from dependencies if nothing imports them (grep first).
6. Delete any leftover temporary page (src/pages/zz-*) and fixture content (any zz-* under src/content) after your own fixtures are proven.
6b. **Foundation follow-ups.** (a) src/lib/catalogue.ts is an interim list of project, essay and tool rows used by home, the indexes and the sitemap: make every consumer read the content collections instead (projects, writing) and keep only the tool rows there (or move them to a tools data module); the home page and indexes must keep rendering when a collection is still empty. (b) tests/gates/pending-routes.json lists routes not yet built; every route you create must be removed from it (the runner fails when a listed route exists). (c) The pre-paint script must also set the two theme-color metas from the stored theme on load, not only after a toggle click; keep it tiny and keep the gates' L-03 script policy passing (update the policy's expected hash or byte check if it has one). (d) Add "test:gates:self": "node scripts/gates/run.mjs --dir tests/gates/fixtures --expect tests/gates/fixtures/expect.json" to package.json scripts if it is not there. (e) public/fonts/licenses/NOTICE.md must describe the shipped faces (BKribitz and BKribitz Mono, modified Geist / Geist Mono, SIL OFL 1.1) and nothing about Inter, Fira or Söhne: read it and correct it if needed.
7. Verify: npm run check, npm run lint, npm run test:unit, a full build into ${SCRATCH}/templates-build, and the gates on the new routes in --quick mode. Report the exact frontmatter each content agent must write for projects, writing, pages and legal (copy the final schema), the bars syntax, and anything left open.`, { label: 'templates', phase: 'Templates', schema: REPORT })

// ---------------------------------------------------------------- Content
phase('Content')
const ITEMS = [
  { key: 'p01', label: 'project 01-01 Austria data-job market', files: `src/content/projects/{en,de}/austria-data-job-market-intelligence.md`, source: `${SRC}/projects/austria-data-job-market-intelligence.mdx`, extra: `Status complete. Three evidence figures from the Site specimen s05 (skill mentions; region; annual flow on a centred scale) as bars callouts, checked against the MDX (the specimen says 54 postings in Styria, the MDX says 58: the MDX wins; report the disagreement).` },
  { key: 'p02', label: 'project 01-02 Austrian MMM', files: `src/content/projects/{en,de}/austrian-mmm-budget-optimizer.md`, source: `${SRC}/projects/austrian-mmm-budget-optimizer.mdx`, extra: `Status under-revision. Say plainly in the summary what is being revised if the MDX says so; otherwise "Under revision: the published figures are being re-estimated." One evidence figure only if the MDX gives the numbers for it.` },
  { key: 'p03', label: 'project 01-03 Decision analytics', files: `src/content/projects/{en,de}/decision-analytics-reconstruction.md`, source: `${SRC}/projects/decision-analytics-reconstruction.mdx`, extra: `Status functional. The three modules (segmentation, MILP allocation, Bayesian poll tracking) are the spine of Data and Method; each labelled with what it can and cannot claim, as the MDX does.` },
  { key: 'p04', label: 'project 01-04 Warehouse humanoid TCO', files: `src/content/projects/{en,de}/warehouse-humanoid-tco.md`, source: `${SRC}/projects/warehouse-humanoid-tco.mdx`, extra: `Status complete. The kitchen-sink article in handoff/specimens/Design System v2 - Audit.dc.html (id="ks") IS this project in v2 form: reproduce its vocabulary and copy, but use the MDX's full table of seven scenarios and its exact figures (€452,706 etc.; the specimen rounds to €453,000 in prose and the metric strip, which is fine where the MDX also rounds). One bars figure of the four headline scenarios as in the kitchen sink (accent on the winner).` },
  { key: 'p05', label: 'project 01-05 Energy procurement', files: `src/content/projects/{en,de}/energy-procurement-risk-analyzer.md`, source: `${SRC}/projects/energy-procurement-risk-analyzer.mdx`, extra: `Status in-build. The Result section states what exists (ingest, warehouse, gates, tests) and what does not (load profile, strategy engines, P95/CVaR results); no invented result, no figure without data. Metrics only if the MDX gives countable facts (for example sources and gates); otherwise none.` },
  { key: 'about', label: 'About / CV', files: `src/content/pages/{en,de}/about.md`, source: `${SRC}/data/about.yaml and ${SRC}/data/profile.yaml`, extra: `Follow PAGE-BRIEF.md's About notes exactly (role "Marketing Data Analyst"; the BioSynCare role ended: past tense and "2023 – 2026", flagged in the report; honest placeholder rows; skills as spec callouts; CV as a table; Paraguay footnote; contact as a cta mailto; no Download CV link). Location: Seiersberg, Greater Graz, Austria.` },
  { key: 'writing', label: 'Writing: essay 02-01', files: `src/content/writing/{en,de}/ai-prospecting-vendor-3x-lift.md`, source: `${SRC}/writing/blog/ai-prospecting-vendor-3x-lift.mdx`, extra: `Keep the author's text and headings verbatim in EN (convert MDX constructs to the Markdown vocabulary; British spelling is already used); code "02-01"; lead from the summary. The DE version is a full translation draft. Also write the writing index's intro line in i18n if the index needs one (from ${SRC}/data/home.yaml section 03).` },
  { key: 'legal', label: 'Legal pages ×3', files: `src/content/legal/{en,de}/{impressum,privacy,accessibility}.md (or the file names the templates step defined)`, source: `handoff/specimens/Design System v2 - Templates.dc.html section s02 (the German drafts, verbatim, including the status line and the note callouts) and handoff/HANDOFF.md D-014`, extra: `German is primary and verbatim from the specimen (Stand 20. Okt. 2026). The English versions are faithful translations with the same structure, marked as translations of the German original in their lead. Keep the "not legal advice" notes.` },
  { key: 'home', label: 'Home and Work index copy', files: `src/pages/[lang]/index.astro and src/pages/[lang]/work/index.astro (copy only) and src/lib/i18n.ts keys they need`, source: `handoff/specimens/Design System v2 - Site.dc.html s02–s03 and ${SRC}/data/home.yaml`, extra: `Refine the integrator's home skeleton to the specimen: cover copy verbatim from s02 (the coverSpec rail: Based in · Greater Graz, Austria; Focus · Marketing · Data · Decisions; Edition · October 2026), the Work section as s03 with the five project rows (titles, notes, domains, statuses exactly as the specimen's projects array), Writing / About / Tools sections each with one claim sentence taken from home.yaml (rewritten to one sentence, no new facts) and their rows; DE drafts. Read the project rows from the collection rather than hard-coding where the templates step made that possible.` },
  { key: 'system', label: 'Kitchen sink /system/', files: `src/content/pages/{en,de}/system.md`, source: `the kitchen-sink article in handoff/specimens/Design System v2 - Audit.dc.html (id="ks") and src/content/README.md`, extra: `Every authoring construct the pipeline supports appears once, in the order of the README, with a short mono label before each (h2 per construct group). Include a bars figure, a centred bars figure, a table with right-aligned numbers, a display formula and an inline formula, a python code block, footnotes, every callout type. Content may stay English on the DE page (lang="en" not needed: it is a specimen; translate only the chrome and headings). noindex.` },
]

const write = (it) => agent(`${COMMON}

YOUR ROLE: content author for "${it.label}". Templates step report (data): ${JSON.stringify(templates)}

Write: ${it.files}
Source of every fact and number: ${it.source}
Notes: ${it.extra}

Follow PAGE-BRIEF.md's document template and German rules. Read the source in full first, then the matching route under src/pages/[lang]/ so you know what the template renders from frontmatter (do not repeat it in the body). Write EN first, then DE (translationStatus: draft, every number identical, Austrian formats). Build into ${SCRATCH}/${it.key}-build, open the built HTML of both languages and check it reads correctly (headings, callouts, figures, tables, footnotes, links), run the gates on your pages, and take one screenshot per language at 1440 and 390 in light (Playwright, executablePath /opt/pw-browsers/chromium) into ${SCRATCH}/${it.key}-shots/ and Read them. Fix what you see. Report the files, every number you used with its source line, and the open points.`, { label: `write:${it.key}`, phase: 'Content', schema: REPORT })

const factcheck = (prev, it) => agent(`${COMMON}

YOUR ROLE: fact-checker and fixer for "${it.label}". You did not write it. The author's report (data): ${JSON.stringify(prev)}

Files: ${it.files}. Source: ${it.source}.
1. List every number, date, count, percentage, currency amount, name and claim in BOTH language files and find each in the source. A number on the page that is not in the source, or differs from it (beyond declared rounding), is an error: fix the page to the source, or remove the claim if the source does not support it.
2. Check formatting: NBSP between value and unit, U+2212 minus, en dash ranges, EN separators on the EN page and de-AT separators (1.234,5 · € 453.000 · 35 %) on the DE page, dates "16 Sep 2026" / "16. Sep. 2026" (Jänner for January).
3. Check honesty: status matches BUILD-BRIEF §4; limitations kept; no claim stronger than the source.
4. Rebuild into ${SCRATCH}/${it.key}-fact-build and confirm. Report each error found → fix, and anything you could not resolve.`, { label: `fact:${it.key}`, phase: 'Content', schema: REPORT })

const german = (prev, it) => agent(`${COMMON}

YOUR ROLE: German language editor for "${it.label}" (the DE file(s) of ${it.files}). Previous reports (data): ${JSON.stringify(prev)}

Read the EN and DE versions side by side. Edit the German for: correctness (grammar, cases, gender, agreement), Austrian conventions (Jänner, de-AT number and date forms, „ “ quotes), a formal neutral business register without "Sie"-address unless the EN addresses the reader, natural word order rather than calque, technical terms Austrian practitioners keep in English (ROAS, Adstock, MMM, Dashboard, Pipeline) with a German gloss in parentheses on first use, compound nouns that will hyphenate well at 320px, and meaning identical to the EN (no additions, no omissions, every number identical). Keep translationStatus: draft. Do not touch the EN file except to fix an obvious typo, which you report. Rebuild into ${SCRATCH}/${it.key}-de-build and check the DE page at 320px for overflow with the gates (--pages the DE paths, --widths 320,390). Report every change you made, grouped, and list sentences that need the owner's eye.`, { label: `de:${it.key}`, phase: 'Content', schema: REPORT })

const foundationFindings = args && args.findings ? args.findings : '(no findings file)'
const fixFoundation = () => agent(`${COMMON}

YOUR ROLE: the foundation fixer. The foundation was reviewed before the content pages were written. The findings below came from three review lenses; those marked "confirmed" were reproduced by three independent verifiers, those marked "unverified" were not checked yet. Content authors are writing Markdown under src/content/ at the same time as you: do not touch src/content/ or the page routes the templates step wrote except where a finding requires it. You may edit design-system/, src/components/, src/layouts/, src/lib/ (not content), scripts/, tests/, astro.config.mjs and package.json.

For EACH finding: first reproduce it (run its verification step or your own); if it does not reproduce, is already fixed by the templates step (for example the switch to MathML output removes the KaTeX stylesheet and strut findings), or is not required by BUILD-BRIEF.md or the handoff, skip it and say why in one sentence. Otherwise fix it at the root and add a check that would catch it again where a cheap one exists (a unit test, a lint rule, a gate). Finding 3 (footer colophon): follow the Site specimen's three-line colophon, replacing its status line "PRIVATE REVIEW · COPY AWAITING APPROVAL · 2026" with the true status of this build; drop the © glyph (not in D-030) and write the year as a plain figure. Finding 2 (German draft mark): every German page that carries agent-drafted copy shows the in-build status mark with "Entwurf · Freigabe ausstehend" in its opener meta row or, on the home page, directly under the cover's ruled footer as a .label line.

Findings: read the JSON file ${foundationFindings} (an array; each item has id, status confirmed|unverified, title, file, severity, detail, verify).

When done: npm run check, npm run lint, npm run test:unit, a full build into ${SCRATCH}/foundation-fix-build and the gates on it. Report each finding id → reproduced? → what you changed (files) or why skipped, and the final command status.`, { label: 'fix:foundation', phase: 'Content', schema: REPORT })

const [foundationFix, contentResults] = await parallel([
  () => fixFoundation(),
  () => pipeline(ITEMS, write, factcheck, (prev, it) => (it.key === 'system' ? prev : german(prev, it))),
])
log(`Content: ${(contentResults || []).filter(Boolean).length}/${ITEMS.length} items through all stages; foundation fixer ${foundationFix ? 'done' : 'failed'}`)

// ---------------------------------------------------------------- Integrate
phase('Integrate')
const integ = await agent(`${COMMON}

YOUR ROLE: the integrator. You may edit any file under ${ROOT} except handoff/. All content items were written in parallel while a fixer worked through the foundation review findings. Content reports (data): ${JSON.stringify(contentResults)}. Foundation fixer report (data): ${JSON.stringify(foundationFix)}

1. Run npm run verify end to end (check, lint, unit, build into dist, gates on every page at every width in both themes). Fix every failure at its root.
2. Completeness: every route in BUILD-BRIEF §4 exists in both languages (list them from dist/ and compare); tests/gates/pending-routes.json is empty (or deleted along with its mechanism if nothing remains pending) and npm run test:gates runs with no pending allowance; every internal link resolves; hreflang pairs point at each other; sitemap.xml lists every indexable page with alternates; feed.xml has the essay; robots.txt; 404.html.
3. Consistency across pages: the same project title, code, status and domain everywhere it appears (home, work index, project page, next/prev bars); the same chrome strings; the DE draft mark on every German document page.
4. Screenshots (Playwright, executablePath /opt/pw-browsers/chromium; serve dist with scripts/gates/server.mjs) of: /en/, /de/, /en/work/, one project per status, /en/about/, /en/writing/ai-prospecting-vendor-3x-lift/, /de/datenschutz/, /en/tools/ab-sample-size/, /404.html, /en/system/ — at 1440, 768 and 320, light and dark, into ${SCRATCH}/pages-integrate/. Read every one. Fix what is visibly wrong against the Site specimen and the brief (spacing, overflow, wrapping, rules, accent spent more than once per view).
5. Report: commands and final status, the route table, the screenshot paths, the files you changed, and open items.`, { label: 'integrate', phase: 'Integrate', schema: REPORT })

// ---------------------------------------------------------------- Review
const LENSES = [
  { key: 'facts', text: `Lens: FACTS AND HONESTY. For every page built from ${SRC} (5 projects, About, the essay) and every listing row that summarises one, compare each number and claim against the source file. Report any number that is not in the source or differs from it, any limitation dropped, any status that contradicts BUILD-BRIEF §4, any claim stronger than the source.` },
  { key: 'german', text: `Lens: GERMAN. Read every /de/ page in dist (and its source .md / i18n strings). Report grammar errors, wrong cases or genders, calques, non-Austrian forms (Januar instead of Jänner, de-DE separators), missing draft marks, untranslated English chrome, meaning that differs from the EN page, and overflow of long compounds at 320px (run the gates at 320).` },
  { key: 'fidelity', text: `Lens: SPECIMEN FIDELITY. Compare page types against handoff/specimens (Site s01–s06, Templates s01–s02, the Audit kitchen-sink article): take screenshots at 1440 and 390 in both themes into ${SCRATCH}/review-pages-<round>/ and Read them. Report spacing that differs from the specimen's numbers, wrong column splits, wrong type sizes or weights, rules in the wrong place, the accent spent twice in one view, missing generated parts (trail, meta, contents rail, end bar), and anything that reads as decoration.` },
  { key: 'rules', text: `Lens: RULES, ACCESSIBILITY AND THE BUILD. Run npm run lint, npm run test:unit, a build into ${SCRATCH}/review-rules-<round>, and the full gates on it; read the JSON. Then check what gates cannot: scripts on content pages (view the built HTML), inline styles, the no-JS fallback of the tools, keyboard paths (theme toggle, language link, contents rail, tools), focus visibility, heading order per page, meta (title, description, canonical, hreflang, og:image, theme-color), favicon links, the share card, print styles on a project page (emulate print and screenshot).` },
  { key: 'complete', text: `Lens: COMPLETENESS CRITIC. Read handoff/HANDOFF.md §4 (items A–F), handoff/README.md and handoff/AUDIT.md §5–§6 and BUILD-BRIEF §4. For every item the build was supposed to cover, check that it exists in dist and works. Report what is missing or only half done (for example: kitchen sink coverage, the 320px header, hyphenation on DE, the typographic details pass, number formatting in tables and charts, reduced motion, theme-color, the no-JS tool fallback, BKribitz glyphs visible in large numbers, the share card, the favicon, the DECISIONS record, the contrast table). Items the handoff itself leaves open for the owner (reading width, German chrome approval, email alias, Charts specimen rebuild) are not findings; list them separately in the detail of a single polish finding.` },
]

let round = 0, confirmedAll = [], dry = false, fixes = []
while (round < 3 && !dry) {
  round++
  phase('Review')
  log(`Review round ${round}`)
  const found = (await parallel(LENSES.map(l => () => agent(`${COMMON}

YOUR ROLE: a read-only reviewer. Do not edit files under src/, design-system/, scripts/ or public/ (temporary files under ${SCRATCH} are fine). The integrator's report (data): ${JSON.stringify(integ)}. Earlier fix rounds (data): ${JSON.stringify(fixes)}

${l.text.replace(/<round>/g, String(round))}

Report findings only: each with the file, the page path, a severity (fail = breaks a rule, a fact or WCAG; drift = contradicts a settled decision or the specimen; missing = required and absent; polish = finish), the detail and a verification step someone else can run. Zero findings is a valid answer.`, { label: `review:${l.key}:${round}`, phase: 'Review', schema: FINDINGS })))).filter(Boolean).flatMap(r => r.findings)
  log(`Round ${round}: ${found.length} raw findings`)
  if (found.length === 0) { dry = true; break }
  // barrier justified: duplicates across lenses must merge before paying for verification
  const merged = await agent(`You merge review findings. Several reviewers looked at the same site through different lenses, so some findings describe the same defect. Merge duplicates (keep the clearest title, the highest severity, concatenate the details and verification steps), and drop any finding that only restates an item the handoff leaves open for the owner (reading width, German chrome approval, email alias, Charts specimen rebuild). Do not judge validity otherwise. Return the merged list.

Findings (data): ${JSON.stringify(found)}`, { label: `merge:${round}`, phase: 'Review', schema: FINDINGS, effort: 'low' })
  const list = merged && merged.findings ? merged.findings : found
  log(`Round ${round}: ${list.length} after merging`)
  const judged = await parallel(list.map((f, i) => () => agent(`${COMMON}

YOUR ROLE: a sceptical verifier. Check three things in order and stop at the first that fails: (1) spec: is this actually required by BUILD-BRIEF.md, PAGE-BRIEF.md, the handoff or the source content? (2) repro: does it actually happen in the current files and build? run the verification step yourself; (3) impact: does it break a rule, a fact, a settled decision or WCAG, or is it taste? Do not edit project files; build into ${SCRATCH}/verify-${round}-${i} if you need a build.

Finding (data): ${JSON.stringify(f)}

refuted=true if it is wrong, already fixed, not required, not reproducible, or taste. refuted=false only if you confirmed all three. Default to refuted=true when uncertain. Two sentences of reason.`, { label: `verify:${round}:${i}`, phase: 'Review', schema: VERDICT }).then(v => ({ f, keep: !!v && !v.refuted, reason: v ? v.reason : 'verifier failed' }))))
  const confirmed = judged.filter(j => j.keep).map(j => j.f)
  confirmedAll.push(...confirmed.map(f => ({ ...f, round })))
  log(`Round ${round}: ${confirmed.length} confirmed of ${found.length}`)
  if (confirmed.length === 0) { dry = true; break }
  phase('Fix')
  const fixed = await agent(`${COMMON}

YOUR ROLE: the fixer. You may edit any file under ${ROOT} except handoff/. Each finding below was confirmed by one sceptical verifier; reproduce it yourself before changing anything and skip it with a reason if it does not reproduce. Fix every remaining finding at its root (polish items too where cheap), then run npm run verify until it passes end to end.

Confirmed findings (data): ${JSON.stringify(confirmed, null, 1)}

Report each finding → what you changed (file), anything you could not fix and why, and the final status of every command.`, { label: `fix:${round}`, phase: 'Fix', schema: REPORT })
  fixes.push({ round, fixed })
}

return { templates, foundationFix, content: contentResults, integrator: integ, rounds: round, dry, confirmed: confirmedAll, fixes }
