---
code: "01-03"
kind: case
date: "2026-08-04"
summary: "Das Projekt nutzt Bayes’sches Media-Mix-Modelling für eine Budgetentscheidung. Es prüft dabei das Abwärtsrisiko."
lead: "Das Projekt baut ein Bayes’sches Marketing-Mix-Modell. Das Modell schätzt, was jeder Kanal beiträgt, und prüft die von den Werbeplattformen ausgewiesene Attribution an einer bekannten Wahrheit. Das Projekt verschiebt Budget nur dort, wo die Evidenz eine Breakeven-Regel (Regel zur Gewinnschwelle) erfüllt."
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
> Das Projekt validiert das Modell an einer bekannten Wahrheit, bevor das Modell etwas entscheidet. Auf Metas öffentlichem Robyn-Demodatensatz verteilt eine Breakeven-Regel dasselbe Wochenbudget um. Bei den berichteten Priors bringt das im Median einen zusätzlichen Deckungsbeitrag. Er beträgt 15,1 % des Deckungsbeitrags, den die Medien derzeit erzielen. Keine der 500 verwendeten Ziehungen aus der A-posteriori-Verteilung zeigt einen Verlust. Bei vagen Priors sinkt der Median des Gewinns auf 8,7 %, und die Verschiebung zu Facebook entfällt.

## Hintergrund

Die Vergleichseinheit ist der Deckungsbeitrag, nicht der Umsatz. Ein Kanal vernichtet Marge, wenn sein Return on Ad Spend (ROAS, Umsatz je eingesetztem Werbe-Euro) unter dem Breakeven-ROAS (der Gewinnschwelle) liegt. Das gilt auch bei hohem ausgewiesenem Umsatz.

## Daten

„Für Österreich“ im Titel bezeichnet das Umfeld, nicht die Daten. Das Umfeld umfasst ein Wochenraster, den österreichischen Feiertagskalender als Kontrollvariable, Euro und eine Logik auf Basis des Deckungsbeitrags. Das Projekt hat keine Daten österreichischer Kunden verwendet. Der erste Layer (Ebene) muss bestehen, bevor der zweite zählt.

| Layer | Daten | Rolle |
|:--|:--|:--|
| P | Synthetische Daten eines Werbetreibenden mit offengelegten wahren Parametern: 156 Wochen, fünf Kanäle (TV, Radio, Print, Paid Search und Paid Social, also bezahlte Such- und Social-Media-Werbung) | Muss zuerst bestehen |
| R | Metas öffentliche Robyn-Demodatei (MIT-Lizenz): simulierte Wochendaten, fünf benannte Kanäle, Umsatz in den eigenen Geldeinheiten der Datei, Umsätze der Mitbewerber als Kontrollvariable | Zählt erst, wenn P besteht |
| D | A-posteriori-Verteilung (Posterior) aus Layer R, übergeben an den Budgetoptimierer | Schriftlich festgelegte Entscheidungsregel |

> [!spec] Modelleingaben
> - Raster — wöchentlich
> - Nachwirkung — geometrischer Adstock (Nachwirkung der Werbung) je Kanal, Abklingrate geschätzt
> - Sättigung — Hill-Kurve auf die Adstock-transformierten Ausgaben
> - Basislinie — linearer Trend · zwei jährliche Fourier-Paare · eine Kontrollvariable
> - Priors (A-priori-Verteilungen) — schwach informativ und für alle Kanäle gleich, ohne kanalspezifische Wunschantworten. Die [Prior-Sensitivitätsanalyse](https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer/blob/108e2df2ef85fc98d22c53046b95715cda84b151/reports/PRIOR_SENSITIVITY_PUBLISHED_FIT_2026-11-04.md) ist erledigt. Der Bericht im Repository enthält eine Neuanpassung von Layer R mit vagen Priors im gleichen Aufbau
> - Deckungs&shy;beitrags&shy;quote — 40 %, angenommen
> - Breakeven-ROAS — 2,50

## Methode

Die Validierung läuft vor jeder Entscheidung.

