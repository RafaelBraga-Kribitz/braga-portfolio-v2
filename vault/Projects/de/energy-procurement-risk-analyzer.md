---
code: "01-05"
kind: brief
date: "2026-07-24"
summary: Von Strompreisdaten zu einer Kosten-Risiko-Entscheidung. Im Aufbau.
lead: "Voller Spotbezug, Indexvertrag, Festpreis oder Teilabsicherung: vier Wege, Strom für einen steirischen Produktionsbetrieb einzukaufen. Das Data Warehouse steht; die Antwort in Euro steht noch aus."
domain: Energie
tags: [ status/in-build, energiebeschaffung, risikoanalyse, data-warehouse ]
lang: de
slug: energy-procurement-risk-analyzer
metrics:
  - { value: "5 von 9", label: "Komponenten gebaut", accent: true }
  - { value: "4", label: "Beschaffungsstrategien, noch nicht bewertet" }
  - { value: "50 GWh", label: "Jahresverbrauch, konstruiert" }
stack: [ "SQL", "Python", "Azure", "Power BI", "DAX", "DuckDB", "dbt", "statsmodels", "Time series", "CI/CD" ]
repository: https://github.com/RafaelBraga-Kribitz/energy-procurement-risk-analyzer
translationStatus: approved
publish: true
---

# Risikoanalyse für die Energie­beschaffung

## Frage: Wie stark verändert die Art des Stromeinkaufs die Kosten und das Risiko eines steirischen Produktionsbetriebs?

> [!summary] Zusammenfassung
> Die Datenübernahme aus vier Quellen und ein in dbt modelliertes DuckDB-Warehouse sind gebaut und getestet. Ergebnisse zu den Strategien gibt es noch nicht, und empfohlen wird noch keine Strategie.

> [!note] Stand der Grundlage · 24. Juli 2026
> Diese Seite dokumentiert die Grundlagenphase, nicht den aktuellen Repository-Stand. Das [am 1. Nov. 2026 geprüfte Repository](https://github.com/RafaelBraga-Kribitz/energy-procurement-risk-analyzer/blob/e3e115c74f58745ce8ba4592d7c6b6ec89ef5d5e/README.md) berichtet über den ersten Lauf mit realen Daten und fertiggestellte Strategie-Engines. Deren neuere Zahlen wurden für diese Seite nicht unabhängig reproduziert.

## Hintergrund

Nach der europäischen Energiekrise 2021–2023 wurde die Strombeschaffung für die österreichische Industrie zu einem Risiko auf Vorstandsebene. Das Projekt nimmt einen steirischen Produktionsbetrieb mit einem Jahresverbrauch von 50 GWh. Es fragt zweierlei. Erstens: Was kostete es, Strom in den Jahren 2021–2025 auf die falsche Weise einzukaufen? Zweitens: Wie hoch ist das Kostenrisiko auf P95-Niveau (95. Perzentil) für die nächsten zwölf Monate unter jeder Strategie? Es vergleicht vier Strategien am österreichischen Day-Ahead-Markt (Großhandelsmarkt für Lieferungen am Folgetag): vollständigen Spotbezug, einen Indexvertrag, einen fixen Jahrespreis und eine Teilabsicherung.

| Kennzahl | Einheit | Preise |
|:--|:--|:--|
| Realisierte Kosten | Energiepreiskosten der Last, in Euro | 2021–2025 |
| P95 und CVaR95 (Conditional Value at Risk) | Energiepreiskosten der nächsten zwölf Monate, in Euro | Neu gezogen |

## Daten

Die Marktdaten sind real. Kein Marktpreis ist synthetisch.

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

| Komponente | Arbeit und Prüfungen | Stand |
|:--|:--|:--|
| ENTSO-E-Datenübernahme (Ingest) | Alle vier Quellen, abgerufen mit Wiederholungsversuchen und Zwischenspeicherung (Caching), als Rohdaten im Parquet-Format | Gebaut |
| Wetter-, Index- und Kalenderquellen | Temperatur, ÖSPI und Feiertage | Gebaut |
| Validierungsprüfungen (Gates) und dbt-Tests | Die Gates prüfen die Stundenabdeckung (einschließlich der Tage mit 23 und 25 Stunden bei der Zeitumstellung), die Plausibilität von Preis und Last, die Verknüpfung Österreich–Deutschland und das Vorhandensein negativer Preise, damit eine plausibel wirkende Datei nicht unbemerkt durchgeht. Die dbt-Tests prüfen den Schemavertrag der Marts (fachliche Auswertungstabellen), die Daylight-Saving-Adjacency (die Stundenfolge rund um die Zeitumstellung), einen Preisabgleich für August 2022 und Lücken in der Monatsachse (Month Spine) | Gebaut |
| DuckDB-Warehouse | dbt-Modelle von Staging bis zu den Marts | Gebaut |
| Kontinuierliche Integration (CI) | Lint, Tests und ein dbt-Build ohne Netzwerkzugriff gegen ein Test-Warehouse (Fixture) | Gebaut |
| Lastprofil | Konstruiertes Lastprofil von 50 GWh pro Jahr | Nicht gebaut |
| Marktanalytik | Analyse der Marktdaten | Nicht gebaut |
| Strategiesimulator | Vier Kostenmodelle und ein Block-Bootstrap mit festem Seed (Startwert des Zufallsgenerators) für das künftige Kostenrisiko (P95 und CVaR95) | Nicht gebaut |
| Berichtsebene | Berichtsebene | Nicht gebaut |

> [!definition] P95 und CVaR95
> P95 sind die Zwölfmonatskosten, die 95 % der neu gezogenen Ergebnisse nicht überschreiten. CVaR95 (Conditional Value at Risk) ist der Mittelwert der Kosten jenseits von P95. Er zeigt, wie schwer der Rand der Verteilung wiegt, nicht nur, wo er beginnt.

## Ergebnis

Noch keines. Bis die letzten vier Komponenten gebaut sind, brechen ihre Befehle mit einer deutlichen Fehlermeldung ab und nennen ihren Meilenstein. Jede veröffentlichte Zahl muss zuerst mit ihrem epistemischen Etikett in einer automatisch erzeugten numerischen Referenzdatei (Source of Truth) stehen, die mit dem Strategiesimulator entsteht. Bis dahin nennt diese Seite kein Ergebnis:

- Keine Strategiekosten für 2021–2025.
- Kein P95.
- Kein CVaR95.

## Grenzen

Was diese Arbeit nicht belegt:

- **Ein Strategieergebnis.** Es gibt noch keine realisierten Kosten für 2021–2025, kein P95 und kein CVaR95.
- **Eine gemessene Last.** Das Lastprofil ist konstruiert, nicht gemessen. Es ist eine einzige Industrielast von 50 GWh pro Jahr.
- **Vertrags- und Terminpreise.** Der ÖSPI steht stellvertretend für sie. Das ist eine Annahme und als solche gekennzeichnet.
- **Die vollen Stromkosten.** Netzentgelte, Steuern und Abgaben liegen außerhalb des Umfangs. Die Analyse isoliert den Hebel Energiepreis.
- **Eine Preisprognose.** Keine ist vorgesehen. Die Strategien werden an realisierten Preisen und an deren Neuziehung bewertet.

## Entscheidung

Noch wird keine Strategie empfohlen: Die Kosten-Risiko-Entscheidung zwischen den vier Strategien wartet auf den Strategiesimulator und seine Referenzdatei.

## Entstehung

```buildlog
```
