---
code: "01-04"
kind: case
date: "2026-10-28"
summary: "€ 27,04 Mio. Was die falsche Stromstrategie eine konstruierte 50-GWh-Last in den Jahren 2021–2025 kostete."
lead: "Voller Spotbezug, Indexvertrag, Festpreis oder Teilabsicherung: vier Wege, Strom für einen steirischen Produktionsbetrieb einzukaufen. Über 2021–2025 war der fixe Jahrespreis insgesamt am günstigsten; die Risikokennzahlen für die nächsten zwölf Monate liegen vor."
domain: Energie
tags: [ status/functional, energiebeschaffung, risikoanalyse, data-warehouse ]
lang: de
slug: energy-procurement-risk-analyzer
metrics:
  - { value: "€ 27,04 Mio.", label: "Kosten der falschen Strategie, 2021–2025", accent: true }
  - { value: "€ 30,17 Mio.", label: "Niedrigste Fünfjahreskosten: fixer Jahrespreis" }
  - { value: "€ 6,44 Mio.", label: "Niedrigstes P95, nächste 12 Monate: Hybrid 70 % fix" }
repository: https://github.com/RafaelBraga-Kribitz/energy-procurement-risk-analyzer
translationStatus: draft
publish: true
---

# Risikoanalyse für die Energie­beschaffung

> [!summary] Zusammenfassung
> Der Strombezug mit der falschen Strategie kostete den konstruierten Verbraucher mit 50 GWh über 2021–2025 insgesamt € 27,04 Mio. Der fixe Jahrespreis war mit € 30,17 Mio. insgesamt die günstigste Strategie. Für die nächsten zwölf Monate hat er die niedrigsten erwarteten Kosten, € 4,77 Mio., und der Hybrid mit 70 % fix das niedrigste P95, € 6,44 Mio. Die Last ist konstruiert und der ÖSPI steht stellvertretend für Vertragspreise; es sind also Ergebnisse unter genannten Annahmen, kein Lieferantenangebot.

## Fragestellung

Nach der europäischen Energiekrise 2021–2023 wurde die Strombeschaffung für die österreichische Industrie zu einem Risiko auf Vorstandsebene. Was kostete es einen steirischen Produktionsbetrieb mit einem Jahresverbrauch von 50 GWh, Strom in den Jahren 2021–2025 auf die falsche Weise einzukaufen, und wie hoch ist das Kostenrisiko auf P95-Niveau (95. Perzentil) für die nächsten zwölf Monate unter jeder Beschaffungsstrategie? Das Projekt vergleicht vier Strategien am österreichischen Day-Ahead-Markt (Großhandelsmarkt für Lieferungen am Folgetag), nämlich vollständigen Spotbezug, einen Indexvertrag, einen fixen Jahrespreis und eine Teilabsicherung, für eine einzige konstruierte Industrielast von 50 GWh. Die Vergleichseinheit sind die Energiepreiskosten dieser Last in Euro je Strategie: realisiert zu den Preisen von 2021–2025 sowie als P95 und CVaR95 der nächsten zwölf Monate auf Basis neu gezogener Preise.

## Daten

Die Marktdaten sind real; kein Marktpreis ist synthetisch. Day-Ahead-Preise für Österreich und Deutschland–Luxemburg sowie Last und Erzeugung in Österreich stammen von der ENTSO-E-Transparenzplattform, der monatliche Preisindex ÖSPI von der Österreichischen Energieagentur (von Hand übertragen, doppelt erfasst), die Tagesmitteltemperatur für Graz von GeoSphere Austria; ein Kalender enthält die österreichischen und steirischen Feiertage. Das Zeitfenster reicht von Jänner 2019 bis September 2026.

Zwei Eingaben sind Annahmen und als solche gekennzeichnet. Das Lastprofil des Verbrauchers ist konstruiert, nicht gemessen, und der ÖSPI steht stellvertretend für Vertrags- und Terminpreise. Netzentgelte, Steuern und Abgaben liegen außerhalb des Umfangs; die Analyse isoliert damit den Hebel Energiepreis.

