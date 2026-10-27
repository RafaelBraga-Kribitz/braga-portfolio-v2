# Website audit report · BRAGA portfolio

| | |
|---|---|
| Site | `https://rafaelbragakribitz.com/` (EN and DE trees). Formerly `https://rafaelbraga-kribitz.github.io/braga-portfolio-v2/`, which now redirects to the domain |
| Audited | 27 Oct 2026, from `main` at `ecb7f4e` (the custom-domain move) |
| Method | Production build audited locally, plus source review. The live origin was **not reachable** from the audit container (its network policy denies the host), so deployed-only checks are `NOT_ASSESSABLE` and listed for the owner |
| Spec | "BRAGA Portfolio — Website Audit & Remediation Specification", controls LEG … OPS (365) |
| Companions | `website-remediation-log.md` (what changed), `website-audit-results.json` (machine-readable register), `website-manual-actions.md` (what only the owner can do) |

## Summary

The site is in good technical shape. It is a static Astro build with no third-party requests, no cookies, and no JavaScript on content pages apart from a small inline script. Its own quality gates already check contrast, target size, overflow, heading structure, landmarks, reduced motion, hreflang, links and axe on every page, in both themes and at six widths. Lab performance is good: LCP 0.8–1.5 s on a throttled mobile profile, CLS ≤ 0.04, 180–270 KB per page.

The audit found five defects. Three were fixed in code, and two need the owner:

| # | Finding | Priority | Disposition |
|---|---|---|---|
| 1 | The live legal pages (Impressum, privacy, accessibility, in both languages) still carry pre-publication drafting notes ("Draft … before publication", "DPF certification will be checked before publication", "NVDA pass planned before publication") | P1 | **FAIL, open.** These are legal decisions for the owner (MA-01) |
| 2 | Meta descriptions of the 524 maths notes were fragments of raw LaTeX or template labels (e.g. `, S = 4\pi R^2`, `(for a > 0)`, `or \#A`); a single `=` or `_` was stripped as if it were emphasis | P2 | **FIXED** in the shared excerpt function (R-01) |
| 3 | The vault content cache ignored changes to the note reader, so local builds could ship stale titles and summaries (production unaffected: CI starts clean) | P2 | **FIXED** (R-02) |
| 4 | No structured data on any page: no machine-readable Person, site or article identity | P2 | **FIXED**: JSON-LD WebSite, Person, ProfilePage, Article (R-03) |
| 5 | A personal Gmail address in plain text in the public repository (`handoff/ds-update/cv/braga-cv.tex`), while the site deliberately keeps its address out of the HTML | P2 | **NEEDS_HUMAN** (MA-09) |

Content and credibility points for the owner (P2/P3, no change made): the About page's experience table has a single row, although the site refers to a longer career (MA-02). The About footnote's election figures are the electoral tribunal's (TSJE) preliminary count, but are labelled the official count (MA-03). Some tag pages are thin and some notes are near-duplicates (MA-11).

### Counts

| Status | Controls |
|---|---|
| PASS | 219 |
| FIXED | 8 |
| FAIL (open) | 2 (both the legal-page drafting notes: LEG-025, CONT-028) |
| NEEDS_HUMAN | 31 |
| ACCEPTED_RISK | 7 (GitHub Pages cannot send security or cache headers; build-time-only low advisories) |
| NOT_APPLICABLE | 22 |
| NOT_ASSESSABLE | 76 (deployed-only checks, and manual visual, keyboard and screen-reader passes not run in this session) |
| **Total** | **365** |

No control that was not tested is reported as PASS. Controls marked
`NOT_ASSESSABLE` include the manual design review, keyboard and screen-reader
passes, and the tool interaction checks. Those need a person with a browser
and, for the screen reader, NVDA or VoiceOver.

### Applicability decisions

- **Legal character (LEG-001/002).** The site is a personal professional portfolio and offers no goods or services. MedienG §25 disclosure applies to any website. ECG §5 is doubtful but harmless to keep. The BaFG (European Accessibility Act) does not apply: WCAG 2.2 AA is voluntary here, and the statement says so. These are readings for the owner to confirm, not legal advice.
- **Consent (LEG-009/010, TKG 2021 §165).** The only browser storage is `localStorage["bk-theme"]`, written when the visitor clicks the theme toggle. It is strictly necessary to honour that click, so no consent banner is needed and none was added.
- **No compliance theatre.** No cookie banner, analytics, `llms.txt`, `security.txt`, share widgets or SEO plugins were added. None was needed.

### Evidence

| Key | What |
|---|---|
| E1 | `npm run verify`: astro check, lint, unit tests, vault:check, build, and the 16 design gates plus link, hreflang, script, metadata and axe gates, over all 805 pages at 320/390/768/1024/1280/1440 px in light and dark |
| E2 | Static scan of all 805 built HTML files (titles, descriptions, canonicals, robots, sitemap coverage, external hosts, `target=_blank`, images, scripts, JSON-LD, orphans) |
| E3 | Playwright/Chromium runtime pass over 18 routes: console errors and overflow at 360 and 1920 px; LCP, CLS, requests and bytes at 390 px with 4× CPU and ~1.6 Mbps/150 ms; text with JavaScript disabled |
| E4 | Live origin unreachable from the container (egress policy) |
| E5 | Source review of `src/`, `vault/`, `public/`, the workflow and `DEPLOY.md` |
| E6 | Browser storage review |
| E7 | Image and font metadata and licences |
| E8 | `npm audit --omit=dev` |

### Baseline measurements (E3, before changes)

| Route | LCP ms | CLS | KB | Requests | Text without JS (chars) |
|---|---|---|---|---|---|
| `/en/` | 924 | 0 | 206 | 8 | 2628 |
| `/de/` | 908 | 0 | 207 | 8 | 2990 |
| `/en/work/` | 860 | 0 | 178 | 7 | 852 |
| `/en/work/austrian-mmm-budget-optimizer/` | 1176 | 0.011 | 243 | 8 | 9963 |
| `/en/work/warehouse-humanoid-tco/` | 1208 | 0 | 248 | 8 | 8346 |
| `/en/writing/` | 852 | 0 | 177 | 7 | 693 |
| `/en/writing/ai-prospecting-vendor-3x-lift/` | 924 | 0 | 214 | 8 | 7809 |
| `/en/notes/` | 992 | 0 | 189 | 7 | 2486 |
| `/en/notes/sphere/` | 1484 | 0.2503 | 271 | 8 | 9747 |
| `/en/tools/` | 868 | 0 | 177 | 7 | 493 |
| `/en/tools/ab-sample-size/` | 848 | 0 | 218 | 12 | 1046 |
| `/en/tools/confusion-matrix/` | 808 | 0 | 228 | 12 | 1451 |
| `/en/about/` | 1148 | 0 | 252 | 9 | 3006 |
| `/en/impressum/` | 884 | 0.0091 | 177 | 7 | 868 |
| `/en/privacy/` | 888 | 0.0002 | 178 | 7 | 1910 |
| `/en/accessibility/` | 876 | 0 | 178 | 7 | 1601 |
| `/en/tags/` | 1196 | 0 | 238 | 7 | 10804 |
| `/nope/` | 924 | 0.0009 | 254 | 11 | 530 |

