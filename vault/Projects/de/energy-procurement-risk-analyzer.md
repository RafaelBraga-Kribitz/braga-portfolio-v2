---
code: "01-04"
kind: brief
date: "2026-07-24"
summary: Von Strompreisdaten zu einer Kosten-Risiko-Entscheidung. Im Aufbau.
lead: "Voller Spotbezug, Indexvertrag, Festpreis oder Teilabsicherung: vier Wege, Strom für einen steirischen Produktionsbetrieb einzukaufen. Das Data Warehouse steht; die Antwort in Euro steht noch aus."
domain: Energie
tags: [ status/in-build, energiebeschaffung, risikoanalyse, data-warehouse ]
lang: de
slug: energy-procurement-risk-analyzer
metrics:
  - { value: "4", label: Übernommene Datenquellen }
  - { value: "4", label: "Beschaffungsstrategien, noch nicht bewertet" }
  - { value: "50 GWh", label: "Jahresverbrauch, konstruiert" }
repository: https://github.com/RafaelBraga-Kribitz/energy-procurement-risk-analyzer
translationStatus: draft
publish: true
---

# Risikoanalyse für die Energie­beschaffung

> [!summary] Zusammenfassung
> Die Datenübernahme aus vier Quellen und ein in dbt modelliertes DuckDB-Warehouse sind gebaut und getestet; Ergebnisse zu den Strategien gibt es noch nicht. Empfohlen wird noch keine Strategie, und nach der projekteigenen Regel wird kein Ergebnis genannt, bevor es in der automatisch erzeugten numerischen Referenzdatei (Source of Truth) steht, die mit dem Strategiesimulator entsteht.

## Fragestellung

Nach der europäischen Energiekrise 2021–2023 wurde die Strombeschaffung für die österreichische Industrie zu einem Risiko auf Vorstandsebene. Was kostete es einen steirischen Produktionsbetrieb mit einem Jahresverbrauch von 50 GWh, Strom in den Jahren 2021–2025 auf die falsche Weise einzukaufen, und wie hoch ist das Kostenrisiko auf P95-Niveau (95. Perzentil) für die nächsten zwölf Monate unter jeder Beschaffungsstrategie? Das Projekt vergleicht vier Strategien am österreichischen Day-Ahead-Markt (Großhandelsmarkt für Lieferungen am Folgetag), nämlich vollständigen Spotbezug, einen Indexvertrag, einen fixen Jahrespreis und eine Teilabsicherung, für eine einzige konstruierte Industrielast von 50 GWh. Die Vergleichseinheit sind die Energiepreiskosten dieser Last in Euro je Strategie: realisiert zu den Preisen von 2021–2025 sowie als P95 und CVaR95 der nächsten zwölf Monate auf Basis neu gezogener Preise.

## Daten

Die Marktdaten sind real; kein Marktpreis ist synthetisch. Day-Ahead-Preise für Österreich und Deutschland–Luxemburg sowie Last und Erzeugung in Österreich stammen von der ENTSO-E-Transparenzplattform, der monatliche Preisindex ÖSPI von der Österreichischen Energieagentur (von Hand übertragen, doppelt erfasst), die Tagesmitteltemperatur für Graz von GeoSphere Austria; ein Kalender enthält die österreichischen und steirischen Feiertage. Das Zeitfenster reicht von Jänner 2019 bis zum letzten vollständigen Monat.

Zwei Eingaben sind Annahmen und als solche gekennzeichnet. Das Lastprofil des Verbrauchers ist konstruiert, nicht gemessen, und der ÖSPI steht stellvertretend für Vertrags- und Terminpreise. Netzentgelte, Steuern und Abgaben liegen außerhalb des Umfangs; die Analyse isoliert damit den Hebel Energiepreis.

> [!spec] Eingaben
> - Day-Ahead-Preise — Österreich und Deutschland–Luxemburg · ENTSO-E-Transparenzplattform
> - Last und Erzeugung — Österreich · ENTSO-E-Transparenzplattform
> - Preisindex — ÖSPI, monatlich · Österreichische Energieagentur · von Hand übertragen, doppelt erfasst
> - Temperatur — Tagesmittel, Graz · GeoSphere Austria
> - Kalender — österreichische und steirische Feiertage
> - Zeitfenster — Jänner 2019 bis zum letzten vollständigen Monat
> - Lastprofil — konstruiert, 50 GWh pro Jahr · Annahme
> - Vertrags- und Terminpreise — ÖSPI als Stellvertreter · Annahme
> - Umfang — nur der Energiepreis · ohne Netzentgelte, Steuern und Abgaben

## Methode

Gebaut ist die Pipeline von den Quellen bis zu einem getesteten Warehouse, in dieser Reihenfolge:

