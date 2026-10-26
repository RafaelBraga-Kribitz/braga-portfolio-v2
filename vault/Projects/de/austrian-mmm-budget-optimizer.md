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
  - { value: "91 %", label: Kurvenabdeckung }
  - { value: "26 von 28", label: Parameter wiederhergestellt }
  - { value: "+45 %", label: "Überzurechnung durch die Plattform, Paid Search", accent: true }
repository: https://github.com/RafaelBraga-Kribitz/austrian-mmm-budget-optimizer
translationStatus: draft
publish: true
---

# MMM und Budget­optimierung für Österreich

> [!summary] Zusammenfassung
> Das Modell wird an einer bekannten Wahrheit validiert, bevor es etwas entscheidet, und auf Metas öffentlichem Robyn-Demodatensatz bringt dasselbe Wochenbudget, nach einer Breakeven-Regel umverteilt, im Median 15,1 % des derzeitigen Deckungsbeitrags der Medien; keine der 500 verwendeten Ziehungen aus der A-posteriori-Verteilung zeigt einen Verlust. Die Regel verschiebt Budget zu TV und Facebook, zieht es von der Außenwerbung (Out-of-Home) ab und lässt Print und Search (Suchmaschinenwerbung), deren Intervall-Untergrenzen unter dem Breakeven liegen, unverändert.

## Fragestellung

Die Frage ist jene, die jedes werbetreibende Unternehmen an seinen Mediaplan stellt: Welche Kanäle haben inkrementell beigetragen, wie weit lagen die von den Plattformen ausgewiesenen Zahlen daneben, und was bringt es tatsächlich, dasselbe Budget umzuschichten? Die Vergleichseinheit ist der Deckungsbeitrag, nicht der Umsatz. Ein Kanal, dessen Return on Ad Spend (ROAS, Umsatz je eingesetztem Werbe-Euro) unter dem Breakeven-ROAS (der Gewinnschwelle) liegt, vernichtet Marge, wie hoch sein ausgewiesener Umsatz auch erscheint.

## Daten

„Für Österreich“ im Titel bezeichnet das Umfeld, für das das Modell gebaut ist, nicht die Daten dahinter: Wochenraster, der österreichische Feiertagskalender als Kontrollvariable, Euro und eine Logik auf Basis des Deckungsbeitrags. Es wurden keine Daten österreichischer Kunden verwendet. Das Modell läuft in drei Layern (Ebenen), und der erste muss bestehen, bevor der zweite zählt:

- **Layer P**, ein generiertes werbetreibendes Unternehmen mit offengelegten wahren Parametern: 156 Wochen, fünf Kanäle (TV, Radio, Print, Paid Search und Paid Social, also bezahlte Such- und Social-Media-Werbung).
- **Layer R**, Metas öffentliche Robyn-Demodatei (MIT-Lizenz): simulierte Wochendaten für fünf benannte Kanäle, Umsatz in den eigenen Geldeinheiten der Datei, Umsätze der Mitbewerber als Kontrollvariable.
- **Layer D**, die A-posteriori-Verteilung (Posterior) aus Layer R, übergeben an einen Budgetoptimierer unter einer schriftlich festgelegten Entscheidungsregel.

> [!spec] Modelleingaben
> - Raster — wöchentlich
> - Übertragung — geometrischer Adstock (Übertragungseffekt der Werbung) je Kanal, Abklingrate geschätzt
> - Sättigung — Hill-Kurve auf die Adstock-transformierten Ausgaben
> - Basislinie — linearer Trend · zwei jährliche Fourier-Paare · eine Kontrollvariable
> - Deckungs&shy;beitrags&shy;quote — 40 %, angenommen
> - Breakeven-ROAS — 2,50

Die Priors (A-priori-Verteilungen) sind schwach informativ und für alle Kanäle gleich, damit die Schätzungen aus den Daten kommen und nicht aus einer Annahme, die die Antwort schon kennt.

## Methode

Die Validierung kommt vor jeder Entscheidung; die Schritte laufen daher in dieser Reihenfolge:

