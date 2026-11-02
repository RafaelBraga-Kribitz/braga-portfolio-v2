# Recruiter readiness implementation plan

Goal: audit and execute TODO-BEFORE-SHARING.md for recruiters and data professionals; defer CV work until a long owner interview creates a verified facts bank.

Architecture: retain Astro, bilingual vault and existing design system. Fix reproducible engineering defects, inspect built output, and distinguish local evidence from deployed and owner-only checks.

Spec: TODO-BEFORE-SHARING.md and the owner's 1 November instruction to review and execute, CV last.

## Constraints
- Never invent career facts or legal approval. Language clearance follows the owner's explicit delegation.
- Keep handoff/ read-only and existing project numbers stable.
- Do not merge or deploy without a final reviewable result.
- CV facts bank and CV are the final phase, after owner interview.

## Tasks
- [x] Audit checklist against recruiter comprehension, attribution, reproducibility, data quality, confidentiality, contact and publication requirements; append actionable missing checks with evidence.
- [x] Reproduce and fix deployment type error, unused-symbol hints and language draft configuration; verify check/lint/unit.
- [ ] Fix engineering navigation, accessibility, archives, mobile and SEO issues in section 5; verify generated pages and browser gates.
- [x] Resolve stale documentation in section 6 without rewriting historical source material.
- [x] Inspect note duplicates/titles and retain meaningful distinctions and links.
- [ ] Run full verification; review changes; record completed, owner-dependent, account/device-dependent and CV-deferred items accurately.
- [ ] Prepare the final interview phase, with source-attributed facts bank schema and question sequence; interview owner before writing CV.

## Review focus
Environment override must work in builds; German legal draft flags remain; language clearance follows the owner’s delegated review; unavailable translations cannot promise a translated document; scripts must retain truthful no-JS links; mobile changes must pass existing style/accessibility gates.

## Progress
- Repository cloned at PR #32 head d56af98. No inherited implementation changes.
- Locked dependencies installed successfully; no dependency upgrades.

- Engineering commits: a793233, 60c8bcc. Scope reviews complete; nonblocking desktop header focus-order follow-up recorded.
- Notes commits: 53ec689, 6781758. Both P2 domain findings fixed and re-reviewed. Numerical validator: 931 syntax /34 executions /6 Jacobian references /25 invalid-domain cases.
- Evidence/content commits: faf338c, 529cbc3. No CV rows or personal role facts changed.
- Final default verify log: /tmp/portfolio-final-verify.log; separate SITE_BASE=/portfolio/, TAGS_LETTER_PAGES_FROM=1, DRAFT_LANGS=[] build log: /tmp/portfolio-variant-build.log. Variant is in /tmp/portfolio-variant-src; actual German draft flags remain unchanged.
- Owner ruling: KEEP address hidden from HTML; no readable static address/mailto. Record no-JS screen-reader limitation rather than claiming a pass.
- Pending owner questions: English-first versus both languages; actual easyname/Gmail delivery setup.
- No merge, deploy, private facts bank or CV interview has occurred.

## Resume, 2 November

- German content committed dfe5b69; UI and reviewed nonlegal status clearance committed 91741e5. User explicitly delegated adversarial German proofreading.
- Gmail confirmed; no contact enquiries yet. Intended retention is continued correspondence, not automatic deletion after reply. No mailbox configuration changed.
- Durable Node 22 verification artifacts are under /workspace/readiness-artifacts/2026-11-02/. Old /tmp logs were lost during restart and cannot establish final results.
- Final verification and generated-page review remain pending; no merge or deploy.
