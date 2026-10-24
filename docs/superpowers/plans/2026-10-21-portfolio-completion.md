# Portfolio Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the portfolio from its current green, deployed draft state to an owner-approved, legally reviewed, visually inspected release with one authoritative status record.

**Architecture:** Treat root `HANDOFF.md` as the latest build-state document. Treat `handoff/` as immutable design/source evidence and `docs/handoff/` as historical agent journals that must be verified against current code before acting. Complete content decisions and editorial work before the final visual and accessibility review; keep the Charts specimen rebuild as a separate design-artifact task.

**Tech Stack:** Astro 7, TypeScript, Markdown/Sätteri, Preact islands, Node 22, Playwright, GitHub Pages.

**Spec:** `HANDOFF.md`, with immutable supporting evidence in `handoff/HANDOFF.md`, `handoff/AUDIT.md`, `handoff/README.md`, and historical findings in `docs/handoff/`.

## Global Constraints

- Owner decisions outrank all handoff documents; the current implementation handoff outranks historical agent journals.
- Do not edit files under `handoff/`; they are received design/source evidence.
- Keep both `/en/` and `/de/` route trees, correct `hreflang`, and the German draft mark until the owner approves German copy.
- Content pages carry no JavaScript except the pre-paint theme script and the recorded progressive code-panel exception; Preact is limited to tools.
- Preserve the no-inline-style, no-third-party-request, accessibility, contrast, and responsive gates.
- Run with Node 22 for release parity; install Playwright Chromium before the full gates.
- Do not claim completion from automated gates alone: German quality, legal accuracy, facts, and specimen fidelity require human review.

## Review Focus

- Conflicting source facts must be resolved by the owner or explicitly documented; no agent should silently choose among them.
- German text must retain identical meaning and figures while using natural Austrian conventions and fitting at 320px.
- Legal text must match the actual production host and must not claim manual accessibility checks that were not performed.
- Soft hyphens may remain in visible headings but must not leak into metadata, canonical labels, or listing text.
- The final review must cover real browser behavior in both themes at 320, 390, 768, 1024, 1280, and 1440px, not just successful builds.

---

### Task 1: Establish one authoritative status and decision record

**Files:**
- Create: `DECISIONS.md`
- Modify: `HANDOFF.md`
- Modify: `DEPLOY.md`

**Interfaces:**
- Consumes: settled decisions in `handoff/HANDOFF.md` §2 and §7, `handoff/AUDIT.md` §5–§6, and build decisions in root `HANDOFF.md` §2.
- Produces: a dated decision ledger and a current handoff that later tasks can update without consulting stale workflow reports.

- [ ] **Step 1: Add an inventory check for handoff authority**

  Document these roles in root `HANDOFF.md`: root handoff = current status; `handoff/` = immutable source; `docs/handoff/` = historical raw reports.

- [ ] **Step 2: Write `DECISIONS.md`**

  Record all applied D-entries, their current values, reasons, rejected alternatives, and whether each is owner-approved or an implementation default awaiting approval.

- [ ] **Step 3: Correct stale deployment and branch status**

  Record that PR #1 is merged, `main` is current, the repository is public, `SITE_BASE=/braga-portfolio-v2/`, the GitHub Pages workflow succeeded, and the live project-site URL is `https://rafaelbraga-kribitz.github.io/braga-portfolio-v2/`.

- [ ] **Step 4: Verify documentation consistency**

  Run: `rg -n "draft pull request|private repository|Pages.*needs|build/pages.*open" HANDOFF.md DEPLOY.md README.md`

  Expected: no statement incorrectly describes the current merged/public/deployed state.

- [ ] **Step 5: Commit**

  Commit message: `docs: reconcile portfolio handoffs and decisions`

### Task 2: Resolve the owner decision pack

**Files:**
- Modify: `DECISIONS.md`
- Modify as approved: `src/content/**`, `src/lib/i18n.ts`, `src/lib/catalogue.ts`, `src/lib/site.ts`, `scripts/assets/build-assets.mjs`