1. Das Modell wird in PyMC angepasst und mit NUTS (No-U-Turn Sampler; nutpie) gesampelt: zwei Ketten mit je 1.000 Tuning-Schritten und 1.000 Ziehungen, Ziel-Akzeptanzrate 0,9, nach Divergenzen über eine protokollierte Stufenfolge angehoben (die berichteten Anpassungen liefen mit 0,95 und 2.000 Ziehungen je Kette).
2. Ein Fit zählt nur bei einem R-hat unter 1,01, einer effektiven Stichprobengröße über 400 und null Divergenzen. Jeder Fit legt diese Diagnosewerte neben sich ab.
3. Auf Layer P muss der Sampler die Wahrheit wiederherstellen, die ihm vorgegeben wurde, und die plattformartige Attribution wird an derselben Wahrheit gemessen.
4. Das Modell wird auf beiden Layern an einem Holdout (zurückgehaltener Testzeitraum) von 26 Wochen gegen zwei Vergleichsmodelle geprüft: eine Ridge-Regression und eine saisonal naive Prognose.
5. Die Posterior aus Layer R geht an den Optimierer, unter einer Entscheidungsregel, die vor seinem Lauf festgelegt wird; der Umverteilungsgewinn wird über 500 Posterior-Ziehungen gelesen.

> [!definition] Entscheidungsregel
> Budget wird nur so lange zu einem Kanal verschoben, wie die Untergrenze seines Intervalls zu 90 % für den marginalen ROAS über dem Breakeven bleibt, und nur, wenn das 10. Perzentil des Umverteilungsgewinns positiv ist. Die Regel wird festgelegt, bevor der Optimierer läuft.

## Ergebnis

> [!note] Erneut geprüft am 26. Okt. 2026
> Nach Code-Korrekturen am 30. Sep. 2026 wurden die Entscheidungsebene und die Validierung auf synthetischen Daten mit dem aktuellen Code neu gerechnet. Jede Zahl auf dieser Seite wurde reproduziert; das Build-Log des Repositorys dokumentiert die Prüfung.

### Validierung auf Layer P

Der Sampler muss die Wahrheit wiederherstellen, die ihm vorgegeben wurde. Die Kurvenabdeckung beträgt 91 % (die wahren Reaktionskurven innerhalb des Posterior-Bands, über den beobachteten Ausgabenbereich), und 26 von 28 wahren Parameterwerten liegen innerhalb ihrer Intervalle zu 90 %. Die Abweichungen folgen einem bekannten Zielkonflikt, nicht einem Fehler: Alle fünf Effektgrößen und alle fünf Halbsättigungspunkte haben Mediane über der Wahrheit, weil eine Kurve, die höher steigt, aber später sättigt, dieselben Wochen erklärt. Die Wiederherstellung wird daher an Kurven und Anteilen beurteilt, also an dem, was eine Budgetentscheidung verwendet.

An derselben Wahrheit gemessen, rechnet der plattformartige Bericht Paid Search 45 % zu viel zu (von der Plattform ausgewiesener gegenüber wahrem inkrementellem Umsatz) und den Offline-Kanälen gar nichts.

### Umverteilung auf Layer R

Auf dem öffentlichen Datensatz bringt dasselbe gesamte Wochenbudget, nach der Entscheidungsregel umverteilt, im Median ==15,1 %== des derzeitigen Deckungsbeitrags der Medien. Das 10. Perzentil liegt bei 8,8 %, und keine der 500 verwendeten Posterior-Ziehungen zeigt einen Verlust.

> [!bars] Abb. 01-03-1 · Empfohlene Änderung der Wochenausgaben
> Budget wandert von der Außenwerbung zu TV und Facebook.
> - TV — 50
> - Außenwerbung — −20
> - Print — 0
> - Facebook — 50
> - Search — 0
>
> scale: −50–50 · unit: % · centre: yes
> caption: Veränderung von den derzeitigen zu den empfohlenen Wochenausgaben bei gleichem Gesamtbudget; n = 5 Kanäle. Print und Search bleiben unverändert (0 %): Die Untergrenzen ihrer Intervalle liegen unter dem Breakeven. Mittellinie = null; Bereich −50 % bis +50 %.
> source: Layer R, Metas öffentliche Robyn-Demodatei, nach der Entscheidungsregel umverteilt. Veröffentlichte Zahlen, zuletzt validiert am 16. Sep. 2026.

Wochenausgaben je Kanal, derzeit und laut Empfehlung, in den Geldeinheiten des Datensatzes:

| Kanal | Derzeit | Empfohlen |
|:--|--:|--:|
| TV | 14.844 | 22.266 |
| Außenwerbung | 43.218 | 34.723 |
| Print | 3.729 | unverändert |
| Facebook | 2.146 | 3.218 |
| Search | 5.916 | unverändert |

Der marginale ROAS, den die Regel prüft, bei den derzeitigen Ausgaben: der Median und das Intervall zu 90 %, dessen Untergrenze das Breakeven-Kriterium liest.