| Schritt | Aktion | Prüfung |
|:--|:--|:--|
| 1 | Anpassung in PyMC, Sampling mit NUTS (No-U-Turn Sampler, nutpie). Zwei Ketten mit je 1.000 Tuning-Schritten und 1.000 Ziehungen, Ziel-Akzeptanzrate 0,9. Eine protokollierte Stufenfolge hebt die Ziel-Akzeptanzrate nach Divergenzen an. Die berichteten Anpassungen sind mit 0,95 und 2.000 Ziehungen je Kette gelaufen. Eine Anpassung zählt nur, wenn sie besteht | R-hat unter 1,01, effektive Stichprobengröße über 400, null Divergenzen. Jede Anpassung speichert ihre Diagnosewerte daneben |
| 2 | Auf Layer P die offengelegte Wahrheit wiederherstellen und die plattformartige Attribution an derselben Wahrheit messen | Wiederherstellung gegenüber den offengelegten wahren Parametern |
| 3 | Das Modell auf beiden Layern an einem Holdout (zurückgehaltener Testzeitraum) von 26 Wochen prüfen | Ridge-Regression und saisonal naive Prognose |
| 4 | Die A-posteriori-Verteilung aus Layer R an den Optimierer übergeben, unter einer Entscheidungsregel, die das Projekt vor dem Lauf des Optimierers festlegt | Umverteilungsgewinn über 500 Posterior-Ziehungen |

> [!definition] Entscheidungsregel
> Verschieben Sie Budget nur so lange zu einem Kanal, wie die Untergrenze seines Intervalls zu 90 % für den marginalen ROAS über dem Breakeven bleibt. Verschieben Sie Budget außerdem nur, wenn das 10. Perzentil des Umverteilungsgewinns positiv ist. Das Projekt legt die Regel fest, bevor der Optimierer läuft.

Ein Skript erzeugt die Zahlen in der README des Repositorys aus den Berichtsdateien. Ein Test prüft, dass die README und die Berichtsdateien übereinstimmen.

## Ergebnis

> [!note] Geprüft am 26. Okt. 2026
> Nach Code-Korrekturen am 30. Sep. 2026 hat das Projekt die Entscheidungsebene und die Validierung auf synthetischen Daten neu berechnet. Das Build-Log des Repositorys dokumentiert das. Diese Prüfung vor der Weitergabe hat das Modell nicht neu gerechnet. Die Seite berichtet daher die Zahlen aus diesen Neuberechnungen. Die Prior-Sensitivitätsanalyse vom 4. Nov. 2026 steht unter Umverteilung.

### Validierung auf Layer P

| Messgröße | Wert | Lesart |
|:--|--:|:--|
| Kurvenabdeckung | 91 % | Wahre Reaktionskurven innerhalb des Posterior-Intervalls, über den beobachteten Ausgabenbereich |
| Kurvenabdeckung TV | 56 % | Schwächster Kanal. Die aggregierte Abdeckung verdeckt das ([Validierungsübersicht des Repositorys](https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer/blob/c63e16b7f0f0f5e6452216b600c4ed619a9bdf6b/README.md)) |
| Wahre Parameter innerhalb ihrer Intervalle zu 90 % | 26 von 28 | Der Text unten erklärt die Abweichungen |
| Wahrer Umsatzanteil von TV | Knapp außerhalb seines Intervalls | Derselbe schwächste Kanal |
| Überzurechnung durch die Plattform, Paid Search | +45 % | Von der Plattform ausgewiesener gegenüber wahrem inkrementellem Umsatz |
| Plattform-Zurechnung, Offline-Kanäle | Keine | Plattformartiger Bericht, an derselben Wahrheit gemessen |

Die Abweichungen folgen einem bekannten Zielkonflikt, nicht einem Fehler. Die Mediane aller fünf Effektgrößen und aller fünf Halbsättigungspunkte liegen über den wahren Werten. Höhere, später sättigende Kurven erklären dieselben Wochen. Das Projekt beurteilt die Wiederherstellung daher an Kurven und Anteilen, die eine Budgetentscheidung verwendet.

### Umverteilung auf Layer R

Die Entscheidungsregel verteilt dasselbe gesamte Wochenbudget um. Das bringt im Median einen zusätzlichen Deckungsbeitrag von ==15,1 %== des Deckungsbeitrags, den die Medien derzeit erzielen (10. Perzentil 8,8 %). Keine der 500 verwendeten Posterior-Ziehungen zeigt einen Verlust.

> [!bars] Abb. 01-03-1 · Empfohlene Änderung der Wochenausgaben
> Pro Woche wandern 8.495 aus der Außenwerbung ab. 7.422 gehen zu TV und rund 1.073 zu Facebook.
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
> caption: Medianer marginaler ROAS bei den derzeitigen Ausgaben, mit seinem Intervall zu 90 %. Die Skala ist logarithmisch und reicht von 0,05 bis 50. n = 500 Posterior-Ziehungen, 5 Kanäle. Durchgezogen: berichtete Priors, Werte rechts. Gestrichelt: vage Priors. Die Abbildung schneidet Intervalle unter 0,05 ab und markiert sie mit einem Winkel (Außenwerbung 0,00, Search 0,03). Die Daten sind simuliert. Der Breakeven von 2,50 beruht auf einer angenommenen Deckungsbeitragsquote von 40 %.
> source: Layer R, Metas öffentliche Robyn-Demodatei, simulierte Daten. Prior-Sensitivität: [Bericht des Repositorys](https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer/blob/108e2df2ef85fc98d22c53046b95715cda84b151/reports/PRIOR_SENSITIVITY_PUBLISHED_FIT_2026-11-04.md).

