# English adversarial proofreading — 2 November 2026

Read-only product review; only this report was written. Read all seven English essays, all five English projects, About, the three English legal documents, home copy, English chrome/catalogue and tool copy. No build or tests run. Personal career facts/CV, legal approval, known contact/header limitations and independent project reproduction remain outside this pass; existing audit findings are not repeated.

## Findings

- `src/lib/tools/ab-sample-size.mjs:118`: the verdict says a sample will “reach a … lift”. Sample size determines planned power to detect an assumed effect; it does not produce or guarantee that effect. Suggested wording: “At the selected power, plan for {per} visitors per arm to detect a {lift} lift; estimated recruitment takes {days} — run {weeks}.” The existing normal-approximation limitation can remain. Match the German verdict's meaning when adjusting this shared tool.
- `vault/Essays/en/from-littles-law-to-marketing-science-review.md:113`: the sentence recommends Bayesian MMMs, then calls Robyn, Meridian and PyMC-Marketing “tools for both”. That grouping misleadingly implies Robyn is Bayesian; Robyn's modelling uses ridge regression. Say “Open-source MMM tools include Meta’s Robyn; Bayesian options include Google’s Meridian and PyMC-Marketing.” Keep experimental tooling separate unless a named package actually supplies the intended experimental workflow. Source verification of the book's chapter-specific claims was not part of this proofread.

No other material grammar or recruiter-readability blocker was identified within this bounded source review. This is not a fresh factual certification, rendered-page accessibility review or verification of linked research and underlying project outputs.
