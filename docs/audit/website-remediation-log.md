# Website audit · remediation log

Changes made on branch `claude/beautiful-planck-1ec9y2` after the audit of
27 Oct 2026 (`website-audit-report.md`). Only defects that could be fixed
without a decision from the owner were changed. No visual change, no new
dependency, no change to legal text or to authored content.

## R-01 · Note excerpts read as sentences (SEO-007, SEO-039)

**Files:** `src/lib/vault/meta.mjs` (`excerpt()`, new `texText()`),
`tests/unit/vault.test.mjs`

**Why:** a library note without a `summary` gets its first prose paragraph
as one. That excerpt is the note's meta description, its RSS item and the
line under a related note. In most of the 524 notes the first paragraph is
the leftover between two display formulas or a lead-in to one, so search
results would have shown text such as ", S = 4\pi R^2", "(for a > 0)",
"or \#A" or "We are working on Churn Rate, defined by". The markup-stripping
regex also treated a single `=` or `_` as emphasis: "z = a + bi" became
"z a + bi", and "S_n" became "Sn".

**Change:**

- The excerpt is the first paragraph that reads as a sentence: at least 40
  characters, starting with a capital letter, a digit or a quote, and
  ending in sentence punctuation (or long enough to be cut anyway). If no
  paragraph qualifies, the first paragraph is still used, as before.
- The template label "What it tells me (Situation Awareness):" is dropped.
- Inline TeX becomes readable text through `texText()` (`\frac{4}{3}` → 4/3,
  `\pi` → π, `\mathbb{R}` → ℝ, `\le` → ≤, `\{0, 1\}` → {0, 1}).
- Inline maths is set aside before emphasis is removed, and only real
  emphasis is stripped (`**x**`, `*x*`, `_x_` at word boundaries, `==x==`,
  `~~x~~`).

**Before → after** (all 524 published notes):

| Description problem | Before | After |
|---|---|---|
| Contains raw TeX | 277 | 0 |
| Starts with punctuation | 76 | 0 |
| Ends mid-sentence (":", ",", "defined by") | 25 | 0 |
| Starts with the template label | 333 | 0 |
| Any page with a description under 50 characters | 54 | 7 (complete sentences, plus the tag index) |
| Duplicate descriptions | 9 groups | 5 (tag pages; three near-duplicate note pairs) |

Example, `/en/notes/sphere/`:

- Before: `, S = 4\pi R^2`
- After: `The sphere has volume V = 4/3π R^3 and surface area S = 4π R^2. The sphere is the 3D analogue of the circle: the set of all points in ℝ^3 at distance R from the center, defined by…`

**Verification:** new unit test "the excerpt reads as a sentence …" (TeX
cases, `=`/`_` preserved, fragment and lead-in skipped, fallback). The
existing excerpt tests are unchanged and pass. A full-corpus count was run
with `readNote()`, and the built HTML was rescanned (table above).

## R-02 · Vault content cache follows the note reader (DEP-007)

**File:** `src/lib/vault/loader.mjs`

**Why:** found while verifying R-01. Astro's content store skips any entry
whose digest is unchanged, and the digest covered only the note's text. A
change to `meta.mjs` (how titles, slugs and summaries are read) therefore
left every cached note with its old properties in
`node_modules/.astro/data-store.json`. The first rebuild after R-01 still
shipped the old descriptions. CI starts from a clean checkout, so
production was not affected. Local builds and `npm run verify`, however, did
not reflect the source.

**Change:** the SHA-1 of `meta.mjs` joins every note's digest, as the loader
already does for build-log notes and their inputs. A change to the reader
re-reads every note once.

**Verification:** rebuilt on top of the stale cache. The sphere note's
description changed from the old text to the new one without deleting the
cache.

## R-03 · Structured data: Person, WebSite, ProfilePage, Article (SEO-026…028, AEO-005, AEO-006)

**Files:** `src/lib/structured-data.ts` (new), `src/layouts/Base.astro`,
`src/layouts/Document.astro`, `src/pages/[lang]/index.astro`,
`src/pages/[lang]/about.astro`, `src/pages/[lang]/work/[slug].astro`,
`src/pages/[lang]/writing/[slug].astro`

**Why:** no page carried machine-readable identity (0 of 805). Search and
answer engines had to infer who the site is about.

**Change:** Base accepts `structuredData` (schema.org nodes) and renders one
`<script type="application/ld+json">` graph in the head:

| Page | Nodes |
|---|---|
| `/en/`, `/de/` | `WebSite` (publisher → Person) and `Person` |
| `/en/about/`, `/de/about/` | `ProfilePage`, whose `mainEntity` is the Person with the portrait |
| projects and essays (12 pages) | `Article`: headline, description, dates, image, author → Person |

Every value comes from `src/lib/site.ts` or the entry's own front matter:
name, role, location, GitHub and LinkedIn as `sameAs`; empty links (Kaggle)
are left out. By design there is no e-mail and no street address: the site
keeps its address out of the HTML (`src/lib/contact.mjs`). `<` is escaped so
no string can close the script element. Gate L-03 already treats JSON-LD as
data.

**Verification:** every JSON-LD block in `dist/` was parsed (16 pages: 2
WebSite, 2 Person, 2 ProfilePage, 12 Article). `@context` is checked, and
every `url`, `@id`, `mainEntityOfPage` and `image` is absolute on
`https://rafaelbragakribitz.com/`. Google's Rich Results Test needs the live
URL (manual action MA-04).

## Regression evidence

| Check | Before changes | After changes |
|---|---|---|
| `astro check` | 0 errors, 0 warnings | 0 errors, 0 warnings |
| `npm run lint` | pass | pass |
| Unit tests | 81 pass | 82 pass |
| `vault:check` | 0 errors | 0 errors |
| Build | 805 pages | 805 pages |
| Gates (805 pages, 2,168 rendered contexts, axe) | 0 failing | 0 failing |
| Runtime: console errors, 18 routes × 360/1920 px | 0 | 0 |
| Runtime: horizontal overflow, 18 routes × 360/1920 px | 0 | 0 |
| Lab LCP, 390 px, 4× CPU, ~1.6 Mbps | 0.81–1.48 s | 0.81–1.48 s (head grows by < 1 KB on 16 pages) |
| Lab CLS | 0–0.037 | 0–0.037 |

Not deployed: the changes reach the site when the pull request is merged
into `main` (the Pages workflow). See MA-10 for the checks after that deploy.