| Lauf | Gewinn, Median | 10. Perzentil | Verschiebung nach der Regel |
|:--|--:|--:|:--|
| Veröffentlichte Anpassung, berichtete Priors | 15,1 % | 8,8 % | Außenwerbung −20 %, TV und Facebook +50 %, Print und Search unverändert |
| Exakte Wiederholung, berichtete Priors | 14,7 % | 9,0 % | Gleiches Ergebnis |
| Neuanpassung, vage Priors | 8,7 % | 4,0 % | Außenwerbung −17 %, TV +50 %, Facebook, Print und Search unverändert |

Die exakte Wiederholung weicht von der veröffentlichten Anpassung ab. Die Ursache ist nicht isoliert. Der Bericht nennt Monte-Carlo-Schwankungen des Samplers von Lauf zu Lauf als wahrscheinliche Ursache. Die Untergrenze von Facebook bei den berichteten Priors liegt je nach Auswertung zwischen 3,06 und 4,76. In keinem Lauf zeigt eine der 500 Ziehungen einen Verlust.

Die Wochenbeträge darunter stehen in den eigenen Geldeinheiten des Datensatzes, nicht in Euro. Die Ergebnisse der Regel gelten für die berichteten Priors. Anteile, ROAS-Verhältnisse und die Breakeven-Prüfung lassen sich übertragen.

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

Das MMM ist auf Layer R der Ridge-Regression unterlegen. Diese Seite berichtet das Ergebnis so, wie es ausgefallen ist. Das Argument für das MMM: Es gibt mit Intervallen an, welcher Kanal den Umsatz erwirtschaftet hat. Das können die Vergleichsmodelle nicht. Auf Layer P waren die Intervalle des MMM etwas zu eng. Das MMM ist also etwas zu selbstsicher.

## Grenzen

- **Echte Daten eines Werbetreibenden.** Layer R ist ein simulierter öffentlicher Datensatz in nicht benannten Geldeinheiten. Das Projekt plant, Layer R gegen echte Daten eines werbetreibenden Unternehmens auszutauschen. Es hat das noch nicht getan.
- **Die Modellform.** Das Modell nimmt eine einzige Form an (geometrischer Adstock, Hill-Sättigung, additive Basislinie). Die Wiederherstellung auf Layer P zeigt, dass der Sampler diese Form findet. Sie zeigt nicht, dass die Wirklichkeit diese Form hat.
- **Kanäle, die sich gemeinsam bewegen.** Wöchentliche nationale Daten können Kanäle mit gemeinsam laufenden Ausgaben nicht trennen, daher werden die Intervalle breiter.
- **Verhalten bei neuen Ausgabenniveaus.** Der Optimierer nimmt an, dass die Reaktionskurven bei neuen Ausgabenniveaus gelten. Er nimmt auch an, dass Mitbewerber nicht reagieren.

## Entscheidung

Wenn die schriftlich festgelegte Regel und die berichteten Priors gelten, verschieben Sie Budget zu TV und Facebook. Ziehen Sie Budget von der Außenwerbung ab. Halten Sie Print und Search unverändert. Die Verschiebung zu Facebook übersteht vage Priors nicht. Die Regel hält Facebook dann unverändert, und der Median des Gewinns sinkt auf 8,7 %. Die Entscheidung beruht außerdem auf einem simulierten öffentlichen Datensatz. Siehe Grenzen.

> [!faq]- Was würde die Entscheidung umkehren?
> Bei einer Neuschätzung kann das Intervall zu 90 % für den marginalen ROAS von TV oder Facebook eine Untergrenze von 2,50 oder darunter haben. Tritt das ein, endet die Verschiebung zu diesem Kanal. Die Neuanpassung mit vagen Priors zeigt das schon. Sie ergibt für Facebook eine Untergrenze von 0,11. Die Regel hält Facebook daher unverändert. Ist das 10. Perzentil des Umverteilungsgewinns nicht mehr positiv, endet die Umverteilung. Die Empfehlung beruht außerdem auf den Annahmen unter „Verhalten bei neuen Ausgabenniveaus“, die keine Prüfung belegt.

## Entstehung

```buildlog
```
