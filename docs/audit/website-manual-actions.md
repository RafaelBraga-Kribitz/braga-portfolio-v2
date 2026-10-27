# Website audit · actions for the owner

Audit of 27 Oct 2026 (`website-audit-report.md`). Each item needs the owner:
a legal decision, an account only the owner holds, or a check against the live
site. The audit container could not reach `rafaelbragakribitz.com` or
`rafaelbraga-kribitz.github.io`: its network policy denies both hosts.
Ordered by priority. Nothing here was changed on the site.

## P1 · before the site is shared further

### MA-01 · Finish the legal pages (LEG-025, CONT-028, I18N-014)

The live Impressum, privacy notice and accessibility statement, in both
languages, still carry drafting notes written for before publication:

| Page | Text now online |
|---|---|
| Impressum (`vault/Legal/{de,en}/impressum.md`) | "Draft. A check of the disclosure obligations (WKO …) is recommended before publication. Not legal advice." |
| Privacy (`privacy.md`) | "… certification under the EU-US Data Privacy Framework will be checked before publication" and the note "Draft … Open (item 5 of the checklist) …" |
| Accessibility (`accessibility.md`) | "Planned — One pass with a screen reader (NVDA) before publication" |

To do: settle each open point, then remove the notes or reword them as
current facts. The decisions behind them:

1. **Classification of the site (LEG-001, LEG-002).** The Impressum calls it
   private and non-commercial with no goods or services. That reading holds
   for a portfolio used for job seeking. A disclosure under MedienG §25 is
   owed by every website. ECG §5 is doubtful for a non-commercial site, and
   keeping it costs nothing. If in doubt, ask the WKO or a lawyer once.