Jede Zahl unten trägt ein Etikett. VERIFIED ist aus realen Daten ohne Modellierung berechnet. CALIBRATED beruht auf dokumentierten Annahmen, die an reale Daten angelehnt sind; das gilt für alle Strategiekosten hier. SIMULATED stammt aus einem Zufallsverfahren mit festem Startwert (Seed).

> [!spec] Eingaben
> - Day-Ahead-Preise — Österreich und Deutschland–Luxemburg · ENTSO-E-Transparenzplattform
> - Last und Erzeugung — Österreich · ENTSO-E-Transparenzplattform
> - Preisindex — ÖSPI, monatlich · Österreichische Energieagentur · von Hand übertragen, doppelt erfasst
> - Temperatur — Tagesmittel, Graz · GeoSphere Austria
> - Kalender — österreichische und steirische Feiertage
> - Zeitfenster — Jänner 2019 bis September 2026
> - Lastprofil — konstruiert, 50 GWh pro Jahr · Annahme
> - Vertrags- und Terminpreise — ÖSPI als Stellvertreter · Annahme
> - Umfang — nur der Energiepreis · ohne Netzentgelte, Steuern und Abgaben

## Methode

Die Pipeline läuft von den Quellen über ein getestetes Warehouse bis zum Strategiesimulator, in dieser Reihenfolge:

1. **Datenübernahme (Ingest).** Alle vier Quellen, abgerufen mit Wiederholungsversuchen und Zwischenspeicherung (Caching), als Rohdaten im Parquet-Format.
2. **Validierungsprüfungen (Gates).** Teil der Datenübernahme, damit eine plausibel wirkende Datei nicht unbemerkt durchgeht. Sie prüfen die Stundenabdeckung einschließlich der Tage mit 23 und 25 Stunden bei der Zeitumstellung, die Plausibilität von Preis und Last, die Verknüpfung Österreich–Deutschland und das Vorhandensein negativer Preise.
3. **Warehouse.** DuckDB, in dbt von Staging bis zu den Marts (fachlichen Auswertungstabellen) modelliert, mit Tests auf den Schemavertrag der Marts, die Stundenfolge rund um die Zeitumstellung und Lücken in der Monatsachse.
4. **Lastprofil und Marktanalytik.** Ein deterministisches Stundenprofil für den konstruierten Verbraucher; Saisonalität, negative Stunden, der Spread Österreich–Deutschland und Volatilitätsregime.
5. **Strategiesimulator.** Vier Kostenmodelle. Der Rückblick bewertet jede Strategie zu den realisierten Preisen von 2021–2025. Der Vorausblick zieht ganze historische Monate in einem Block-Bootstrap mit festem Seed neu, 2.000 Pfade für Oktober 2026 bis September 2027, und liest P95 und CVaR95 aus dem Ergebnis ab. Die Teilabsicherung läuft mit 30 %, 50 % und 70 % fix.
6. **Numerische Referenzdatei (Source of Truth).** Jede veröffentlichte Zahl wird mit ihrem epistemischen Etikett in eine Datei erzeugt, und die kontinuierliche Integration schlägt fehl, wenn ein Dokument eine Zahl nennt, die dort nicht steht.

Eine Preisprognose wird nicht erstellt: Die Strategien werden an realisierten Preisen und an deren Neuziehung (Resampling) bewertet.

> [!definition] P95 und CVaR95
> P95 sind die Zwölfmonatskosten, die 95 % der neu gezogenen Ergebnisse nicht überschreiten. CVaR95 (Conditional Value at Risk) ist der Mittelwert der Kosten jenseits von P95: Er zeigt, wie schwer der Rand der Verteilung wiegt, nicht nur, wo er beginnt.

## Ergebnis