1. **Datenübernahme (Ingest).** Alle vier Quellen, abgerufen mit Wiederholungsversuchen und Zwischenspeicherung (Caching), als Rohdaten im Parquet-Format.
2. **Validierungsprüfungen (Gates).** Teil der Datenübernahme, damit eine plausibel wirkende Datei nicht unbemerkt durchgeht. Sie prüfen die Stundenabdeckung einschließlich der Tage mit 23 und 25 Stunden bei der Zeitumstellung, die Plausibilität von Preis und Last, die Verknüpfung Österreich–Deutschland und das Vorhandensein negativer Preise.
3. **Warehouse.** DuckDB, in dbt von Staging bis zu den Marts (fachlichen Auswertungstabellen) modelliert. Die dbt-Tests prüfen den Schemavertrag der Marts, die Daylight-Saving-Adjacency (die Stundenfolge rund um die Zeitumstellung), einen Preisabgleich für August 2022 und Lücken in der Monatsachse (Month Spine).
4. **Kontinuierliche Integration (CI).** Die CI führt Lint, die Tests und einen dbt-Build ohne Netzwerkzugriff gegen ein Test-Warehouse (Fixture) aus.

Noch zu bauen sind das Lastprofil, die Marktanalytik, vier Kostenmodelle für die Strategien mit einem Block-Bootstrap mit festem Seed (Startwert des Zufallsgenerators) für das künftige Kostenrisiko (P95 und CVaR95) sowie die Berichtsebene. Eine Preisprognose ist nicht vorgesehen: Die Strategien werden an realisierten Preisen und an deren Neuziehung (Resampling) bewertet.

> [!definition] P95 und CVaR95
> P95 sind die Zwölfmonatskosten, die 95 % der neu gezogenen Ergebnisse nicht überschreiten. CVaR95 (Conditional Value at Risk) ist der Mittelwert der Kosten jenseits von P95: Er zeigt, wie schwer der Rand der Verteilung wiegt, nicht nur, wo er beginnt.

## Ergebnis

Noch keines. Die Grundlagenphase steht; die Teile, die ein Ergebnis erzeugen würden, stehen noch nicht.

| Komponente | Stand |
|:--|:--|
| ENTSO-E-Datenübernahme | Gebaut |
| Wetter-, Index- und Kalenderquellen | Gebaut |
| Validierungsprüfungen und dbt-Tests | Gebaut |
| DuckDB-Warehouse, dbt von Staging bis zu den Marts | Gebaut |
| Kontinuierliche Integration | Gebaut |
| Lastprofil | Nicht gebaut |
| Marktanalytik | Nicht gebaut |
| Strategiesimulator: vier Kostenmodelle, Block-Bootstrap | Nicht gebaut |
| Berichtsebene | Nicht gebaut |

Bis die letzten vier gebaut sind, brechen ihre Befehle mit einer deutlichen Fehlermeldung ab und nennen den Meilenstein, zu dem sie gehören.

Nach der projekteigenen Regel muss jede veröffentlichte Zahl zuerst mit ihrem epistemischen Etikett in einer automatisch erzeugten numerischen Referenzdatei stehen, und diese Datei entsteht erst mit dem Strategiesimulator. Bis dahin nennt diese Seite kein Ergebnis: keine Strategiekosten für 2021–2025, kein P95 und kein CVaR95.

> [!quote] Ergebnis · Grundlagenphase
> Datenübernahme und Warehouse sind gebaut; Ergebnisse zu den Strategien gibt es noch nicht.

## Grenzen

Was diese Arbeit nicht belegt:

- **Ein Strategieergebnis.** Es gibt noch keine realisierten Kosten für 2021–2025, kein P95 und kein CVaR95; diese Seite nennt keines davon.
- **Eine gemessene Last.** Das Lastprofil ist konstruiert, nicht gemessen, und es ist eine einzige Industrielast von 50 GWh pro Jahr.
- **Vertrags- und Terminpreise.** Der ÖSPI steht stellvertretend für sie; das ist eine Annahme und als solche gekennzeichnet.
- **Die vollen Stromkosten.** Netzentgelte, Steuern und Abgaben liegen außerhalb des Umfangs; die Analyse isoliert den Hebel Energiepreis.
- **Eine Preisprognose.** Keine ist vorgesehen: Die Strategien werden an realisierten Preisen und an deren Neuziehung bewertet.

## Entscheidung

Noch wird keine Strategie empfohlen. Das Projekt führt von Strompreisdaten zu einer Kosten-Risiko-Entscheidung zwischen den vier Strategien, und diese Entscheidung wartet auf den Strategiesimulator und die Referenzdatei, die mit ihm entsteht.

Im Aufbau: Die Grundlagenphase ist umgesetzt; Lastprofil, Analytik, Simulator und Berichtsebene sind es nicht. Das Repository enthält die Projektcharta, die Spezifikationen und die bisherige Pipeline.

## Entstehung

```buildlog
```