| Kanal | Median | Intervall zu 90 % |
|:--|--:|--:|
| TV | 7,26 | 4,38–10,72 |
| Außenwerbung | 0,75 | 0,10–1,68 |
| Print | 7,81 | 1,22–16,01 |
| Facebook | 20,53 | 4,76–45,52 |
| Search | 7,68 | 0,89–25,55 |

Das Breakeven-Kriterium ist es, das Print und Search auf dem derzeitigen Niveau hält. Ihre Mediane sind hoch, aber die Untergrenzen ihrer Intervalle liegen unter 2,50, daher wird kein Budget zu ihnen verschoben. Bei der Außenwerbung liegt das gesamte Intervall unter 2,50. Die Beträge sind in den eigenen Geldeinheiten des Datensatzes angegeben, nicht in Euro; Anteile, ROAS-Verhältnisse und die Breakeven-Prüfung sind die Größen, die sich übertragen lassen.

### Holdout

Auf einem Holdout von 26 Wochen gegen zwei Vergleichsmodelle hatte das Modell auf Layer P den geringsten mittleren absoluten prozentualen Fehler (MAPE): 3,0 %, gegenüber 4,7 % für die Ridge-Regression und 9,6 % für eine saisonal naive Prognose. Auf Layer R unterlag es mit 7,9 % gegenüber 5,1 % für die Ridge-Regression. Das wird so berichtet, wie es ausgefallen ist. Das Argument für das MMM ist, dass es mit Intervallen angibt, welcher Kanal den Umsatz erwirtschaftet hat; das können die Vergleichsmodelle nicht. Auf Layer P lagen 85 % der Holdout-Wochen innerhalb seiner Intervalle zu 90 %: etwas zu eng, das Modell ist also etwas zu selbstsicher.

> [!quote] Ergebnis · Layer R, 500 Posterior-Ziehungen
> Nach der Breakeven-Regel umverteilt, bringt dasselbe Wochenbudget im Median 15,1 % des derzeitigen Deckungsbeitrags der Medien, und keine der 500 Ziehungen zeigt einen Verlust.

## Grenzen

Was diese Arbeit nicht belegt:

- **Echte Daten eines Werbetreibenden.** Layer R ist ein simulierter öffentlicher Datensatz in nicht benannten Geldeinheiten. Der Austausch gegen echte Daten eines werbetreibenden Unternehmens ist geplant, nicht erfolgt.
- **Die Modellform.** Eine einzige Modellform wird angenommen (geometrischer Adstock, Hill-Sättigung, additive Basislinie). Die Wiederherstellung auf Layer P zeigt, dass der Sampler diese Form wiederfindet, nicht, dass die Wirklichkeit sie hat.
- **Kanäle, die sich gemeinsam bewegen.** Wöchentliche nationale Daten können Kanäle, deren Ausgaben sich gemeinsam bewegen, nicht trennen; die Intervalle werden entsprechend breiter.
- **Verhalten bei neuen Ausgabenniveaus.** Der Optimierer nimmt an, dass die Reaktionskurven bei neuen Ausgabenniveaus gelten und dass Mitbewerber nicht reagieren.

## Entscheidung

Nach der schriftlich festgelegten Regel wird Budget zu TV und Facebook verschoben und von der Außenwerbung abgezogen; Print und Search bleiben unverändert, denn zu einem Kanal, dessen Intervall-Untergrenze unter dem Breakeven-ROAS von 2,50 liegt, wird kein Budget verschoben. Die Entscheidung beruht auf einem simulierten öffentlichen Datensatz in nicht benannten Geldeinheiten; der Austausch gegen echte Daten eines werbetreibenden Unternehmens ist geplant, nicht erfolgt.

> [!faq]- Was würde die Entscheidung umkehren?
> Die Regel nennt die Bedingungen selbst. Fällt bei einer Neuschätzung die Untergrenze des Intervalls zu 90 % für den marginalen ROAS von TV oder Facebook auf 2,50 oder darunter, endet die Verschiebung zu diesem Kanal; ist das 10. Perzentil des Umverteilungsgewinns nicht mehr positiv, endet die Umverteilung. Der Optimierer nimmt außerdem an, dass die Reaktionskurven bei den neuen Ausgabenniveaus gelten und dass Mitbewerber nicht reagieren; die Empfehlung beruht auf beiden Annahmen, und keine davon ist belegt.

Code, Berichte und das Entscheidungsmemo liegen im Repository. Die Zahlen in seiner README werden aus den Berichtsdateien erzeugt, und ein Test prüft, dass beide übereinstimmen.