**Der Markt.** Der österreichische Day-Ahead-Preis lag 2022 im Mittel bei 261,4 EUR/MWh, gegenüber 40,1 EUR/MWh im Jahr 2019 (VERIFIED). 2025 gab es 378 Stunden mit negativen Preisen (VERIFIED).

**Die Kosten der falschen Strategie.** Man nimmt für jedes Jahr die Differenz zwischen der teuersten und der günstigsten Strategie und summiert die fünf Differenzen: € 27,04 Mio. über 2021–2025 (CALIBRATED). Über die fünf Jahre war der fixe Jahrespreis die günstigste Strategie, mit insgesamt € 30,17 Mio. Voller Spotbezug war die teuerste, mit € 34,61 Mio.

| Strategie | 2021 | 2022 | 2023 | 2024 | 2025 | 2021–2025 |
|:--|--:|--:|--:|--:|--:|--:|
| Voller Spotbezug | 5,70 | 13,84 | 5,51 | 4,34 | 5,22 | 34,61 |
| ÖSPI-indexiert | 2,43 | 8,30 | 12,50 | 4,90 | 4,05 | 32,18 |
| Fixer Jahrespreis | 2,17 | 3,08 | 11,64 | 8,95 | 4,34 | 30,17 |
| Hybrid 30 % fix | 4,64 | 10,61 | 7,35 | 5,72 | 4,95 | 33,28 |
| Hybrid 50 % fix | 3,93 | 8,46 | 8,58 | 6,64 | 4,78 | 32,39 |
| Hybrid 70 % fix | 3,23 | 6,31 | 9,80 | 7,56 | 4,60 | 31,50 |

Jährliche Energiekosten in Mio. €, CALIBRATED. Vertragspreise über den ÖSPI angenähert; die Last ist konstruiert.

Die günstigste Strategie wechselt von Jahr zu Jahr: der fixe Jahrespreis 2021 und 2022, voller Spotbezug 2023 und 2024, der ÖSPI-Indexvertrag 2025. Die Rangfolge über fünf Jahre sagt daher etwas über dieses Fenster aus, nicht über ein einzelnes Jahr.

![[epra-wrong-strategy-cost.png|Balkendiagramm der jährlichen Differenz zwischen der teuersten und der günstigsten Strategie, 2021 bis 2025, mit dem Höchstwert 2022 von € 10,76 Mio.; die Summe über fünf Jahre beträgt € 27,04 Mio. Calibrated; das Lastprofil ist konstruiert. Beschriftung des Diagramms auf Englisch.]]

![[epra-annual-cost-by-strategy.png|Gruppiertes Balkendiagramm der jährlichen Energiekosten in Mio. € für sechs Strategievarianten, 2021 bis 2025. Die günstigste Variante wechselt von Jahr zu Jahr. Calibrated; Vertragspreise über den ÖSPI angenähert. Beschriftung des Diagramms auf Englisch.]]

**Die nächsten zwölf Monate.** Für Oktober 2026 bis September 2027, auf 2.000 neu gezogenen Pfaden (SIMULATED; keine Preisprognose):

| Strategie | Mittelwert | P95 | CVaR95 |
|:--|--:|--:|--:|
| Voller Spotbezug | 5,36 | 7,56 | 8,24 |
| ÖSPI-indexiert | 5,15 | 7,16 | 7,88 |
| Fixer Jahrespreis | 4,77 | 6,61 | 6,96 |
| Hybrid 30 % fix | 5,18 | 6,85 | 7,37 |
| Hybrid 50 % fix | 5,06 | 6,61 | 6,97 |
| Hybrid 70 % fix | 4,95 | 6,44 | 6,80 |

Energiekosten über zwölf Monate in Mio. €, SIMULATED.

Der fixe Jahrespreis hat die niedrigsten erwarteten Kosten, € 4,77 Mio., bei einem P95 von € 6,61 Mio. Der Hybrid mit 70 % fix hat das niedrigste P95, € 6,44 Mio. Gegenüber dem fixen Jahrespreis senkt er das P95 um € 0,17 Mio. und kostet im Erwartungswert € 0,18 Mio. mehr; das ist der Preis der Risikominderung. Voller Spotbezug trägt den schwersten Rand der Verteilung.

