# Recruiter readiness implementation plan

Goal: audit and execute TODO-BEFORE-SHARING.md for recruiters and data professionals; defer CV work until a long owner interview creates a verified facts bank.

Architecture: retain Astro, bilingual vault and existing design system. Fix reproducible engineering defects, inspect built output, and distinguish local evidence from deployed and owner-only checks.

Spec: TODO-BEFORE-SHARING.md and the owner's 1 November instruction to review and execute, CV last.

## Constraints
- Never invent career facts, approve translations or legal claims on the owner's behalf.
- Keep handoff/ read-only and existing project numbers stable.
- Do not merge or deploy without a final reviewable result.
- CV facts bank and CV are the final phase, after owner interview.

## Tasks
- [ ] Audit checklist against recruiter comprehension, attribution, reproducibility, data quality, confidentiality, contact and publication requirements; append actionable missing checks with evidence.
- [ ] Reproduce and fix deployment type error, unused-symbol hints and language draft configuration; verify check/lint/unit.
- [ ] Fix engineering navigation, accessibility, archives, mobile and SEO issues in section 5; verify generated pages and browser gates.
- [ ] Resolve stale documentation in section 6 without rewriting historical source material.
- [ ] Inspect note duplicates/titles and retain meaningful distinctions and links.
- [ ] Run full verification; review changes; record completed, owner-dependent, account/device-dependent and CV-deferred items accurately.
- [ ] Prepare the final interview phase, with source-attributed facts bank schema and question sequence; interview owner before writing CV.

## Review focus
Environment override must work in builds; German draft flags remain until owner approval; unavailable translations cannot promise a translated document; scripts must retain truthful no-JS links; mobile changes must pass existing style/accessibility gates.

## Progress
- Repository cloned at PR #32 head d56af98. No inherited implementation changes.
- npm ci started; awaiting result.