**Interfaces:**
- Consumes: owner answers and the unresolved items in root `HANDOFF.md` §4 plus `docs/handoff/agent-open-items.md`.
- Produces: fixed facts and style choices for editorial, legal, and release tasks.

- [ ] **Step 1: Obtain decisions on identity and facts**

  Confirm BioSynCare `2023–2026`; preferred location wording; Marketing Data Analyst versus Marketing Data Science wording; the essay's “twenty years” claim; Styria `58`; Paraguay `3.70 pp` versus About's `3.9`; and the actual flaw behind the MMM page's under-revision status.

- [ ] **Step 2: Obtain decisions on presentation**

  Confirm 60ch versus 64ch; spaced en dash; five-state status vocabulary; “Others” versus “Notices”; German footer/chrome labels; German gender convention; tool status/presets; public Gmail versus alias; share-card copy; and the English-only share card on German pages.

- [ ] **Step 3: Obtain decisions on editorial judgements**

  Confirm agent-written home/tool/kitchen-sink copy, project accent choices, Energy metric strip, Decision Analytics synthesis, Warehouse derived wording, About placeholders, and whether Writing may promise notes before any note is published.

- [ ] **Step 4: Obtain decisions on external scope**

  Confirm GitHub Pages versus an EU host/custom domain, legal-review route, Mermaid support now versus formally deferred, and whether the standalone Charts specimen rebuild is part of launch or post-launch work.

- [ ] **Step 5: Record every answer before editing dependent copy**

  Expected: no unresolved decision is buried only in `docs/handoff/agent-open-items.md`.

- [ ] **Step 6: Commit**

  Commit message: `docs: record owner portfolio decisions`

### Task 3: Complete the German editorial pass

**Files:**
- Modify: `src/content/projects/de/*.md`
- Modify: `src/content/pages/de/*.md`
- Modify: `src/content/writing/de/*.md`
- Modify: `src/content/legal/de/*.md`
- Modify: `src/lib/i18n.ts`
- Modify: `src/lib/catalogue.ts`
- Modify: `src/components/tools/*.tsx`
- Modify: `src/lib/tools/*.mjs`

**Interfaces:**
- Consumes: approved terminology and style decisions from Task 2; matching English files as the meaning source.
- Produces: owner-reviewable Austrian German with identical facts, numbers, and limitations.

- [ ] **Step 1: Edit EN/DE pairs side by side**

  Cover the five projects, About, essay, legal pages, home/index chrome, both tools, and the system page's German headings/chrome. Keep `translationStatus: draft` during editing.

- [ ] **Step 2: Normalize Austrian conventions**

  Enforce Jänner, de-AT dates and separators, „…“ quotes, non-breaking value/unit spaces, consistent technical glosses, and the owner-selected gender convention.

- [ ] **Step 3: Verify meaning and figures**

  For every changed German paragraph, compare claims, numbers, limitations, statuses, and links with English; additions and omissions are failures.

- [ ] **Step 4: Verify narrow layouts**

  Build and run the German routes through gates at 320 and 390px; inspect long compounds and table scrollers manually.

- [ ] **Step 5: Request owner approval**

  Only after approval, set the relevant `translationStatus` values to `approved`, update `DRAFT_LANGS` and the gates' draft-language default together, and replace the footer's “copy awaiting approval” status.

- [ ] **Step 6: Run verification**

  Run: `npm run verify`

  Expected: 0 diagnostics, 57 unit tests passing, 36 pages built, 420 rendered contexts, 0 failing gates.

- [ ] **Step 7: Commit**

  Commit message: `content: complete and approve German portfolio copy`

### Task 4: Finish factual and legal verification

**Files:**
- Modify: `src/content/legal/{de,en}/*.md`
- Modify as required: `src/content/projects/{de,en}/*.md`
- Modify as required: `src/content/pages/{de,en}/about.md`
- Modify as required: `src/content/writing/{de,en}/*.md`
- Modify: `DECISIONS.md`

