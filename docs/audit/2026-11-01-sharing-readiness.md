# Sharing readiness — 1 November 2026

Status: implementation in progress. This report distinguishes the starting-tree
checklist from evidence collected during execution. No launch approval is implied.

## Scope and decisions

Review and execute PR #32's checklist for recruiters and data professionals.
CV comes last, after a long owner interview and a private facts bank. Keep the
existing Astro/design system. Preserve career facts, project numbering, legal
approval and German draft flags until the owner settles them.

## Added checks

Section 11 covers technical-note correctness, analytical precision, attribution,
reproducibility, modelling limitations, confidentiality, recruiter comprehension,
URL preservation, pull-request CI and no-script contact. Section 12 records the
owner's interview/facts-bank/CV sequence. No private facts bank has been created
in this public repository.

## Evidence collected

- Original dependency install was blocked by sandbox network access. An allowed
  escalated install succeeded using the lockfile; no dependency upgrades.
- Initial Python AST scan: 903 Python-labelled code blocks, no syntax errors.
  Separately, 35 Markdown fences in 27 notes include malformed Python and
  editorial material. This is not a numerical correctness review.
- Live HTTP observations are in `2026-11-01-origin-http.json`: HTTP redirected
  to HTTPS; www to apex; GitHub project work URL to the same custom-domain path;
  tags and feed returned 200; two unknown paths returned 404. Root returned
  HTML at `/`, so its client-side redirect still needs browser verification.
  HTTP alone does not establish deployed commit, designed 404 appearance, DNS
  account settings, mailbox delivery or rich-result validity.

## Supported analytical corrections

Both language versions now say 8.1% for 58/720 Styrian postings; ignored
predictions deliver no business value rather than having zero precision;
identical weak priors do not prove data dominance; and the warehouse model
supports site validation before procurement, given proxy measurements and
missing supplier quotes. No underlying model outputs or career claims changed.

## Verification and remaining work

Final-tree results will be recorded after implementation and review. Owner
approval, live deployment, real-device/screen-reader checks, external-account
checks and interview work remain open unless explicitly evidenced below.

## Contact decision

The owner explicitly chose to keep the address hidden from HTML. The review
found that About's no-JavaScript fallback has no accessible readable address
and its link leads to the same contact section. This limitation remains open
in 11.10; do not label it an accessibility pass. Script-enabled Copy/Open and
truthful fallback labelling are separate checks.

## Project evidence follow-up

See `2026-11-01-project-evidence.md` for exact source commits and limitations.
Both language versions now include the campaign's unverified cost/FX/population
inputs and MMM's weak TV recovery. Energy is explicitly a July foundation
snapshot, with a link to the newer repository state. Job-market regional
exclusivity and an unpinned test count were removed. A repository README
comparison is not an independent reproduction of any of the five projects.

## Election source correction

Directly inspected the government statistical yearbook (table 5.3.1, printed
page 198) after the old audit and portfolio disagreed. Final totals are
1,206,067 against 1,110,464, a 95,603-vote lead. Positive/valid candidate votes
are 2,463,441; all ballots cast are 2,597,989. The corresponding margins are
3.88 and 3.68 percentage points, respectively. The older audit incorrectly
said the margin stayed the same with either denominator. See
`2026-11-01-election-denominators.md` for sources and arithmetic.

About and the project use the unambiguous vote lead in both languages; the
essay chart names the valid-vote denominator. The repository's +3.70 Series A
modelling convention stays explicitly separate; no upstream model refit or
campaign contribution is claimed by this editorial correction.

## Independent review

Source and notes reviews found no critical defect after the two numerical
input-validation fixes. The final broad review confirmed the election table.
A nonblocking desktop focus-order issue remains: header controls precede doors
in DOM order while their visual order differs. Every control is reachable;
this is not reported as an automatic WCAG failure. Revisit with manual keyboard
QA rather than silently changing the owner's header layout.

The preliminary browser gate run was stopped after later source changes made
its build stale. It supplies no final pass/fail claim. Final verification runs
on the completed implementation instead.

## Owner steering, 1–2 November

The owner delegated adversarial German proofreading and asked to validate both
languages. Eleven German texts have been reviewed alongside EN; the UI review
is being applied. Language clearance does not approve career facts, statutory
disclosures, account settings or publication rights. Legal documents stay drafts.

The owner confirmed Gmail receives mail and said no contact enquiries have yet
arrived; correspondence would normally be kept, with flexibility about retention.
Privacy copy now names the easyname-to-Gmail chain and removes the unsupported
promise to delete after replying. The notice states purpose-limited retention;
the owner must apply that rule in Gmail. No fixed automatic deletion schedule
is claimed, and no mailbox setting was changed.

The execution environment restarted overnight. Repository edits and commits
survived; temporary logs did not. Final verification must be rerun and its
results saved in the repository rather than inferred from missing logs.