Lab figures from a local static server (no compression, no CDN), so they are an
upper bound for transfer size. `/nope/` is the 404 page and is served with
status 404 by design. The 0.25 CLS for `/en/notes/sphere/` came from one run;
it did not reproduce in three reruns (0.037, late MathML layout) and is noted
under PERF-003. Lab results are no substitute for field data (PERF-004, MA-04).

### Test environments

| Dimension | Covered | Not covered here |
|---|---|---|
| Viewports | 320, 360, 390, 768, 1024, 1280, 1440, 1920 px | Landscape and short viewports |
| Browsers | Chromium | Firefox, WebKit (not installed in the container) |
| Interaction | Scripted load, scroll, theme toggle | Manual keyboard, touch |
| Accessibility | axe-core on every page (gate A-01) | Screen reader |
| Network | Unthrottled, and throttled mobile | Real devices |
| Rendering | JavaScript on and off | — |
| Languages | EN and DE (all gates) | Translation review |
| Privacy | Initial load, after interaction | — (no consent mechanism exists) |
| Routes | All 805 built routes (gates, scan), 18 in the runtime pass | Live deployment |

## Control register

Status per control. Evidence keys refer to the table above. The same data is
in `website-audit-results.json`.

### LEG

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| LEG-001 | NEEDS_HUMAN | P1 | Site describes itself as private and non-commercial (Impressum), but it is a professional portfolio used for job seeking with essays and a 524-note library. Working classification: personal-professional, no goods or services offered. Owner to confirm. (E5) |
| LEG-002 | NEEDS_HUMAN | P1 | MedienG §25 disclosure applies to every website; ECG §5 is doubtful for a non-commercial site. The Impressum provides both defensively. Applicability is a legal reading for the owner, not a finding. (E5) |
| LEG-003 | PASS |  | Impressum exists in DE (original) and EN, linked from the footer of every page. (E1 L-01, E5) |
| LEG-004 | PASS |  | Name, place of residence (8054 Seiersberg) and e-mail; no registration or VAT numbers are claimed or invented. (E5) |
| LEG-005 | NEEDS_HUMAN | P1 | Privacy notice covers controller, hosting, legal basis, storage, contact and rights, but is still marked as a draft with open items. See LEG-025. (E5) |
| LEG-006 | NEEDS_HUMAN | P2 | GitHub is named as host. The e-mail provider (easyname, per DEPLOY.md) and any forwarding to another mailbox (DEPLOY.md mentions Gmail) are not named as recipients/processors. (E5) |
| LEG-007 | PASS |  | Purposes, legal bases (Art. 6(1)(b),(f)), data categories, rights (Art. 15–21) and the Austrian DSB with address are stated; log retention is deferred to GitHub's statement. (E5) |
| LEG-008 | NEEDS_HUMAN | P1 | Text says EU-US Data Privacy Framework certification "will be checked before publication". The site is published; owner to check GitHub, Inc. on dataprivacyframework.gov and finalise the transfer wording. (E5) |
| LEG-009 | PASS |  | No cookies, sessionStorage or IndexedDB. One localStorage key (bk-theme) after a click. (E6) |
| LEG-010 | PASS |  | The bk-theme key stores a choice the visitor explicitly made and is needed to honour it: strictly necessary under TKG 2021 §165(3). No consent banner needed and none added. (E6) |
| LEG-011 | NOT_APPLICABLE |  | No consent is required (LEG-010). (E6) |
| LEG-012 | PASS |  | No third-party fonts, analytics, embeds, maps or videos; gate G-13 fails any third-party request. (E1 G-13, E2, E3) |
| LEG-013 | PASS |  | No forms, no CV download; contact is a mailto link (assembled on click). (E5) |
| LEG-014 | NOT_APPLICABLE |  | No form processing. (E5) |
| LEG-015 | NEEDS_HUMAN | P3 | UWG concerns commercial practices; the site offers none. Professional claims are covered under LEG-018. (E5) |
| LEG-016 | NEEDS_HUMAN | P3 | Fonts OFL with notice; charts and diagrams generated at build; share card and favicons generated. Owner to confirm rights to the portrait photo (photographer credit if not self-taken). (E7) |
| LEG-017 | PASS |  | Named organisations are the owner's employer (BioSynCare), a published paper and its vendor (essay, critical commentary with citation), and public datasets. No client confidential data seen. (E5) |
| LEG-018 | NEEDS_HUMAN | P2 | Claims the audit cannot verify: "part of the campaign that helped elect Mario Abdo Benítez", "twenty years buying marketing technology" (essay), employment at BioSynCare 2023–2026. Owner holds the evidence. (E5) |
| LEG-019 | PASS |  | BaFG covers products and services offered by economic operators to consumers; a private non-commercial site is outside it. The accessibility statement says so and calls WCAG 2.2 AA voluntary. Legal reading, not legal advice. (E5) |
| LEG-020 | NOT_APPLICABLE |  | No downloadable CV or document is published. (E2) |
| LEG-021 | PASS |  | Legal notices exist in German (original) and English (translation). (E5) |
| LEG-022 | NOT_APPLICABLE |  | No sponsored content, affiliate links or endorsements. (E2, E5) |
| LEG-023 | NOT_APPLICABLE |  | No newsletter or signup. (E5) |
| LEG-024 | PASS |  | Only the owner's own portrait; no third-party photos or identifiable private individuals. (E5) |
| LEG-025 | FAIL | P1 | Live legal pages still carry pre-publication drafting notes: Impressum "Draft. A check … is recommended before publication"; Privacy "Draft … DPF certification will be checked before publication" and "Open (item 5 of the checklist)"; Accessibility "Planned — One pass with a screen reader (NVDA) before publication". Not fixed: legal wording is the owner's decision (website-manual-actions.md MA-01). (E2, E5) |
| LEG-026 | PASS |  | This report separates law, guidance and interpretation; legal items are NEEDS_HUMAN. |