**Interfaces:**
- Consumes: owner decisions, source files under `handoff/source-content/`, legal specimens, and actual hosting configuration.
- Produces: traceable content claims and legal pages that describe the deployed site truthfully.

- [ ] **Step 1: Fact-check the legal pages against the design source**

  Compare German pages with `handoff/specimens/Design System v2 - Templates.dc.html` §02 and D-014; verify English is a faithful translation.

- [ ] **Step 2: Align privacy wording with the host decision**

  Remove internal checklist references; name the actual host, international-transfer basis, logging/retention facts, and any processor agreement accurately.

- [ ] **Step 3: Validate accessibility claims**

  Perform or remove claims about keyboard testing, 200% zoom, and NVDA. Record the test date and known limitations.

- [ ] **Step 4: Resolve project and About source conflicts**

  Apply the owner decisions from Task 2 and preserve an audit note for any deliberate departure from source frontmatter.

- [ ] **Step 5: Verify the essay's research citation**

  Check the paper itself or its authoritative full text for the reported 15% versus 5%, AUC 0.92 versus 0.79, five profiles, 200,000 pages, affiliations/conflicts, DOI, and publication date. Add the DOI link if approved.

- [ ] **Step 6: Obtain qualified legal review before removing legal draft warnings**

  Expected: the legal pages remain explicitly draft/not legal advice until this check is complete.

- [ ] **Step 7: Run verification and commit**

  Run: `npm run verify`

  Commit message: `content: verify portfolio facts and legal pages`

### Task 5: Close the remaining implementation and documentation gaps

**Files:**
- Modify: `src/pages/[lang]/system.astro`
- Modify: `src/lib/catalogue.ts`
- Modify: `src/layouts/Base.astro`
- Modify: `src/lib/routes.ts` or add a focused text-normalization helper
- Test: `tests/unit/*.test.mjs`
- Modify: `src/content/README.md`
- Modify: `BUILD-BRIEF.md`
- Optional create: `scripts/design-system/gen-obsidian-snippet.mjs`

**Interfaces:**
- Consumes: current token files, route metadata, and the decisions from Tasks 1–2.
- Produces: a complete kitchen sink, accurate tool summaries, clean metadata, and non-stale contributor documentation.

- [ ] **Step 1: Add failing tests for generated system data**

  Assert that the system page's token table and type scale are derived from `design-system/tokens.css`, not duplicated strings.

- [ ] **Step 2: Generate the token table and type scale in `system.astro`**

  Render the generated blocks in both language routes while leaving the Markdown authoring examples intact.

- [ ] **Step 3: Correct tool listing copy**

  Replace “Eight rates” with “Eight metrics”; describe the two error prices as inputs; and state that A/B duration also depends on daily traffic. Mirror the corrections in German.

- [ ] **Step 4: Add failing metadata tests for discretionary hyphens**

  Assert that `<title>`, Open Graph/Twitter titles, listing rows, and end bars contain no U+00AD or U+2060, while visible headings can still wrap safely.

- [ ] **Step 5: Implement metadata/display-title normalization**

  Keep line-break opportunities in visible body headings through markup/CSS, not invisible characters propagated into metadata.

- [ ] **Step 6: Reconcile stale build documentation**

  Update dependency, MathML, pre-paint-script, gate-count, branch, and deployment statements in `BUILD-BRIEF.md`, `README.md`, and root `HANDOFF.md`.

- [ ] **Step 7: Decide optional maintenance items**

  Either add the Obsidian snippet generator and Mermaid build support with tests, or record both as explicitly deferred/non-launch scope in `DECISIONS.md`.

- [ ] **Step 8: Run verification and commit**

  Run: `npm run verify`

  Commit message: `fix: close remaining portfolio implementation gaps`

### Task 6: Perform integration and five-lens release review

