# Independent semantic review of formula layout repair

Reviewed 2 November 2026 against HEAD `b8b6fd9`, before the scoped G-17 fix commit. Scope: working-tree `src/lib/math-fit.mjs`, the four amended notes, `tests/unit/math-fit.test.mjs`, and new `tests/unit/math-note-layout.test.mjs`. No code edits, build, browser run or test-suite rerun performed.

**Verdict: pass. No critical or important defects found in this diff.**

The graph example retains precisely vertices A/B/C and undirected edges {A,B}/{B,C}; separate V/E/G rows express the same ordered pair and adjacency. Median rewriting preserves one-based order statistics: odd n=2m−1 selects (n+1)/2, while even n=2m averages n/2 and n/2+1. Positive integer m and sorted values are explicit, including the singleton case.

The learning-rate expression substitutes Δη=ηmax−ηmin without changing either branch. With 0<W<T, its values remain zero at t=0, ηmax at W, (ηmax+ηmin)/2 halfway through annealing, and ηmin at T. The three saddle rows retain the conjunction of stationarity, a strictly negative minimum Hessian eigenvalue and a strictly positive maximum eigenvalue. No inequality became non-strict; no condition was dropped. These are the same indefinite-Hessian saddle conditions as the original, not a newly broadened characterization of every degenerate saddle.

The renderer removes only its own continuation-row quad prefix. Segment text, leading continuation operators, product continuation handling and original first-choice TeX remain unchanged. Managed author layouts bypass rewriting; grouped authored spacing is preserved. Existing top-level spacing separator behavior is unchanged. The regression test explicitly protects managed/grouped authored quads. The note tests tie semantic checks to authored formula tokens, then compare graph adjacency, known schedule values, median parity/index examples and saddle classification cases.

No CSS, font floor, fit margin, fit steps, overflow thresholds, content visibility or gate implementation changes appear in scope. The renderer continues to generate alternative layouts; this diff does not suppress formulas or relax a gate.

Inspected `/workspace/readiness-artifacts/2026-11-02/math-focused-results.json` and independently aggregated its stored measurements: 22 contexts, 108 formula boxes, zero formula overflow flags, zero document overflow flags, minimum active base font 13px, exactly one active variant per box. This supports the bounded 320px/light-and-dark result. It does not replace the controller's fresh build and complete gate matrix at other widths or bases. G-05 remains outside this review.
