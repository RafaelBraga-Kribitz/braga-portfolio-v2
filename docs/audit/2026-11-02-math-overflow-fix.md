# Formula overflow fix — 2 November 2026

The bounded repair removes renderer-added continuation indentation and gives four mathematical examples compact equivalent author layouts. The actual Sätteri/KaTeX pipeline now fits every display formula on the 11 diagnosed pages at 320px in light and dark themes: 22 contexts, 108 formula boxes, zero formula or document horizontal overflows, minimum active formula base font 13px. This is focused validation, not a rebuilt full-site result.

## Changes

- `math-fit.mjs`: generated continuation rows keep their leading mathematical operator and receive no extra quad. Authored TeX and grouped/managed author spacing remain intact. No width margin, fit step, font-size floor, CSS, overflow behavior, or gate was changed.
- Graph definition: the example has separate aligned rows for `V={A,B,C}`, `E={{A,B},{B,C}}`, and `G=(V,E)`. Its undirected adjacency remains `[[0,1,0],[1,0,1],[0,1,0]]`.
- Learning-rate schedules: retain the warmup branch and both range conditions; define Δη as the peak-minus-floor range and use the shorter cosine-branch expression. Cosine and progress definitions have their own aligned rows. The positive warmup/total domain `0<W<T` is explicit. Initial, warmup, cosine midpoint, and terminal values remain unchanged.
- Median: separate the odd and even equations, with `n=2m−1` and `n=2m` stated beside their corresponding equations. The index mapping `m=(n+1)/2` or `m=n/2` remains explicit, as do sorted order statistics. This preserves both branches while avoiding an oversized MathML cases block.
- Saddle points: separate zero gradient, negative minimum eigenvalue, and positive maximum eigenvalue into three aligned rows; explicitly state that all three conditions hold together. Original caveats and discussion remain intact.

No mathematical terms or conditions were deleted. No global shrinking, horizontal scrolling, clipping, hidden content, or weaker gates were introduced.

## Root cause and implementation feedback

The initial read-only DOM experiment removed indentation while holding `data-w` fixed. The actual pipeline also recomputes the width estimate, which can choose a larger font. After the initial renderer change and graph/schedule layouts, median still measured 299px in 288px at 16.94px, and saddle 290px at 15.16px. This justified the two additional note layouts rather than changing the global width model. A compact median cases block still grew to an oversized font; separate parity equations finally fit at 19.2px.

## Regression tests

Failing tests were written and run before implementation. Artifacts are `math-fit-red.log`, `math-note-red.log`, and `math-note-additional-red.log` under `/workspace/readiness-artifacts/2026-11-02/`.

Passing commands:

- `node tests/unit/math-fit.test.mjs`: seven tests, including no generated continuation quad, preservation of authored managed/grouped quad spacing, and existing relation/product break and fit-range tests.
- `node tests/unit/math-note-layout.test.mjs`: four tests. Parse the authored graph edge pairs and compare the original adjacency; check exact schedule definitions/conditions plus five known endpoint/interior values and eight comparisons to the expanded expression; check five odd/even median datasets against original order-statistic indices and known outputs; check saddle classification against the original conjunction for six stationary/nonstationary/mixed-sign/one-sided/zero-eigenvalue examples.
- `python scripts/notes/validate.py`: 931 Python fences syntax-valid, 34 reviewed examples execute, six Jacobian references and 25 input-domain rejection checks pass.
- `npm run vault:check`: 553 notes, 548 published; zero errors and warnings, eight informational notes.
- `git diff --check`: clean.

## Browser coverage

`/workspace/readiness-artifacts/2026-11-02/math-focused.mjs` renders the current authored display TeX through the actual Sätteri math guard, KaTeX fitter, and math wrapper plugins. It injects those resulting formula wrappers into the unchanged built page positions served from the root `dist`, waits for project fonts, then measures all formula boxes and active font sizes. This checks the changed pipeline and notes with the site's real column/CSS environment without doing a full build. It performs the same width comparison as G-17 and separately checks document horizontal overflow. It does not modify production or built files.

Final coverage: bias variance (1 formula), conjugate prior (7), expanded binomial (7), Fourier (1), graph definition (27), latent expected log likelihood (4), learning rate (2), median (2), quantiles (1), perplexity (1), saddle (1); each in light and dark at 320×844. That is 54 formulas per theme, 108 total. Exactly one formula variant is active in every box. The graph, median and saddle examples render at 19.2px; the schedule's minimum is 18px; some existing conjugate/Fourier/latent/perplexity formulas retain the 13px floor.

Evidence: `math-focused-rendered.json`, final `math-focused-results.json`, and the intentionally failing first actual-pipeline run `math-focused-first-pass.json`. The earlier read-only diagnosis and artifacts remain intact.

## Limits and handoff

The controller must build the current source and rerun the complete site gate matrix, including other widths and any variants selected there. No full-site build or gates were run by this task, and the old baseline remains the measured 826-page/2262-context run with 33 failures until superseded. This focused repair does not claim a zero-failure full-site result. Independent review is expected after this scoped commit. No publishing or push was performed.
