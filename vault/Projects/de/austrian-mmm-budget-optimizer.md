---
code: "01-03"
kind: case
date: "2026-08-04"
summary: "Bayes’sches Media-Mix-Modelling. Eine Budgetentscheidung mit Prüfung des Abwärtsrisikos."
lead: "Ein Bayes’sches Marketing-Mix-Modell, das schätzt, was jeder Kanal beiträgt, die von Werbeplattformen ausgewiesene Attribution an einer bekannten Wahrheit prüft und Budget nur dort verschiebt, wo die Evidenz eine Breakeven-Regel (Regel zur Gewinnschwelle) erfüllt."
domain: Marketing
tags: [ status/complete, marketing, media-mix-modelling, budgetoptimierung ]
lang: de
slug: austrian-mmm-budget-optimizer
metrics:
  - { value: "15,1 %", label: "Medianer Zugewinn bei gleichem Budget, simulierte Daten", accent: true }
  - { value: "91 %", label: "Kurvenabdeckung, generierte Daten" }
  - { value: "+45 %", label: "Überzurechnung durch die Plattform, Paid Search" }
stack: [ "Python", "Power BI", "DAX", "PyMC", "Bayesian", "Jupyter", "CI/CD" ]
repository: https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer
translationStatus: approved
publish: true
---

# MMM und Budget­optimierung für Österreich

## Frage: Welche Kanäle sollten bei gleichem Mediabudget mehr Geld bekommen und welche weniger?

> [!summary] Zusammenfassung
> Das Modell wird an einer bekannten Wahrheit validiert, bevor es etwas entscheidet. Auf Metas öffentlichem Robyn-Demodatensatz wird dasselbe Wochenbudget nach einer Breakeven-Regel umverteilt. Bei den berichteten Priors bringt das im Median einen zusätzlichen Deckungsbeitrag von 15,1 % des derzeitigen Deckungsbeitrags der Medien. Keine der 500 verwendeten Ziehungen aus der A-posteriori-Verteilung zeigt einen Verlust. Bei vagen Priors sinkt der Median des Gewinns auf 8,7 %, und die Verschiebung zu Facebook entfällt.

## Hintergrund

Die Vergleichseinheit ist der Deckungsbeitrag, nicht der Umsatz. Ein Kanal vernichtet Marge, wenn sein Return on Ad Spend (ROAS, Umsatz je eingesetztem Werbe-Euro) unter dem Breakeven-ROAS (der Gewinnschwelle) liegt. Das gilt, wie hoch sein ausgewiesener Umsatz auch erscheint.

## Daten

„Für Österreich“ im Titel bezeichnet das Umfeld, nicht die Daten: Wochenraster, der österreichische Feiertagskalender als Kontrollvariable, Euro und eine Logik auf Basis des Deckungsbeitrags. Es wurden keine Daten österreichischer Kunden verwendet. Der erste Layer (Ebene) muss bestehen, bevor der zweite zählt.

| Layer | Daten | Rolle |
|:--|:--|:--|
| P | Generiertes werbetreibendes Unternehmen mit offengelegten wahren Parametern: 156 Wochen, fünf Kanäle (TV, Radio, Print, Paid Search und Paid Social, also bezahlte Such- und Social-Media-Werbung) | Muss zuerst bestehen |
| R | Metas öffentliche Robyn-Demodatei (MIT-Lizenz): simulierte Wochendaten, fünf benannte Kanäle, Umsatz in den eigenen Geldeinheiten der Datei, Umsätze der Mitbewerber als Kontrollvariable | Zählt erst, wenn P besteht |
| D | A-posteriori-Verteilung (Posterior) aus Layer R, übergeben an den Budgetoptimierer | Schriftlich festgelegte Entscheidungsregel |

