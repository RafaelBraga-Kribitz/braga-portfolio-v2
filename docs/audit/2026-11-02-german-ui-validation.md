# German UI validation — 2 November 2026

This pass implements the corrections from [the German UI review](2026-11-01-german-ui.md) and the language clearance supported by [the German content review](2026-11-01-german-content.md). The user explicitly delegated adversarial German proofreading and validation. This is language and translation clearance, not legal, factual, model, rights, CV or publication approval.

## Corrections

- Replaced the missing-translation suffix `allein` with ` · nur Deutsch`; the English counterpart says ` · English only`. Existing accessible labels still identify the fallback home page.
- Replaced `Stichprobenbank` with the correctly declined `einen A/B-Stichprobenrechner` in the tool index description.
- Corrected confusion-matrix verdicts to `Bei … Fällen kosten Fehler …` and `Keine Fehlerkosten bei … Fällen`, retaining values, singular/plural nouns and model behavior.
- Corrected masculine `Essay` agreement in the keyboard-shortcut explanation.
- Rewrote the sample-size chart title and alternative text with `in Abhängigkeit vom Lift` and `logarithmische Skala`; the alternative text retains the eight-week ceiling and selected lift.
- Clarified the classifier lead as costs per false alarm and missed positive case.
- Applied the optional grammatical tags instruction `nach einem Tag oder Titel suchen`.

The review's proposed expansion of `PP` was intentionally not applied: TODO 3.3 documents that abbreviation as a convention. The About navigation label remains `Über`. English-only Notes explanations, numerical assumptions, source figures, CV facts and hidden-email HTML behavior are unchanged.

## Language status

`DRAFT_LANGS` is empty after the completed language review. The five DE project files, DE About, DE System and the DE AI-prospecting essay have `translationStatus: approved`. All eight were individually covered by the content review; these status changes approve their language, not their underlying factual claims.

All three German legal documents retain `translationStatus: draft`, and the templates continue to render per-document draft marks independently of the blanket language flag. Legal-provider and accessibility-text edits in other collaborators' working changes are outside this commit.

Gate L-07's default language list now matches the empty blanket list. The fixture self-test command explicitly passes `--draft-langs de`, preserving its missing-draft-mark regression coverage. Gate logic has not been relaxed. Related source comments and gate instructions now distinguish language review from individual document approval.

## Validation

- `npm run lint`: passed, including tokens and class-contract checks.
- `npm run test:unit`: all 12 test files passed. German model-output assertions cover cost shares, singular counts, no-positive cases and no-error cases; English outputs remain checked.
- `git diff --check`: passed.
- `ASTRO_TELEMETRY_DISABLED=1 npm run check`: passed over 122 files, with 0 errors, 0 warnings and 0 hints. Content sync also emitted the existing Obsidian queued-transform messages; this pass does not claim to resolve them.

No default build or browser gates were run in this scoped pass; the controller owns the integrated final build and rendered-page verification. In particular, final rendering must confirm that nonlegal DE pages have no blanket draft mark, legal draft marks remain, the longer language suffix fits the header, and fixture L-07 still detects a missing mark when explicitly enabled.
