# Rendered gate fixes — 2 November 2026

## G-05: theme control compressed by the language fallback

The complete gate run reported G-05 failures on 22 pages, in the 390px light and dark contexts. A focused Playwright check against actual generated HTML in `/workspace/readiness-final-src/dist` reproduced the shared header defect on an English-only note, essay and the 404 page: `.shell-theme` measured **41.734375 × 44px**, with computed `flex-shrink: 1`. The visible `EN · English only` label competed for space in the mobile controls row. Both English and German homes, plus the 320px contexts, passed.

The source fix shortens only the visible English suffix to ` · only`, yielding `EN · only`. The full accessible name remains `English only · German home`; the German suffix remains ` · nur Deutsch`. `.shell-theme` now has `min-width: 44px` and `flex-shrink: 0`, preserving its minimum target even when adjacent text needs room. No gate threshold, maths styling or contact behavior changed.

`tests/browser/shell-targets.mjs` checks actual rendered target bounds and document overflow at 320px and 390px in both themes across EN/DE home, an EN-only note, an EN-only essay and 404: 20 contexts. Its `--source` mode asserts the source CSS/copy constraints and reversibly injects those current rules into the previously generated pages, without changing dist. Missing-twin accessible labels are also asserted.

Evidence in `/workspace/readiness-artifacts/2026-11-02/`:

- `shell-targets-before.json` / `.log`: six failing contexts, all target-width failures; no horizontal overflow.
- `shell-targets-after.json` / `.log`: the source overlay passes all 20 contexts, with 44px minimum width and height and no horizontal overflow; accessible fallback labels unchanged.

Lint and `git diff --check` passed. No full build or full gate run was launched in this scoped fix. After the controller rebuilds the final tree, run `node tests/browser/shell-targets.mjs --dir <final-dist> --out <artifact.json>` without `--source` to check the compiled result. G-17 findings are separate and were not changed here.