2. **Transfer to the USA (LEG-008).** Look up GitHub, Inc. on
   <https://www.dataprivacyframework.gov/list>. If it is listed, state the
   transfer basis (adequacy decision of 10 Jul 2023, DPF). If it is not,
   name the safeguard (standard contractual clauses in GitHub's terms).
3. **E-mail recipients (LEG-006).** Mail to `hello@rafaelbragakribitz.com`
   is handled by easyname and, per `DEPLOY.md`, may be forwarded to a Gmail
   mailbox. Name the providers that actually receive the mail (easyname
   GmbH, Vienna; Google, if forwarding is on) in the "Contact" section.
4. **Screen-reader pass (A11Y-022, A11Y-036).** Do the NVDA pass, then
   update the statement's testing block and its dates.

Edit the German originals first. The English pages say they are
translations (`translationStatus: draft`); set them to `approved` when they
match.

## P2 · discoverability and credibility

### MA-02 · Experience dates on the About page (CONT-005, AEO-018, UX-028, CONT-021)

The About page's experience table has one row (BioSynCare, 2023–2026). The
page also mentions startups the owner founded and the Paraguay campaign, and
the essay says "I spent twenty years buying marketing technology". A recruiter
will look for those years in the table. Options: add the earlier roles with
dates, or publish the CV (a LaTeX source already exists at
`handoff/ds-update/cv/braga-cv.tex`). The audit made no change here and
invented no dates.

### MA-03 · Claims only the owner can support (LEG-018, CONT-004)

- "part of the campaign that helped elect Mario Abdo Benítez": keep evidence
  in case anyone asks (a role, a reference).
- The About footnote gives 46.43% against 42.73% as the "official count of
  the electoral tribunal, TSJE". Those figures match the TSJE's preliminary
  count. The final tally of valid votes is usually cited as 48.96% against
  45.08% ([Wikipedia](https://en.wikipedia.org/wiki/2018_Paraguayan_general_election)).
  The 3.7-point margin holds either way. Suggest "preliminary count (TSJE)",
  or the final figures with their source.

### MA-04 · Search Console and Bing Webmaster Tools (SEO-005, SEO-037, OPS-001…003, PERF-004)

1. Search Console → Add property → **Domain** `rafaelbragakribitz.com` → add
   the TXT record at easyname → verify.
2. Submit `https://rafaelbragakribitz.com/sitemap.xml`.
3. Run the [Rich Results Test](https://search.google.com/test/rich-results) on
   `/en/`, `/en/about/` and one project page to confirm the new JSON-LD
   (Person, ProfilePage, Article).
4. Bing Webmaster Tools → Import from Search Console.
5. After a few weeks, check Pages → "Not indexed" and the Core Web Vitals
   report (field data appears only once traffic exists).

### MA-05 · Domain, HTTPS and DNS (SEC-001, SEC-002, SEC-023, SEO-022, DEP-020)

- Settings → Pages: custom domain `rafaelbragakribitz.com`, DNS check green,
  **Enforce HTTPS** ticked.
- In a browser: `http://rafaelbragakribitz.com/` → `https://…`;
  `https://www.rafaelbragakribitz.com/en/` → apex;
  `https://rafaelbraga-kribitz.github.io/braga-portfolio-v2/en/work/` → the
  same path on the domain.
- easyname DNS: only the records listed in `DEPLOY.md` on `@` and `www`; no
  parking A records left; the `_github-pages-challenge-…` TXT record present.

### MA-06 · Refresh social previews (SOC-007, SOC-008)

After the domain move, paste `https://rafaelbragakribitz.com/en/` and each
project URL into LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/)
so LinkedIn drops its cached preview.

### MA-07 · Profile consistency (AEO-014, SOC-009, SOC-010, OPS-010)

Check that the LinkedIn headline and GitHub bio say "Marketing Data Analyst"
and link to `https://rafaelbragakribitz.com/`. Both profiles are now in the
site's `sameAs` and should point back to the site.

### MA-09 · Personal e-mail in the public repository (DEP-017)

`handoff/ds-update/cv/braga-cv.tex` (line 72) publishes a personal Gmail
address in plain text. The site itself keeps its address out of the HTML
(`src/lib/contact.mjs`). If that address should not be harvestable, replace it
in the file with `hello@rafaelbragakribitz.com`. Removing it from git history
needs a history rewrite and a force-push, which is the owner's decision.

## P3 · optional

### MA-08 · AI crawler policy (AEO-015)

`robots.txt` allows every crawler, AI crawlers included. If that is the intent,
no action. To opt out of model training while staying in search, add
`User-agent: GPTBot`, `Google-Extended`, `CCBot` … `Disallow: /` groups in
`src/pages/robots.txt.ts`.

### MA-10 · Re-check after the next deploy (DEP-022, OPS-012)

After this branch is merged and deployed:

1. Open `view-source:https://rafaelbragakribitz.com/en/` and check for a
   `<script type="application/ld+json">` block.
2. Open a maths note, e.g. `/en/notes/sphere/`, and read its description.
3. Check that `/nope/` returns the 404 page.

### MA-11 · Smaller content decisions

- SEO-024: 19 tag pages per language list a single entry. Consider `noindex`
  below two entries.
- SEO-023: near-duplicate notes `arithmetic-n-th-term-2` /
  `arithmetic-hmtbcth-term`, `jacobian-matrix` / `jacobian-matrix-f`,
  `unemployment-rate` / `unemployment-rate-delta-ue`: merge or differentiate.
- SEO-031: 28 titles run past 70 characters, the German essay's to 127. A
  `seo_title` property shortens the `<title>` without changing the H1.
- LEG-016, ASSET-006: credit the photographer if someone else took the
  portrait.
- DEP-018: the public repository has no LICENSE. Add one if others may
  reuse the code; without one, all rights are reserved.
- SEC-016: katex 0.19 (via mermaid) clears two low advisories. Build-time
  only, nothing is shipped; upgrade when mermaid allows it.
- SEC-004/005/006/009: GitHub Pages cannot send security headers. Moving to
  a host that can (Cloudflare Pages, Netlify) would allow CSP,
  frame-ancestors and Referrer-Policy. Low value for this site.