> [!spec] Modelleingaben
> - Raster — wöchentlich
> - Übertragung — geometrischer Adstock (Übertragungseffekt der Werbung) je Kanal, Abklingrate geschätzt
> - Sättigung — Hill-Kurve auf die Adstock-transformierten Ausgaben
> - Basislinie — linearer Trend · zwei jährliche Fourier-Paare · eine Kontrollvariable
> - Priors (A-priori-Verteilungen) — schwach informativ und für alle Kanäle gleich, ohne kanalspezifische Wunschantworten. Die [Prior-Sensitivitätsprüfung](https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer/blob/108e2df2ef85fc98d22c53046b95715cda84b151/reports/PRIOR_SENSITIVITY_PUBLISHED_FIT_2026-11-04.md) ist erledigt: Sie passt Layer R mit vagen Priors im gleichen Aufbau neu an
> - Deckungs&shy;beitrags&shy;quote — 40 %, angenommen
> - Breakeven-ROAS — 2,50

## Methode

Die Validierung läuft vor jeder Entscheidung.

| Schritt | Aktion | Prüfung |
|:--|:--|:--|
| 1 | Anpassung in PyMC, Sampling mit NUTS (No-U-Turn Sampler, nutpie): zwei Ketten, je 1.000 Tuning-Schritte und 1.000 Ziehungen, Ziel-Akzeptanzrate 0,9, nach Divergenzen über eine protokollierte Stufenfolge angehoben. Die berichteten Anpassungen liefen mit 0,95 und 2.000 Ziehungen je Kette. Ein Fit zählt nur, wenn er besteht | R-hat unter 1,01, effektive Stichprobengröße über 400, null Divergenzen. Jeder Fit legt diese Diagnosewerte neben sich ab |
| 2 | Auf Layer P wiederherstellen, was dem Sampler vorgegeben wurde, und die plattformartige Attribution an derselben Wahrheit messen | Wiederherstellung gegenüber den offengelegten wahren Parametern |
| 3 | Das Modell auf beiden Layern an einem Holdout (zurückgehaltener Testzeitraum) von 26 Wochen prüfen | Ridge-Regression und saisonal naive Prognose |
| 4 | Die A-posteriori-Verteilung aus Layer R an den Optimierer übergeben, unter einer Entscheidungsregel, die vor seinem Lauf festgelegt wird | Umverteilungsgewinn über 500 Posterior-Ziehungen |

> [!definition] Entscheidungsregel
> Budget wird nur so lange zu einem Kanal verschoben, wie die Untergrenze seines Intervalls zu 90 % für den marginalen ROAS über dem Breakeven bleibt. Budget wird außerdem nur verschoben, wenn das 10. Perzentil des Umverteilungsgewinns positiv ist. Die Regel wird festgelegt, bevor der Optimierer läuft.

Die Zahlen in der README des Repositorys werden aus den Berichtsdateien erzeugt, und ein Test prüft, dass beide übereinstimmen.

## Ergebnis

> [!note] Geprüft am 26. Okt. 2026
> Das Build-Log des Repositorys dokumentiert Neuberechnungen der Entscheidungsebene und der Validierung auf synthetischen Daten nach Code-Korrekturen am 30. Sep. 2026. Diese Prüfung vor der Weitergabe hat das Modell nicht neu gerechnet, die Zahlen stammen daher aus dieser Arbeit. Die Prior-Sensitivitätsprüfung vom 4. Nov. 2026 steht unter Umverteilung.

### Validierung auf Layer P

| Messgröße | Wert | Lesart |
|:--|--:|:--|
| Kurvenabdeckung | 91 % | Wahre Reaktionskurven innerhalb des Posterior-Bands, über den beobachteten Ausgabenbereich |
| Kurvenabdeckung TV | 56 % | Schwächster Kanal. Die aggregierte Abdeckung verdeckt das ([Validierungsübersicht des Repositorys](https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer/blob/c63e16b7f0f0f5e6452216b600c4ed619a9bdf6b/README.md)) |
| Wahre Parameter innerhalb ihrer Intervalle zu 90 % | 26 von 28 | Die Abweichungen werden unten erklärt |
| Wahrer Umsatzanteil von TV | Knapp außerhalb seines Intervalls | Derselbe schwächste Kanal |
| Überzurechnung durch die Plattform, Paid Search | +45 % | Von der Plattform ausgewiesener gegenüber wahrem inkrementellem Umsatz |
| Plattform-Zurechnung, Offline-Kanäle | Keine | Plattformartiger Bericht, an derselben Wahrheit gemessen |

