# Election denominator/source review — 2026-11-01

Read-only. No product/repository source changes. Arithmetic independently recomputed in JavaScript.

## Supported conclusion

UPDATE: Direct shell download of government2018 yearbook SUCCEEDED (7,233,859 bytes approximately7MB). `pdftotext -layout` inspection confirms table5.3.1 directly: presidential emitted2,597,989; positive2,463,441; blank62,624; null71,924; ANR1,206,067 /48.96; GANAR1,110,464 /45.08. These are now directly inspected official-publication values, not only search snippets. Local artifacts: `/tmp/paraguay2018-annual.pdf` and `/tmp/paraguay2018-annual.txt` lines9845–9861. Primary precinct CSV still unavailable; no per-table aggregation claimed.

The final raw candidate totals are 1,206,067 (Abdo/ANR) and 1,110,464 (Alegre/GANAR), a difference of 95,603 votes. The cited La Nación 23 May 2018 article explicitly reports these as FINAL totals and prints 46.42% and 42.74%, not the portfolio's 46.43% and 42.73%. Its next paragraph separately identifies TREP totals: 1,205,310 and 1,109,309, printed 46.44% and 42.74%.

The fuller La Nación 21 May 2018 report, sourced to TSJE, explicitly supplies the two denominators: TREP 2,595,324 votes; definitive count 2,597,989 votes. Therefore the difference between final 46.42/42.74 and final valid-vote 48.96/45.08 is primarily denominator choice, NOT simply preliminary versus final count.

| Basis | Abdo numerator | Alegre numerator | Denominator | Recomputed Abdo share | Recomputed Alegre share | Recomputed margin |
|---|---:|---:|---:|---:|---:|---:|
| Definitive, all presidential ballots cast | 1,206,067 | 1,110,464 | 2,597,989 | 46.4230988% | 42.7432141% | 3.6798847 pp |
| Definitive, positive/valid candidate votes | 1,206,067 | 1,110,464 | 2,463,441 | 48.9586314% | 45.0777591% | 3.8808723 pp |
| TREP, all ballots in reported count | 1,205,310 | 1,109,309 | 2,595,324 | round 46.44% | round 42.74% | 96,001 / 2,595,324 ×100 pp |

Valid/positive denominator equals 2,597,989 minus 71,924 null minus 62,624 blank = 2,463,441. Official governmental statistical-yearbook indexed table5.3.1 labels these 'Votos emitidos' and 'Votos positivos'; IFES indexed result explicitly labels 2,463,441 'Valid Votes'. La Nación May21 provides the total-cast denominator; academic and press sources corroborate the blank/null totals.

Round consistently from unrounded numbers: final all-cast margin 3.68 pp; final valid-candidate-vote margin 3.88 pp. 'About 3.7 percentage points of all ballots cast' is defensible to ONE decimal. '+3.70 pp' is not the two-decimal computed margin from these final totals. Old audit claim that the 3.7-point margin stands either way is mathematically wrong: changing the denominator changes the margin. No sourced denominator/count pair was found that generates BOTH46.43 and42.73 as the final shares.

## Exact sources inspected and access limits

