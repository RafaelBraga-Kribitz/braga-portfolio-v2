# Final precision fixes — 2 November 2026

Applied the two bounded findings from [the English proofread](2026-11-02-english-proofread.md).

The A/B verdict now describes planning sample size to detect an assumed lift at the selected power, rather than claiming that visitors produce that lift. English recruitment duration is explicitly estimated; German uses the matching `für die Rekrutierung ist mit … zu rechnen`. Formulas, parameters, calculated sample sizes, day/week formatting and the German `PP` convention are unchanged.

The Little's Law review now identifies Robyn's ridge regression separately from Bayesian Meridian and PyMC-Marketing. It no longer calls the three packages tools “for both” experiments and Bayesian MMM. Official READMEs fetched through the GitHub connector on 2 November 2026 confirm:

- [Meta Robyn](https://github.com/facebookexperimental/Robyn/blob/main/README.md): its introduction names ridge regression among its modelling techniques.
- [Google Meridian](https://github.com/google/meridian/blob/main/README.md): describes its Bayesian causal-inference basis.
- [PyMC-Marketing](https://github.com/pymc-labs/pymc-marketing/blob/main/README.md): identifies Bayesian marketing analytics and MMM.

Validation: updated exact EN/DE verdict expectations first; the targeted tools suite then failed exactly those two expectations (16 passed, 2 failed). After the wording fix, all 18 tools tests passed. The complete unit run passed all 12 test files; lint and `git diff --check` passed. Existing numerical, equation, typography and `PP` assertions remain intact. No check, build or browser gates were run; the controller owns final integrated verification.