![[epra-forward-risk.png|Box-Whisker-Diagramm der simulierten Zwölfmonatskosten für sechs Strategien von Oktober 2026 bis September 2027, mit markiertem P95. Voller Spotbezug hat mit € 7,56 Mio. das höchste P95, Hybrid 70 % fix mit € 6,44 Mio. das niedrigste. Simulated, 2.000 Pfade. Beschriftung des Diagramms auf Englisch.]]

> [!quote] Ergebnis · fünf Jahre und Vorausblick
> Über 2021–2025 war der fixe Jahrespreis mit € 30,17 Mio. insgesamt am günstigsten. Für die nächsten zwölf Monate hat er die niedrigsten erwarteten Kosten, und der Hybrid mit 70 % fix das niedrigste P95.

## Grenzen

Was diese Arbeit nicht belegt:

- **Eine gemessene Last.** Das Lastprofil ist konstruiert, nicht gemessen, und es ist eine einzige Industrielast von 50 GWh pro Jahr. Gemessene Daten würden das Kostenniveau verändern. Eine Variante mit flacher Grundlast, als Sensitivität gerechnet, lässt den fixen Jahrespreis über fünf Jahre die günstigste Strategie bleiben.
- **Vertrags- und Terminpreise.** Der ÖSPI steht stellvertretend für sie; das ist eine Annahme und als solche gekennzeichnet. Er bildet Lieferantenmargen, Zahlungs- und Kreditbedingungen und Flexibilitätsklauseln nicht ab, und die Richtung dieser Verzerrung ist unbekannt. Auch ein niedrigerer und ein höherer Festpreisaufschlag als der Standardwert lassen den fixen Jahrespreis über fünf Jahre die günstigste Strategie bleiben.
- **Eine Rangfolge, die über 2021–2025 hinaus gilt.** Das Fünfjahresergebnis enthält die Krise 2022. Der Vorausblick zieht die Geschichte neu und kann kein Regime ohne Vorbild simulieren; sein P95 und CVaR95 würden ein solches unterschätzen. In der Variante ohne die Krisenjahre hat voller Spotbezug die niedrigsten erwarteten Kosten, € 3,83 Mio. gegenüber € 4,26 Mio. beim fixen Jahrespreis (SIMULATED). Die Reihenfolge hängt davon ab, ob ein Rand wie 2022 im Pool bleibt.
- **Eine genaue Volatilitätsschätzung.** Das angepasste Volatilitätsmodell liegt an seiner Grenze, mit einer Persistenz von 1,00 (VERIFIED). Das ist als Untergrenze dafür zu lesen, wie lange Turbulenz anhält, nicht als genauer Wert.
- **Die vollen Stromkosten.** Netzentgelte, Steuern und Abgaben liegen außerhalb des Umfangs; die Analyse isoliert den Hebel Energiepreis.
- **Eine Preisprognose.** Keine wird erstellt: Die Strategien werden an realisierten Preisen und an deren Neuziehung bewertet.

## Entscheidung

Über 2021–2025 hatte der fixe Jahrespreis die niedrigsten Gesamtkosten, € 30,17 Mio. Für die nächsten zwölf Monate hat er die niedrigsten erwarteten Kosten, € 4,77 Mio., und der Hybrid mit 70 % fix das niedrigste P95, € 6,44 Mio., bei € 0,18 Mio. höheren Erwartungskosten.

<!-- PENDING DL-5: owner wording of the recommendation -->

Das Ergebnis hängt von der konstruierten Last und dem ÖSPI als Stellvertreter ab. Gemessene Lastdaten und echte Lieferantenangebote würden es verändern.

Das Repository enthält den Code, die Diagramme, die Kurzfassung für die Geschäftsführung, die Grenzen und die numerische Referenzdatei.