- Cited [La Nación May23](https://www.lanacion.com.py/politica_edicion_impresa/2018/05/23/resultados-oficiales-del-tsje-revalidan-que-no-hubo-diferencias-con-el-trep/): full article readable through connected web tool, lines97–100 show definitive versus TREP numerators and shares.
- [La Nación May21](https://www.lanacion.com.py/politica/2018/05/21/tsje-divulga-computo-definitivo-de-eleccion-presidencial-y-ratifica-fiabilidad-del-trep/): full indexed article supplies numerator and denominator distinction, explicitly sourced to TSJE.
- [Official statistical yearbook2018, table5.3.1](https://informacionpublica.paraguay.gov.py/public/7234448-AnuarioEstadistico2018pdf-AnuarioEstadistico2018.pdf): indexed government PDF table exposes 2,597,989 Votos emitidos and2,463,441 Votos positivos. Direct web fetch timed out, but shell download and local PDF text extraction subsequently succeeded; no precinct CSV aggregation performed. [2019 government yearbook table5.3.1](https://informacionpublica.paraguay.gov.py/public/1105024-AnuarioEstadsticoDelParaguay2019CaptuloVyXIIpdf-AnuarioEstadsticoDelParaguay2019CaptuloVyXII.pdf) indexed table corroborates both presidential totals.
- [IFES2018 presidency](https://www.electionguide.org/elections/id/2675/): indexed snippet says Valid Votes2,463,441 and Abdo1,206,067=48.96%; direct page redirects to botblocker. Do not call this full-page verification.
- [TSJE article8533](https://tsje.gov.py/noticias/leer/8533-memoria-y-estadistica-electoral-de-las-elecciones-generales-2018--disponible-en-formato-digital.html): direct open has no readable lines/current election shell. Indexed snippet distinguishes Abdo46.44 TREP versus46.42 official. Did not inspect its historical embedded report.
- [Official datos.gov.py resource](https://www.datos.gov.py/dataset/resultados-de-las-elecciones-municipales-y-generales-de-2003-2006-2008-2010-2013-2015-2018-6): resource page readable, links20.69MB Resultados-por-mesa-2018.csv datedApr5 2022. Web CSV fetch timed out; direct curl of linked URL returned404. No precinct-level independent aggregation.
- [Academic article in Revista de Ciencia Política](https://scielo.conicyt.cl/article_plus.php?lng=e&pid=S0718-090X2019000200313&tlng=es): indexed table explicitly labels inclusion of blank/null, prints final totals and46.42/42.74; matches arithmetic. [Panama electoral tribunal news service](https://sineisen.tribunal-electoral.gob.pa/portal/article?articleId=35250) republishes Última Hora report with all-vote label and blank/null totals.

## Reconstruction repository is evidence of current convention, not external proof

Pinned commit6a5d2cef1216f43572d073e8abfab57329daff85, [NUMERIC_SSOT](https://github.com/RafaelBraga-Kribitz/decision-analytics-reconstruction/blob/6a5d2cef1216f43572d073e8abfab57329daff85/reports/NUMERIC_SSOT.md) lists SeriesA+3.70 (46.43/42.73) and SeriesB+3.88 (48.96/45.08), but gives neither denominator nor final/preliminary label. Therefore it does not resolve the dispute; it documents the ambiguity. [Source register](https://github.com/RafaelBraga-Kribitz/decision-analytics-reconstruction/blob/6a5d2cef1216f43572d073e8abfab57329daff85/reports/epistemic_boundaries.md#data-source-register) calls TSJE per-table results verified, says origin URL/access date still to be supplied and raw file not committed, while department sums reconcile to1,206,067/1,110,464. Internal reconciliation does not validate SeriesA percentages.

## Safe editorial choices for parent

Most direct consistent historical wording: 'Mario Abdo Benítez won with1,206,067 votes against Efraín Alegre’s1,110,464, a lead of95,603 votes.' This avoids denominator ambiguity and is supported by cited final-result reporting. If a percentage is needed, choose either '48.96% versus45.08% of valid candidate votes, a3.88-point lead' or '46.42% versus42.74% of all ballots cast, a3.68-point lead'; explicitly state denominator. Chart can use raw vote counts or clearly labelled valid-vote shares. Do not mix final raw totals with46.43/42.73. Keep simulation retrodiction anchor+3.70 distinct as 'repository SeriesA modelling anchor' until upstream provenance/model decision is reconciled; changing public historical wording must not silently imply the model was refit.

Applicable places extend beyond original three: AboutEN/DE footnotes, projectEN/DE question/metric/summary/decision, English essay introduction/results/poll-reference chart, current audit/manual-actions/checklist and editorial review. Historic audit records should be corrected via dated evidence addendum, not erased. Owner role/contribution facts are unrelated and unchanged.