Die Abweichungen folgen einem bekannten Zielkonflikt, nicht einem Fehler. Alle fünf Effektgrößen und alle fünf Halbsättigungspunkte haben Mediane über der Wahrheit, weil eine Kurve, die höher steigt, aber später sättigt, dieselben Wochen erklärt. Die Wiederherstellung wird daher an Kurven und Anteilen beurteilt, die eine Budgetentscheidung verwendet.

### Umverteilung auf Layer R

Dasselbe gesamte Wochenbudget, nach der Entscheidungsregel umverteilt, bringt im Median einen zusätzlichen Deckungsbeitrag in Höhe von ==15,1 %== des derzeitigen Deckungsbeitrags der Medien (10. Perzentil 8,8 %), und keine der 500 verwendeten Posterior-Ziehungen zeigt einen Verlust.

> [!bars] Abb. 01-03-1 · Empfohlene Änderung der Wochenausgaben
> Pro Woche wandern 8.495 aus der Außenwerbung ab: 7.422 zu TV und rund 1.073 zu Facebook.
> - TV — 7422
> - Facebook — 1072
> - Print — 0
> - Search — 0
> - Außenwerbung — −8495
>
> scale: −9000–9000 · centre: yes
> caption: Änderung der Wochenausgaben in den Geldeinheiten des Datensatzes: empfohlen minus derzeit laut Tabelle darunter, gerundet. n = 5 Kanäle. TV und Facebook enden an der Extrapolationsgrenze von +50 % (`bound_share`: Jeder Kanal verschiebt höchstens 50 % seiner derzeitigen Ausgaben), nicht an der Breakeven-Regel. Die Außenwerbung hält weiterhin 49,7 % des Budgets.
> source: Layer R, Metas öffentliche Robyn-Demodatei, nach der Entscheidungsregel umverteilt. Veröffentlichte Zahlen, zuletzt validiert am 16. Sep. 2026.

> [!figure] Abb. 01-03-2 · Marginaler ROAS gegenüber Breakeven
> TV liegt bei beiden Prior-Sätzen über der Linie von 2,50. Facebook liegt nur bei den berichteten Priors darüber. Print und Search kreuzen die Linie, und die Außenwerbung bleibt darunter.
> ![[01-03-roas-interval.de.svg]]
>
> caption: Medianer marginaler ROAS bei den derzeitigen Ausgaben, mit seinem Intervall zu 90 %, auf logarithmischer Skala von 0,05 bis 50. n = 500 Posterior-Ziehungen, 5 Kanäle. Durchgezogen: berichtete Priors, Werte rechts. Gestrichelt: vage Priors. Intervalle unter 0,05 sind abgeschnitten und mit einem Winkel markiert (Außenwerbung 0,00, Search 0,03). Die Daten sind simuliert, und der Breakeven von 2,50 nimmt eine Deckungsbeitragsquote von 40 % an.
> source: Layer R, Metas öffentliche Robyn-Demodatei; simulierte Daten. Prior-Sensitivität: [Bericht des Repositorys](https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer/blob/108e2df2ef85fc98d22c53046b95715cda84b151/reports/PRIOR_SENSITIVITY_PUBLISHED_FIT_2026-11-04.md).

| Lauf | Gewinn, Median | 10. Perzentil | Verschiebung nach der Regel |
|:--|--:|--:|:--|
| Veröffentlichter Fit, berichtete Priors | 15,1 % | 8,8 % | Außenwerbung −20 %, TV und Facebook +50 %, Print und Search unverändert |
| Exakte Wiederholung, berichtete Priors | 14,7 % | 9,0 % | Gleiches Ergebnis |
| Neuanpassung, vage Priors | 8,7 % | 4,0 % | Außenwerbung −17 %, TV +50 %, Facebook, Print und Search unverändert |

Die exakte Wiederholung weicht vom veröffentlichten Fit ab, und die Ursache ist nicht isoliert. Der Bericht nennt Monte-Carlo-Schwankungen des Samplers von Lauf zu Lauf als wahrscheinliche Ursache. Die Untergrenze von Facebook bei den berichteten Priors wandert zwischen den Auswertungen von 3,06 bis 4,76. In keinem Lauf zeigt eine der 500 Ziehungen einen Verlust.

