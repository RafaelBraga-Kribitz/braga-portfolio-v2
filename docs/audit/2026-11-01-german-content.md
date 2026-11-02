# German content adversarial proofreading — 1 November 2026

Scope: all 11 requested DE files against their current EN twins; language and translation parity, not independent model reproduction, CV verification or legal approval. Austrian German reviewed for grammar, cases, technical meaning, decimal/thousands formatting, percent/unit spacing, dates, and discretionary compound breaks. Existing branding, source figures, CV dates/roles, `translationStatus: draft` and DRAFT_LANGS retained. No builds run because root's final verification is in progress.

## Per-file verdicts

| DE file | Language verdict | Changes / remaining substantive conditions |
|---|---|---|
| Projects/de/austria-data-job-market-intelligence.md | Ready | No change needed. Dated 720-posting snapshot, 699 current-repository note, 83/95 precision, 24% duplication and counts align with EN. Preserves one-day stock versus yearly-flow distinction, incomplete coverage, unmeasured recall and noncausal limits. |
| Projects/de/austrian-mmm-budget-optimizer.md | Ready after corrections | Material ambiguity corrected in summary, result and quote: 15.1% is an **additional contribution gain**, not the entire contribution. Replaced incorrect 'Die Posterior' with 'Die A-posteriori-Verteilung'; replaced literal 'Untergrenze ... liest' with normal German; protected 56% spacing. EN's weak TV channel (56%), synthetic/demo-data qualification, prior-sensitivity caveat and non-independent-rerun note preserved. No new model validation claimed. |
| Projects/de/decision-analytics-reconstruction.md | Ready after corrections | Explicit 'Prozentpunkte' for both all-cast margin and model anchor; protected percent spacing. Verified parity of official 95,603 lead (1,206,067 minus 1,110,464), 3.88 pp / 2,463,441 valid candidate votes, 3.68 pp / 2,597,989 all ballots and distinct repository +3.70 anchor (46.43% / 42.73%). No refit implied. Retrodiction, 3/6 held-out coverage, solver/proxy-only 54.77% gain and hand-set/unverified inputs all remain explicit. |
| Projects/de/energy-procurement-risk-analyzer.md | Ready | No change. Clear 24 July foundation snapshot plus 1 November repository-status qualification, constructed 50 GWh load, no adopted numerical strategy result. Austrian 'Jänner' retained. Current model results are outside this snapshot and unverified by this review. |
| Projects/de/warehouse-humanoid-tco.md | Ready | No change. All seven scenario cost/capex/order numbers, 99.8%, 120 orders/hour, 8%, 10,000 draws, household proxy, KV availability, site-validation requirement and non-independent reproduction caveat match EN. |
| Essays/de/ai-prospecting-vendor-3x-lift.md | Ready after corrections | Technical Precision gloss changed from Genauigkeit to Präzision; grammatical false-positive wording repaired. Restored full reference/DOI section present in EN but missing in DE. Study title retained in original. Twenty-year buying-history assertion matches EN; owner/CV substantiation remains factual work, not something this language pass invents or certifies. |
| Pages/de/about.md | Ready | No language edit required. Existing BioSynCare role/date row and campaign participation retained without expansion. Election footnote matches official corrected counts. Further CV content/verification remains a separate owner task. |
| Pages/de/system.md | Ready after correction | Compound subject agreement repaired: 'Jedes Projekt und jeder Essay folgen'. German decimals/formula, typographic examples, chart key syntax, soft breaks, German headings/links match intended specimen. The page is a pattern demonstration; its deployment/FAQ wording is illustrative and not an updated warehouse recommendation. |
| Legal/de/accessibility.md | Linguistically ready; legal/operational verification separate | Capitalization of full sentence after colon and protected 2 px unit spacing corrected. Existing scope claim about BaFG, universal keyboard claims and planned NVDA pass require legal/operational checks; this review does not certify them. |
| Legal/de/impressum.md | Linguistically ready; provisional | No edit. §25 MedienG / §5 ECG text, owner place/address detail, editorial scope and third-party liability wording retained. Existing WKO/disclosure review warning retained. Adequacy of address/disclosures/liability text is not approved by proofreading. |
| Legal/de/privacy.md | Linguistically ready; provisional | Added actual easyname alias/forwarding and Gmail delivery/processing per DEPLOY.md and owner confirmation. Existing retention/legal-basis text not independently verified. Host/DPA/third-country-transfer decision, DPF check and exact account/provider contractual facts remain unresolved; draft note retained. No account type, contracting Google entity or new retention period invented. |

## Exact new DE Contact text for EN parity

Bei einer E-Mail werden die übermittelten Daten zur Beantwortung verarbeitet (Art. 6 Abs. 1 lit. b und f DSGVO) und danach gelöscht, sofern keine gesetzliche Aufbewahrungspflicht besteht.

Die E-Mail-Adresse wird über easyname als Alias bzw. Weiterleitung betrieben; eingehende Nachrichten werden an das Gmail-Postfach des Verantwortlichen weitergeleitet. Dabei verarbeiten easyname und Google (Gmail) die Nachricht und die für Zustellung und Speicherung erforderlichen Daten.

## Verification

Read all scoped German texts and English twins; checked final edit diff. `git diff --check` passes. No translation approval, draft-language visibility or rendering behavior changed. No frontend build or model rerun claimed. Existing email-hiding HTML behavior was not touched.
