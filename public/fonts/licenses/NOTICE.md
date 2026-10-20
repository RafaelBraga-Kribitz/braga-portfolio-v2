# Typeface attribution

`BKribitz` and `BKribitz Mono` are this project's typefaces: **modified, renamed cuts
of Geist and Geist Mono**, under the SIL Open Font License 1.1.

| Face | Derived from | Upstream licence |
| --- | --- | --- |
| BKribitz 400–900 + 400 italic | [Geist](https://github.com/vercel/geist-font) — Vercel, in collaboration with basement.studio; The Geist Project Authors | SIL OFL 1.1 — `OFL-Geist.txt` |
| BKribitz Mono 400 / 500 / 700 | [Geist Mono](https://github.com/vercel/geist-font) — as above | SIL OFL 1.1 — `OFL-Geist.txt` |

Geist declares no Reserved Font Name.

## What was changed

1. **About 165 glyphs added to every face** — Greek, maths operators,
   superior and inferior operators and letters, double-struck sets, arrows and currency
   signs Geist does not draw. They are this project's own construction
   (`scripts/fonts/bk_glyphs.py`), built from each face's measurements; a few
   start from a Geist letter (`ο` from `o`, `Δ` from `∆`).
2. **A slashed zero drawn into BKribitz** as the default `0`, and into its
   tabular, fraction, superior and inferior zeros. Geist Sans has none.
   BKribitz Mono's zero is Geist Mono's, already slashed.
3. **Subsetted** to Latin, Latin Extended-A/B, Greek, punctuation, super- and
   subscripts, currency, letterlike and number forms, arrows, maths and
   brackets.
4. **Renamed** to BKribitz and BKribitz Mono, as SIL OFL 1.1 clause 3 asks
   of a Modified Version, and so a locally installed Geist can never be
   substituted for these.

The site ships ten subsetted woff2 faces. `npm run fonts:desktop` builds the
whole family for installation — 100–900, upright and italic, for both — as
unsubsetted TTF, zipped with this notice and the licence.

Geist's own outlines, spacing, kerning and OpenType features are otherwise
untouched.

## History

These faces were cut from Inter and Fira Mono until 2026-10-17, and before
that were metric-compatible stand-ins for Söhne (Klim Type Foundry). No Söhne
outline, metric or kerning value is in them. The history is in
`docs/design-system/80-typography.md`.

The licence is reproduced in this folder.
Rebuild with `npm run fonts:build`.