Die Wochenbeträge darunter stehen in den eigenen Geldeinheiten des Datensatzes, nicht in Euro, und die Ergebnisse der Regel gelten für die berichteten Priors. Anteile, ROAS-Verhältnisse und die Breakeven-Prüfung lassen sich übertragen.

| Kanal | Derzeit | Empfohlen | Ergebnis der Regel |
|:--|--:|--:|:--|
| TV | 14.844 | 22.266 | Mehr Budget |
| Facebook | 2.146 | 3.218 | Mehr Budget |
| Print | 3.729 | unverändert | Halten |
| Search | 5.916 | unverändert | Halten |
| Außenwerbung | 43.218 | 34.723 | Weniger Budget: ganzes Intervall unter 2,50 |

### Holdout

Der Holdout umfasst 26 Wochen. Die Zellen zeigen den mittleren absoluten prozentualen Fehler (MAPE), außer in der letzten Spalte.

| Layer | MMM | Ridge-Regression | Saisonal naiv | MMM, Abdeckung 90 % |
|:--|--:|--:|--:|--:|
| P | 3,0 % | 4,7 % | 9,6 % | 85 % |
| R | 7,9 % | 5,1 % | 22,3 % | 100 % |

Das MMM unterlag auf Layer R der Ridge-Regression, und das wird so berichtet, wie es ausgefallen ist. Das Argument für das MMM ist, dass es mit Intervallen angibt, welcher Kanal den Umsatz erwirtschaftet hat. Das können die Vergleichsmodelle nicht. Auf Layer P waren seine Intervalle etwas zu eng, das Modell ist also etwas zu selbstsicher.

## Grenzen

- **Echte Daten eines Werbetreibenden.** Layer R ist ein simulierter öffentlicher Datensatz in nicht benannten Geldeinheiten. Der Austausch gegen echte Daten eines werbetreibenden Unternehmens ist geplant, nicht erfolgt.
- **Die Modellform.** Eine einzige Form wird angenommen (geometrischer Adstock, Hill-Sättigung, additive Basislinie). Die Wiederherstellung auf Layer P zeigt, dass der Sampler diese Form findet, nicht, dass die Wirklichkeit sie hat.
- **Kanäle, die sich gemeinsam bewegen.** Wöchentliche nationale Daten können Kanäle mit gemeinsam laufenden Ausgaben nicht trennen, daher werden die Intervalle breiter.
- **Verhalten bei neuen Ausgabenniveaus.** Der Optimierer nimmt an, dass die Reaktionskurven bei neuen Ausgabenniveaus gelten und dass Mitbewerber nicht reagieren.

## Entscheidung

Die schriftlich festgelegte Regel verschiebt bei den berichteten Priors Budget zu TV und Facebook und zieht es von der Außenwerbung ab. Print und Search lässt sie unverändert. Die Verschiebung zu Facebook übersteht vage Priors nicht: Die Regel hält Facebook dann unverändert, und der Median des Gewinns sinkt auf 8,7 %. Die Entscheidung beruht außerdem auf einem simulierten öffentlichen Datensatz: siehe Grenzen.

> [!faq]- Was würde die Entscheidung umkehren?
> Die Untergrenze des Intervalls zu 90 % für den marginalen ROAS von TV oder Facebook kann bei einer Neuschätzung auf 2,50 oder darunter fallen. Tritt das ein, endet die Verschiebung zu diesem Kanal. Die Neuanpassung mit vagen Priors zeigt diesen Fall schon: Sie setzt die Untergrenze von Facebook auf 0,11, daher hält die Regel Facebook unverändert. Ist das 10. Perzentil des Umverteilungsgewinns nicht mehr positiv, endet die Umverteilung. Die Empfehlung beruht außerdem auf den Annahmen unter „Verhalten bei neuen Ausgabenniveaus“, die keine Prüfung belegt.

## Entstehung

```buildlog
```