### PRIV

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| PRIV-001 | PASS |  | Every request in the runtime pass is same-origin (document, one stylesheet, self-hosted fonts, the portrait, tool islands). External hostnames in HTML are link targets only: github.com, linkedin.com, docs.github.com, dsb.gv.at, doi.org. (E2, E3) |
| PRIV-002 | PASS |  | No third-party service receives data on page load. (E3) |
| PRIV-003 | PASS |  | Nothing set before interaction (pre-paint script only reads bk-theme). (E6) |
| PRIV-004 | PASS |  | After navigation and the theme toggle: bk-theme only. (E6) |
| PRIV-005 | PASS |  | No analytics, pixels, fingerprinting, replay, heatmaps or ad trackers. (E2, E3, E5) |
| PRIV-006 | NOT_APPLICABLE |  | No optional trackers. (E5) |
| PRIV-007 | NOT_APPLICABLE |  | No consent management. (E5) |
| PRIV-008 | NOT_APPLICABLE |  | No consent management. (E5) |
| PRIV-009 | PASS |  | Fonts are self-hosted woff2 under /fonts/. (E5, E3) |
| PRIV-010 | NOT_APPLICABLE |  | No embeds. (E2) |
| PRIV-011 | PASS |  | Network behaviour matches the privacy notice ("every file is loaded from the site's own origin"); see LEG-006 for the e-mail gap. (E3) |
| PRIV-012 | PASS |  | No telemetry, no console logging in shipped scripts. (E3, E5) |
| PRIV-013 | PASS |  | Tool state lives in the query string (numbers only, src/lib/tools/url-state.mjs); browsers' default strict-origin-when-cross-origin drops it on outbound links. (E5) |
| PRIV-014 | PASS |  | No external services or persistent identifiers. (E5) |