**Files:**
- Modify: any production file required by confirmed findings
- Add review evidence under an agreed non-production artifact directory
- Modify: `HANDOFF.md`

**Interfaces:**
- Consumes: owner-approved content and all completed implementation tasks.
- Produces: visual/manual evidence and a release candidate with no confirmed findings.

- [ ] **Step 1: Run the full automated baseline**

  Run: `npm ci`, `npx playwright install chromium`, `npm run verify` under Node 22.

  Expected: 0 diagnostics, lint pass, 57/57 unit tests, 36 pages, 420 contexts, 0 failures.

- [ ] **Step 2: Verify route and metadata completeness**

  Check every EN/DE route, internal link, `hreflang`, sitemap, RSS, robots, 404, canonical, Open Graph metadata, favicon, share card, and noindex system page.

- [ ] **Step 3: Capture and inspect screenshots**

  Cover every page type and every project status at 1440, 768, and 320px in light and dark; add 390px where German compounds or the compact shell are material.

- [ ] **Step 4: Review through five lenses**

  Facts/honesty; German; specimen fidelity; rules/accessibility; completeness against handoff A–F. Reproduce each finding before fixing it.

- [ ] **Step 5: Perform manual accessibility paths**

  Keyboard-test theme, language, navigation, contents, scrollers, code controls, and tools; test focus visibility, reduced motion, 200% zoom, print, screen-reader live output, and no-JS fallbacks.

- [ ] **Step 6: Repeat until the review is dry**

  Run `npm run verify` after every fix round. Do not close owner decisions as engineering findings.

- [ ] **Step 7: Commit**

  Commit message: `fix: complete portfolio integration and release review`

### Task 7: Publish the approved release

**Files:**
- Modify: `HANDOFF.md`
- Modify if selected: `astro.config.mjs`, `src/lib/site.ts`, `public/CNAME`, legal pages

**Interfaces:**
- Consumes: dry review and approved host/domain choice.
- Produces: a live release whose canonical URLs and legal text match its host.

- [ ] **Step 1: Confirm the release target**

  The current working deployment is the public GitHub Pages project site at `https://rafaelbraga-kribitz.github.io/braga-portfolio-v2/`; retain it or implement the approved custom/EU-host alternative.

- [ ] **Step 2: Run the release gate on the exact commit**

  Run: `npm run verify`

- [ ] **Step 3: Push `main` and watch the Pages workflow**

  Expected: build and deploy jobs both succeed; `/`, `/en/`, `/de/`, canonical URLs, and share assets return 200.

- [ ] **Step 4: Update the root handoff to final status**

  Record the release commit, workflow URL, deployment URL, verification counts, remaining post-launch items, and all accepted owner decisions.

- [ ] **Step 5: Commit**

  Commit message: `docs: record approved portfolio release`

### Task 8: Rebuild the standalone Charts specimen (separate scope)

**Files:**
- Modify only in a dedicated design-source workflow: `handoff/specimens/Design System v2 - Charts.dc.html` or a successor outside the immutable received package
- Modify: `DECISIONS.md`

**Interfaces:**
- Consumes: the re-derived palette and C-01 to C-09 definition from the design handoff.
- Produces: a current design specimen; it does not block the Astro release unless the owner explicitly puts it in launch scope.

- [ ] **Step 1: Preserve the received handoff**

  Do not overwrite the immutable original; copy it to an explicitly versioned working design location if the rebuild proceeds.

- [ ] **Step 2: Rebuild C-01 to C-09**

  Remove hard-coded legacy palette arrays and retired notation/highlight controls; use current tokens and square marks.

- [ ] **Step 3: Re-run contrast, colour-vision, responsive, and specimen checks**

  Expected: all chart marks clear the settled contrast rules in both themes and all nine charts match the closed dictionary.

- [ ] **Step 4: Record completion separately from the website release**

  Commit message: `design: rebuild v2 charts specimen`