### SEO

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| SEO-001 | PASS |  | All 805 built pages answer 200 from a GitHub-Pages-like server; live NOT_ASSESSABLE. (E1, E4) |
| SEO-002 | PASS |  | Only /404.html and /en () |
| SEO-003 | PASS |  | robots.txt at the origin root: Allow /, Sitemap absolute. (E2) |
| SEO-004 | PASS | P3 | sitemap.xml valid, 558 URLs with hreflang alternates, absolute canonical URLs. Note: 243 indexable listing pages (notes pagination, tag pages) are not listed — acceptable, owner may choose to noindex thin tag pages (SEO-024). (E2) |
| SEO-005 | NEEDS_HUMAN | P2 | Sitemap is referenced from robots.txt; Search Console/Bing submission requires the owner (MA-04). (E5) |
| SEO-006 | PASS |  | Every page has a title; duplicates are only EN/DE language pairs of tag pages and the home page (role is the same word in both languages), paired by hreflang. (E2) |
| SEO-007 | FIXED | P2 | Auto-generated descriptions of the 524 notes were fragments of raw LaTeX or label text: 277 contained TeX (e.g. "or \#A"), 76 began with punctuation ("(for a > 0)"), 25 ended mid-sentence ("…, defined by"), 333 began "What it tells me (Situation Awareness):"; "z = a + bi" lost its "=". Fixed in the shared excerpt() (src/lib/vault/meta.mjs): 0 / 0 / 0 / 0 after. Site-wide descriptions under 50 characters 54 → 7 (all complete sentences, plus the tag index); duplicate descriptions 9 → 5 (the single-entry tag pages, SEO-024, and three near-duplicate note pairs, SEO-023). (E2) |
| SEO-008 | PASS |  | No missing or conflicting canonicals. (E2) |
| SEO-009 | PASS |  | Canonical equals the page URL on every page except the root redirect (→ /en/). (E2) |
| SEO-010 | PASS |  | All canonicals on https://rafaelbragakribitz.com. (E2) |
| SEO-011 | PASS |  | hreflang en/de/x-default on paired pages; single-language notes declare only themselves. (E1 L-02) |
| SEO-012 | PASS |  | Reciprocal pairs checked by gate L-02. (E1 L-02) |
| SEO-013 | PASS |  | html lang matches the route tree; gate L-05. (E1 L-05) |
| SEO-014 | PASS |  | One h1, no skipped levels (gate G-09). (E1 G-09) |
| SEO-015 | PASS |  | Descriptive anchor text; axe link-name. (E1 A-01) |
| SEO-016 | PASS |  | Internal links resolve (gate L-01). External links NOT_ASSESSABLE from here (OPS-007). (E1 L-01, E4) |
| SEO-017 | PASS |  | Computed over the build: every page except / and /404.html is the target of at least one internal link (0 orphans). (E2) |
| SEO-018 | PASS |  | Plain <a href> navigation; no JS routing. (E5) |
| SEO-019 | PASS |  | Content is static HTML; all 18 sampled routes render their text with JavaScript disabled. (E3) |
| SEO-020 | PASS |  | Only the two tools hydrate islands; their default scenario is in the HTML. (E3) |
| SEO-021 | PASS |  | No redirect chains; root is a single meta-refresh to /en/ with canonical /en/ (GitHub Pages cannot send 301s). (E2) |
| SEO-022 | NOT_ASSESSABLE |  | http→https and www→apex behaviour live only (MA-05). (E4) |
| SEO-023 | NEEDS_HUMAN | P3 | Near-duplicate notes: arithmetic-n-th-term-2 / arithmetic-hmtbcth-term, jacobian-matrix / jacobian-matrix-f, unemployment-rate / unemployment-rate-delta-ue share their opening. Owner to merge or differentiate. (E2) |
| SEO-024 | NEEDS_HUMAN | P3 | 19 tag pages per language list one entry ("1 entry. …"), indexable. Consider noindex,follow below 2 entries. (E2) |
| SEO-025 | PASS | P3 | Readable kebab slugs; a few odd ones from folder names (arithmetic-hmtbcth-term, green-s-functiondelta-mapping-system-behavior-jump-at-t). (E2) |
| SEO-026 | FIXED | P2 | No structured data existed (0 of 805 pages). Added schema.org JSON-LD from src/lib/structured-data.ts: WebSite + Person (home), ProfilePage (About), Article (projects, essays). Syntax and field checks pass locally; Google Rich Results Test needs the live URL (MA-04). (E2) |
| SEO-027 | FIXED | P2 | Person, WebSite, ProfilePage and Article added where the content supports them; BreadcrumbList and notes (BlogPosting/LearningResource) left as optional (P3). (E2) |
| SEO-028 | FIXED | P2 | IDs are stable (…/#person, …/#website, page#article); URLs absolute on the production origin; every value comes from site.ts or the entry's own front matter. (E2, E5) |
| SEO-029 | PASS |  | No <img> without alt; portrait alt is the name. (E2) |
| SEO-030 | PASS |  | Portrait 782×978 WebP 49 KB; share card 1200×630 PNG 49 KB; width/height on every <img>. (E2, E7) |
| SEO-031 | NEEDS_HUMAN | P3 | 28 titles exceed 70 characters and will truncate, longest the German essay (127). seo_title can shorten them without changing the H1. (E2) |
| SEO-032 | PASS |  | 32 px and 180 px PNG favicons. (E2) |
| SEO-033 | PASS |  | Responsive viewport; no overflow 320–1920 px. (E1 G-06, E3) |
| SEO-034 | PASS |  | Unknown paths return status 404 with 404.html (noindex). (E3) |
| SEO-035 | PASS |  | The design specimen (/system/) is noindex; unpublished vault notes are not built. (E2) |
| SEO-036 | PASS |  | robots and sitemap reference the new origin after the domain move. (E2) |
| SEO-037 | NEEDS_HUMAN | P2 | No Search Console / Bing verification is visible in the repo; requires owner access (MA-04). (E5) |
| SEO-038 | PASS |  | No meta keywords or keyword stuffing. (E2) |
| SEO-039 | FIXED | P2 | Note snippets now reflect the note's first explanatory sentence (see SEO-007). (E2) |
| SEO-040 | PASS |  | Name, role and location in the home title, cover and About; projects named by topic. (E2) |

### AEO

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| AEO-001 | PASS |  | Home: name, "Marketing Data Analyst", "Based in Greater Graz, Austria". (E3) |
| AEO-002 | PASS |  | Project summaries state units, dates and limits (e.g. "snapshot of 16 Sep 2026", "proxies, not campaign effects"). (E5) |
| AEO-003 | PASS |  | Role is "Marketing Data Analyst" everywhere (site.ts single source); past job title Marketing Data Scientist is explained on About. (E5) |
| AEO-004 | PASS |  | About has profile, background, approach, skills, experience and contact. See CONT-005 for completeness. (E5) |
| AEO-005 | FIXED | P2 | Person node with name, jobTitle, homeLocation, url, image (About), sameAs. (E2) |
| AEO-006 | FIXED | P2 | sameAs: GitHub and LinkedIn from site.ts (empty Kaggle left out). (E2) |
| AEO-007 | PASS |  | Project pages: Summary, Question, Data, method, result and limits sections. (E5) |
| AEO-008 | PASS |  | Each project opens with a summary callout. (E5) |
| AEO-009 | PASS |  | Section headings name the information (Question, Data, …). (E5) |
| AEO-010 | PASS |  | Formulas are MathML, charts carry text and tables; no text-only-in-image. (E3, E5) |
| AEO-011 | PASS |  | Tables have header rows; figures have titles. (E1 A-01, E5) |
| AEO-012 | PASS |  | Essay cites the study with DOI; About footnote cites the TSJE (see CONT-004). (E5) |
| AEO-013 | PASS |  | Documents show Published/Updated dates; Article JSON-LD carries datePublished/dateModified and author. (E2) |
| AEO-014 | NOT_ASSESSABLE |  | GitHub and LinkedIn profiles not reachable from the audit container (MA-07). (E4) |
| AEO-015 | NEEDS_HUMAN | P3 | robots.txt allows all crawlers, AI crawlers included. Record as a deliberate policy or restrict (MA-08). (E2) |
| AEO-016 | NOT_APPLICABLE |  | llms.txt is optional and experimental; not added. |
| AEO-017 | NOT_APPLICABLE |  | No alternate Markdown views. (E2) |
| AEO-018 | NEEDS_HUMAN | P2 | See CONT-005: one role in the About experience table vs "twenty years buying marketing technology" in the essay. (E5) |
| AEO-019 | PASS |  | Project summaries stand alone. (E5) |
| AEO-020 | PASS |  | Nothing artificial added: no FAQ, no hidden text, no unsupported schema. |
| AEO-021 | NOT_ASSESSABLE |  | No search or answer-engine access from the container. (E4) |

### SOC

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| SOC-001 | PASS |  | og:title/description/url/type/image/locale on every page. (E2) |
| SOC-002 | PASS |  | twitter:card summary_large_image with title, description, image, alt. (E2) |
| SOC-003 | PASS |  | Purpose-made share card (wordmark, name, role). (E7) |
| SOC-004 | PASS |  | 1200×630, declared type and dimensions. (E7) |
| SOC-005 | PASS |  | Absolute URLs. (E2) |
| SOC-006 | PASS |  | Title and description are page-specific; image is the site card unless a note sets a cover. (E2) |
| SOC-007 | NOT_ASSESSABLE |  | LinkedIn Post Inspector needs the live URL (MA-06). (E4) |
| SOC-008 | NEEDS_HUMAN | P2 | After the domain move, re-scrape the home and project URLs in LinkedIn Post Inspector (MA-06). |
| SOC-009 | NOT_ASSESSABLE |  | Profile links resolve? Not reachable from here (MA-07). (E4) |
| SOC-010 | NEEDS_HUMAN | P3 | Compare LinkedIn headline with "Marketing Data Analyst" (MA-07). |
| SOC-011 | PASS |  | Project and essay titles and summaries are meaningful. (E2) |
| SOC-012 | PASS |  | No unpublished information in previews. (E2) |
| SOC-013 | PASS |  | og:url is the canonical. (E2) |
| SOC-014 | PASS |  | No-JS and narrow-viewport rendering work (in-app browsers). (E3) |
| SOC-015 | PASS |  | No third-party share widgets. (E2) |

### PERF

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| PERF-001 | PASS |  | Lab LCP 0.81–1.48 s on 18 routes at 390 px, 4x CPU, ~1.6 Mbps/150 ms; field data unavailable. (E3) |
| PERF-002 | NOT_ASSESSABLE |  | No field INP data. Content pages run one small inline script; tools hydrate Preact islands. (E3) |
| PERF-003 | PASS |  | CLS 0–0.037 (reproducible). One run of /en/notes/sphere/ read 0.25 and did not reproduce in three reruns (0.037, late MathML layout). (E3) |
| PERF-004 | NOT_ASSESSABLE |  | No CrUX data for a new domain (MA-04). (E4) |
| PERF-005 | PASS |  | Mobile 360/390 px and desktop 1920 px. (E3) |
| PERF-006 | PASS |  | One stylesheet, no blocking scripts (inline pre-paint only). (E3) |
| PERF-007 | PASS |  | Content pages ship no JS bundle; code.js only on pages with code. (E1 L-03) |
| PERF-008 | PASS |  | One stylesheet per page. (E3) |
| PERF-009 | PASS |  | Hydration only on the two tools. (E1 L-03) |
| PERF-010 | PASS |  | WebP portrait, PNG cards; sizes small. (E7) |
| PERF-011 | NOT_APPLICABLE |  | Almost no below-the-fold media. (E2) |
| PERF-012 | PASS |  | No above-the-fold image except the About portrait (eager). (E2) |
| PERF-013 | PASS |  | Self-hosted woff2, font-display: swap. (E5) |
| PERF-014 | PASS |  | Font swap shows in CLS ≤0.037. (E3) |
| PERF-015 | ACCEPTED_RISK | P3 | Hashed /_astro/ assets; GitHub Pages fixes Cache-Control at 10 minutes and cannot be configured. (E5) |
| PERF-016 | NOT_ASSESSABLE |  | Compression is the host's (live only). Uncompressed page weight 177–271 KB incl. fonts. (E3, E4) |
| PERF-017 | PASS |  | 7–12 requests per page, no duplicates. (E3) |
| PERF-018 | PASS |  | No third-party dependencies at runtime. (E3) |
| PERF-019 | NOT_ASSESSABLE |  | No performance trace taken. |
| PERF-020 | NOT_ASSESSABLE |  | No performance trace taken. |
| PERF-021 | NOT_ASSESSABLE |  | Tool memory/CPU not profiled. |
| PERF-022 | NOT_ASSESSABLE |  | Tool chart update timing not measured. |
| PERF-023 | PASS |  | Throttled mobile run (see PERF-001). (E3) |
| PERF-024 | NOT_ASSESSABLE |  | Back/forward not exercised. |
| PERF-025 | PASS |  | Static pages paint at FCP = LCP. (E3) |
| PERF-026 | PASS |  | No change traded usability for score. |

### A11Y

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| A11Y-001 | PASS |  | axe image-alt on every page; portrait alt. (E1 A-01, E2) |
| A11Y-002 | PASS |  | Decorative glyphs aria-hidden; axe clean. (E1 A-01) |
| A11Y-003 | PASS |  | Header, nav, main#main, footer (gate G-10). (E1 G-10) |
| A11Y-004 | PASS |  | Gate G-09. (E1 G-09) |
| A11Y-005 | NOT_ASSESSABLE |  | Full manual keyboard pass not run in this session; the statement records one by the owner. |
| A11Y-006 | PASS |  | :focus-visible outline defined in base.css/components.css. Visual check not run. (E5) |
| A11Y-007 | NOT_ASSESSABLE |  | Sticky shell vs focused element not tested manually. |
| A11Y-008 | NOT_ASSESSABLE |  | Not tested manually. |
| A11Y-009 | PASS |  | Skip link is the first tab stop and targets #main (gate G-10). (E1 G-10) |
| A11Y-010 | PASS |  | Gate G-02, both themes, all widths. (E1 G-02) |
| A11Y-011 | PASS |  | Gate G-02 (3:1 at large sizes). (E1 G-02) |
| A11Y-012 | NOT_ASSESSABLE |  | Non-text contrast not gated beyond axe. |
| A11Y-013 | PASS |  | Status marks always carry a label (D-029). (E5) |
| A11Y-014 | NOT_ASSESSABLE |  | No CVD simulation run. |
| A11Y-015 | NOT_ASSESSABLE |  | 200% zoom not tested here (statement says the owner did). |
| A11Y-016 | PASS |  | No overflow at 320 px (= 1280 px at 400%). (E1 G-06) |
| A11Y-017 | NOT_ASSESSABLE |  | Text-spacing override not tested. |
| A11Y-018 | PASS |  | Targets ≥24 px, ≥44 px below 768 px (gate G-05). (E1 G-05) |
| A11Y-019 | PASS |  | axe button-name/link-name. (E1 A-01) |
| A11Y-020 | PASS |  | axe ARIA rules. (E1 A-01) |
| A11Y-021 | PASS |  | Native <dialog>, <details>, <button>. (E5) |
| A11Y-022 | NOT_ASSESSABLE |  | No screen reader in the container; NVDA pass is still "planned" in the statement (MA-03). |
| A11Y-023 | PASS |  | axe link rules; links underlined in prose. (E1 A-01) |
| A11Y-024 | PASS |  | Tool inputs labelled (axe). (E1 A-01) |
| A11Y-025 | PASS |  | prefers-reduced-motion sets --dur 0 (gate G-11). (E1 G-11) |
| A11Y-026 | PASS |  | No autoplay or flashing content. (E5) |
| A11Y-027 | NOT_ASSESSABLE |  | Chart text alternatives not reviewed one by one. |
| A11Y-028 | NOT_ASSESSABLE |  | Tool keyboard operation not tested here. |
| A11Y-029 | PASS |  | Language links carry lang/hreflang. (E2) |
| A11Y-030 | PASS |  | Shortcut panel is a native modal <dialog> with a labelled close button; axe clean. (E1 A-01, E5) |
| A11Y-031 | PASS |  | Breadcrumb trail is a list of links with aria-current. (E5) |
| A11Y-032 | PASS |  | Contents rail sets aria-current="location". (E5) |
| A11Y-033 | PASS |  | The contact split shows on hover and on keyboard focus. (E5) |
| A11Y-034 | NOT_ASSESSABLE |  | Landscape and short viewports not tested. |
| A11Y-035 | NOT_APPLICABLE |  | No PDFs. (E2) |
| A11Y-036 | NEEDS_HUMAN | P2 | Automated checks complete (axe on every page); manual screen-reader pass outstanding (MA-03). (E1) |
| A11Y-037 | PASS |  | Unresolved items are recorded here; no full-conformance claim is made by this audit. |

### UX

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| UX-001 | PASS |  | 320–1920 px without overflow. (E1 G-06, E3) |
| UX-002 | PASS |  | Six gate widths plus 360 and 1920. (E1, E3) |
| UX-003 | PASS |  | No horizontal overflow. (E1 G-06, E3) |
| UX-004 | NOT_ASSESSABLE |  | Visual review not performed in this session. |
| UX-005 | NOT_ASSESSABLE |  | Visual review not performed. |
| UX-006 | PASS |  | Shell stands on the grid at every width (gate G-14). (E1 G-14) |
| UX-007 | NOT_ASSESSABLE |  | Not exercised manually. |
| UX-008 | NOT_ASSESSABLE |  | Not exercised manually. |
| UX-009 | PASS |  | Gate G-05. (E1 G-05) |
| UX-010 | PASS |  | Links resolve; no runtime errors on 18 routes. (E1 L-01, E3) |
| UX-011 | NOT_ASSESSABLE |  | External links live only. (E4) |
| UX-012 | PASS |  | Trail and "u" shortcut lead up one level. (E5) |
| UX-013 | NOT_ASSESSABLE |  | Not exercised. |
| UX-014 | NOT_ASSESSABLE |  | Not exercised. |
| UX-015 | NOT_ASSESSABLE |  | Not exercised. |
| UX-016 | NOT_ASSESSABLE |  | Not exercised. |
| UX-017 | NOT_ASSESSABLE |  | Not exercised. |
| UX-018 | NOT_ASSESSABLE |  | Not exercised. |
| UX-019 | NOT_ASSESSABLE |  | Not exercised. |
| UX-020 | NOT_APPLICABLE |  | No loading or empty states (static). (E5) |
| UX-021 | PASS |  | All 18 routes readable without JS; tools show the default scenario as text and a table. (E3) |
| UX-022 | NOT_ASSESSABLE |  | Touch behaviour not exercised. |
| UX-023 | PASS |  | Copy buttons acknowledge success and failure. (E5) |
| UX-024 | PASS |  | Language switch goes to the twin page, or the other home when none exists. (E5) |
| UX-025 | PASS |  | One shell and footer on every page. (E5) |
| UX-026 | PASS |  | Keyboard shortcuts are optional and listed. (E5) |
| UX-027 | PASS |  | Home states who, what, where and lists the work. (E3) |
| UX-028 | NEEDS_HUMAN | P2 | Background and contact are one click from home, but there is no CV document and the About experience table has one row (CONT-005, CONT-021). (E5) |
| UX-029 | PASS |  | Direct deep links load; 404 for unknown paths. (E3) |
| UX-030 | PASS |  | Both themes gated. (E1) |

### DES

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| DES-001 | NOT_ASSESSABLE |  | Visual design review not performed; the design system's own gates passed. (E1) |
| DES-002 | PASS |  | Self-hosted BKribitz faces with system fallbacks; gate G-12. (E1 G-12) |
| DES-003 | PASS |  | Tokens only (lint: no hex outside tokens). (E1) |
| DES-004 | PASS |  | One accent per section (gate G-15). (E1 G-15) |
| DES-005 | NOT_ASSESSABLE |  | Not reviewed visually. |
| DES-006 | NOT_ASSESSABLE |  | Not reviewed visually. |
| DES-007 | PASS |  | Shell on the page grid (gate G-14). (E1 G-14) |
| DES-008 | NOT_ASSESSABLE |  | Not reviewed visually. |
| DES-009 | PASS |  | Rules open, never close (gate G-16). (E1 G-16) |
| DES-010 | NOT_ASSESSABLE |  | Not reviewed visually. |
| DES-011 | PASS |  | Class contract lint. (E1) |
| DES-012 | NOT_ASSESSABLE |  | Not reviewed visually. |
| DES-013 | NOT_ASSESSABLE |  | Not reviewed visually. |
| DES-014 | NOT_ASSESSABLE |  | Not reviewed visually. |
| DES-015 | PASS |  | 12 px floor (gate G-01). (E1 G-01) |
| DES-016 | NOT_ASSESSABLE |  | Not reviewed. |
| DES-017 | NOT_ASSESSABLE |  | Print not reviewed. |
| DES-018 | NOT_ASSESSABLE |  | Not reviewed visually. |
| DES-019 | PASS |  | Flat, square, reduced motion (G-07, G-08, G-11). (E1) |
| DES-020 | PASS |  | No visual change made: the fixes touch meta descriptions, related-note sublines and the head. |

### CONT

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| CONT-001 | PASS |  | Marketing Data Analyst, marketing measurement and decisions. (E3) |
| CONT-002 | PASS |  | Home cover says who, what, where; sections number the doors. (E3) |
| CONT-003 | PASS |  | Projects on the home page. (E3) |
| CONT-004 | NEEDS_HUMAN | P3 | About footnote gives 46.43% vs 42.73% as the "official count of the electoral tribunal"; those match the TSJE preliminary count, while the final tally of valid votes is reported as 48.96% vs 45.08%. The 3.7-point margin stands either way; wording for the owner. (E5) |
| CONT-005 | NEEDS_HUMAN | P2 | About experience table lists only 2023–2026 (BioSynCare), while About mentions founded startups and a presidential campaign, and the essay claims twenty years buying marketing technology. Recruiters will look for the dates. (E5) |
| CONT-006 | NOT_ASSESSABLE |  | No full proofread; spot checks found no errors. |
| CONT-007 | NEEDS_HUMAN | P3 | Library notes follow a template ("We are working on …, defined by", "What it tells me (Situation Awareness)", "Source: domain knowledge"). Read as study notes, they are fine; the template voice is visible. (E5) |
| CONT-008 | PASS |  | Spot checks: claims are qualified (proxies, simulated, in build). (E5) |
| CONT-009 | PASS |  | Projects open with the question. (E5) |
| CONT-010 | PASS |  | Observed vs. simulated stated ("Allocation gains are proxies", demo data named). (E5) |
| CONT-011 | PASS |  | Spot checks: units and dates given. (E5) |
| CONT-012 | NOT_ASSESSABLE |  | Charts not reviewed one by one. |
| CONT-013 | NOT_ASSESSABLE |  | IBCS review not performed. |
| CONT-014 | NOT_ASSESSABLE |  | Linked repositories not reachable. (E4) |
| CONT-015 | PASS |  | DOI and source links present; live resolution NOT_ASSESSABLE. (E2) |
| CONT-016 | PASS |  | Projects are personal work. (E5) |
| CONT-017 | PASS |  | Consistent document template. (E5) |
| CONT-018 | PASS |  | Essay title, publish date; single author (now also in JSON-LD). (E2) |
| CONT-019 | PASS |  | Home, About and project summaries differ in role. (E5) |
| CONT-020 | PASS |  | Skills listed by category, not as an inventory. (E5) |
| CONT-021 | NEEDS_HUMAN | P2 | A LaTeX CV exists in the repository (handoff/ds-update/cv/braga-cv.tex) but none is published; owner decides whether to offer one. (E5) |
| CONT-022 | NOT_APPLICABLE |  | No CV download. (E2) |
| CONT-023 | PASS |  | Contact on home, About, every project close; LinkedIn and GitHub on About. (E3) |
| CONT-024 | PASS |  | Each door ends in a next step (all projects, contact). (E3) |
| CONT-025 | NOT_ASSESSABLE |  | Reader testing not performed. |
| CONT-026 | PASS |  | Results stated on the site, not only in GitHub. (E5) |
| CONT-027 | PASS |  | Calls to action are plain ("Email is the direct line"). (E3) |
| CONT-028 | FAIL | P1 | Legal pages read as unfinished drafts (LEG-025). Project 01-04 "In build" is honestly labelled. (E2) |
| CONT-029 | PASS |  | Location consistent (Greater Graz / Seiersberg). (E5) |
| CONT-030 | PASS |  | Four doors: Work, Writing, Tools, About. (E5) |

### SEC

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| SEC-001 | NOT_ASSESSABLE |  | Certificate live only (MA-05). (E4) |
| SEC-002 | NOT_ASSESSABLE |  | "Enforce HTTPS" is a repository setting (MA-05). (E4) |
| SEC-003 | PASS |  | No http:// resources in any page. (E2) |
| SEC-004 | ACCEPTED_RISK | P3 | No CSP. GitHub Pages cannot send headers; a meta CSP would need hashes for the inline scripts. Value is low: no third-party code, no user input rendered. Recommendation only. (E5) |
| SEC-005 | ACCEPTED_RISK | P3 | frame-ancestors/X-Frame-Options cannot be set on GitHub Pages (not settable by meta). Clickjacking impact is low: no state-changing actions. (E5) |
| SEC-006 | ACCEPTED_RISK | P3 | No explicit Referrer-Policy; browsers default to strict-origin-when-cross-origin. (E5) |
| SEC-007 | NOT_ASSESSABLE |  | Header set by the host; live only. (E4) |
| SEC-008 | NOT_ASSESSABLE |  | HSTS is the host's; live only. (E4) |
| SEC-009 | ACCEPTED_RISK | P3 | Not settable on GitHub Pages; no powerful features used. (E5) |
| SEC-010 | PASS |  | No external scripts. (E2) |
| SEC-011 | NOT_APPLICABLE |  | No externally hosted assets. (E2) |
| SEC-012 | PASS |  | No tokens or keys in dist/ (pattern scan). (E2) |
| SEC-013 | PASS |  | Shipped JS holds no sensitive data; the e-mail is reversed halves by design. (E5) |
| SEC-014 | PASS |  | No source maps in dist/. (E2) |
| SEC-015 | PASS |  | dist/ holds only site files. Repository-level personal data: see DEP-017. (E2) |
| SEC-016 | ACCEPTED_RISK | P3 | 2 low advisories (katex via mermaid), build-time only, not shipped; fix needs katex 0.19 (breaking). (E8) |
| SEC-017 | PASS |  | set:html only with build-time own content; JSON-LD escapes "<". (E5) |
| SEC-018 | PASS |  | No target="_blank" links. (E2) |
| SEC-019 | NOT_APPLICABLE |  | No iframes. (E2) |
| SEC-020 | NOT_APPLICABLE |  | No cross-origin requests. (E3) |
| SEC-021 | PASS |  | No downloads besides two specimen images under /media/. (E2) |
| SEC-022 | PASS |  | No debug endpoints. (E2) |
| SEC-023 | NEEDS_HUMAN | P2 | DNS at easyname per DEPLOY.md; verify no stale A/CNAME records and the GitHub domain verification TXT (MA-05). (E4) |
| SEC-024 | NOT_APPLICABLE |  | security.txt optional; not added. |
| SEC-025 | PASS |  | No intrusive testing performed. |

### DEP

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| DEP-001 | PASS |  | Base is "/" on the custom domain; SITE_BASE path builds still supported and documented. (E5) |
| DEP-002 | PASS |  | Nested routes resolve assets (gate L-01). (E1 L-01) |
| DEP-003 | PASS |  | Every built page loads directly. (E1) |
| DEP-004 | PASS |  | 404.html at the root; trailing-slash redirect by the host. (E3) |
| DEP-005 | PASS |  | dist/ holds only intended files (pages, _astro, fonts, scripts, media, favicons, card, CNAME, feed, robots, sitemap). (E2) |
| DEP-006 | PASS |  | Clean build. (E1) |
| DEP-007 | FIXED | P2 | npm ci from the lockfile with exact versions. Defect found while verifying SEO-007: the vault loader keyed its content cache on each note's text only, so a change to meta.mjs (how a note is read) kept stale titles/summaries in node_modules/.astro until the cache was deleted — local builds were not reproducible from source (CI starts clean, so production was unaffected). Fixed: the hash of meta.mjs joins every digest (src/lib/vault/loader.mjs); verified by rebuilding on the stale cache. src/data/activity.json refresh stays intentionally time-dependent. (E1, E2) |
| DEP-008 | NOT_ASSESSABLE |  | Actions run logs not reviewed. |
| DEP-009 | PASS | P3 | Workflow permissions are minimal for Pages (contents read, pages write, id-token write); scoping pages/id-token to the deploy job would be tighter. (E5) |
| DEP-010 | PASS | P3 | Dependencies pinned exactly; actions pinned to major tags (SHA pinning optional). (E5) |
| DEP-011 | PASS |  | site, base and SITE_BASE consistent. (E5) |
| DEP-012 | PASS |  | No console output. (E3) |
| DEP-013 | PASS |  | No runtime errors or rejections on 18 routes. (E3) |
| DEP-014 | PASS |  | favicons, sitemap, robots, feed at the root. (E2) |
| DEP-015 | ACCEPTED_RISK | P3 | See PERF-015. (E5) |
| DEP-016 | PASS |  | Production build verified locally (npm run verify). (E1) |
| DEP-017 | NEEDS_HUMAN | P2 | The public repository contains handoff/ds-update/cv/braga-cv.tex with a personal Gmail address. The site deliberately keeps its address out of the HTML; the repository publishes another one in plain text (and in git history). Owner decides (MA-09). (E5) |
| DEP-018 | NEEDS_HUMAN | P3 | Public repository has no LICENSE; without one, all rights are reserved by default. Fonts carry their OFL. (E5) |
| DEP-019 | PASS |  | Custom domain in place: CNAME, site, robots, sitemap, canonicals. (E2) |
| DEP-020 | NOT_ASSESSABLE |  | Redirect from rafaelbraga-kribitz.github.io/braga-portfolio-v2/* to the domain is GitHub's; live only (MA-05). (E4) |
| DEP-021 | PASS |  | One workflow, no extra infrastructure. (E5) |
| DEP-022 | NOT_ASSESSABLE |  | Deployed environment unreachable from the container (MA-10). (E4) |

### ASSET

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| ASSET-001 | PASS |  | Portrait, 2 favicons, share card, 10 font files, 2 specimen PNGs, inline SVG/MathML. (E2) |
| ASSET-002 | PASS |  | All assets referenced. (E2) |
| ASSET-003 | PASS |  | Small, correctly sized. (E7) |
| ASSET-004 | PASS |  | SVG is generated inline at build; no external SVG. (E5) |
| ASSET-005 | PASS |  | OFL 1.1 permits embedding of renamed modified cuts; notice included. (E7) |
| ASSET-006 | NEEDS_HUMAN | P3 | See LEG-016 (portrait). (E7) |
| ASSET-007 | PASS |  | No EXIF/XMP. (E7) |
| ASSET-008 | NOT_APPLICABLE |  | No PDFs. (E2) |
| ASSET-009 | NOT_APPLICABLE |  | No CV published. (E2) |
| ASSET-010 | NOT_APPLICABLE |  | No PDFs. (E2) |
| ASSET-011 | PASS |  | Correct extensions; GitHub Pages sets types by extension. (E2) |
| ASSET-012 | PASS |  | Largest image 49 KB. (E7) |
| ASSET-013 | NOT_ASSESSABLE |  | External documents (DOI) live only. (E4) |
| ASSET-014 | PASS |  | Share card used only as og/twitter image. (E2) |

### I18N

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| I18N-001 | PASS |  | English and German. (E5) |
| I18N-002 | PASS |  | /en/ and /de/ trees, German slugs for legal pages. (E5) |
| I18N-003 | PASS |  | Language link to the twin. (E5) |
| I18N-004 | NOT_ASSESSABLE |  | Translation fidelity not reviewed page by page. |
| I18N-005 | PASS |  | Chrome strings from i18n; gate L-07 marks draft-language pages. (E1 L-07) |
| I18N-006 | PASS |  | German pages pass the overflow gate. (E1 G-06) |
| I18N-007 | PASS |  | lang, og:locale de_AT/en_GB. (E2) |
| I18N-008 | PASS |  | Gate L-02. (E1 L-02) |
| I18N-009 | PASS |  | Number/date formatting unit-tested per language. (E1) |
| I18N-010 | NOT_ASSESSABLE |  | Terminology not reviewed. |
| I18N-011 | PASS |  | External links are language-neutral. (E2) |
| I18N-012 | PASS |  | Root goes to /en/ always; no language sniffing. (E2) |
| I18N-013 | PASS |  | Single-language notes declare no twin. (E1 L-02) |
| I18N-014 | NEEDS_HUMAN | P1 | Legal pages in both languages carry the drafting notes (LEG-025). (E5) |
| I18N-015 | NOT_ASSESSABLE |  | Austrian German wording not reviewed. |

### TOOL

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| TOOL-001 | PASS |  | Two tools: confusion matrix, A/B sample size. (E5) |
| TOOL-002 | PASS |  | Inputs labelled (axe). (E1 A-01) |
| TOOL-003 | PASS |  | Typed-input parser unit-tested. (E1) |
| TOOL-004 | PASS |  | Tool maths unit-tested against hand-computed references. (E1) |
| TOOL-005 | NOT_ASSESSABLE |  | Latency not measured. |
| TOOL-006 | NOT_ASSESSABLE |  | Not exercised. |
| TOOL-007 | PASS |  | No overflow 320–1920 px. (E1 G-06, E3) |
| TOOL-008 | NOT_ASSESSABLE |  | Not reviewed. |
| TOOL-009 | PASS |  | Default scenario as text and table without JS. (E3) |
| TOOL-010 | NOT_ASSESSABLE |  | Not exercised. |
| TOOL-011 | PASS |  | Parser rejects invalid input (unit tests). (E1) |
| TOOL-012 | NOT_ASSESSABLE |  | Not exercised. |
| TOOL-013 | NOT_ASSESSABLE |  | Not profiled. |
| TOOL-014 | NOT_ASSESSABLE |  | Not reviewed. |
| TOOL-015 | PASS |  | 81+1 unit tests incl. tool maths. (E1) |
| TOOL-016 | NOT_ASSESSABLE |  | Not reviewed. |
| TOOL-017 | PASS |  | No network requests from tools. (E3) |
| TOOL-018 | PASS |  | Islands isolated; page text independent of them. (E3) |

### OPS

| Control | Status | Priority | Finding / evidence |
|---|---|---|---|
| OPS-001 | NEEDS_HUMAN | P2 | Search Console / Bing setup (MA-04). |
| OPS-002 | NOT_ASSESSABLE |  | No access. (E4) |
| OPS-003 | NOT_ASSESSABLE |  | No access. (E4) |
| OPS-004 | PASS |  | No analytics, consistent with the privacy notice. (E5) |
| OPS-005 | PASS |  | None added. |
| OPS-006 | NEEDS_HUMAN | P3 | No uptime monitoring; optional. |
| OPS-007 | NEEDS_HUMAN | P3 | Internal links gated on every deploy; external links not monitored. (E1) |
| OPS-008 | PASS |  | Exact pins, lockfile, npm audit available. (E8) |
| OPS-009 | PASS |  | Dates on documents; daily rebuild for scheduled notes. (E5) |
| OPS-010 | NOT_ASSESSABLE |  | Live profiles unreachable. (E4) |
| OPS-011 | PASS |  | README and DEPLOY.md document build and deploy. (E5) |
| OPS-012 | NOT_ASSESSABLE |  | Post-deploy check needed (MA-10). (E4) |
