---
code: "01-02"
kind: case
date: "2026-05-21"
updated: "2026-09-16"
summary: "Der Kostenbarwert über fünf Jahre beträgt € 453.000. Eine Person mit drei mobilen Robotern führt das Modell an."
lead: "Bei der modellierten Nachfrage schlagen humanoide Roboter die schlanke Hybridvariante noch nicht. Das Projekt enthält ein Fünfjahres-Kostenmodell für das Greifen, Bewegen und Ablegen von Waren im Lager."
domain: Betrieb
tags: [ status/complete, intralogistik, gesamtbetriebskosten, simulation ]
lang: de
slug: warehouse-humanoid-tco
metrics:
  - { value: "€ 453.000", label: Niedrigster Kostenbarwert über fünf Jahre, accent: true }
  - { value: "€ 0,374", label: Kosten je Auftrag }
  - { value: "99,8 %", label: Ziehungen zugunsten der Hybridvariante }
stack: [ "SQL", "Python", "Polars", "DuckDB", "dbt", "Docker", "CI/CD" ]
repository: https://github.com/RafaelBraga-Kribitz/warehouse_humanoid_tco
translationStatus: approved
publish: true
---

# TCO humanoider Roboter im Lager

## Frage: Wann wären humanoide Roboter die günstigste Lösung für die Arbeit im Lager?

> [!summary] Zusammenfassung
> Eine Person mit drei autonomen mobilen Robotern (AMR) hat den niedrigsten Kostenbarwert über fünf Jahre, € 453.000, und gewinnt 99,8 % der ausgewerteten Ziehungen. Die Entscheidung stellt humanoide Roboter zurück, bis sich Nachfrage, Arbeitskräfteangebot oder Schichtmodell ändern.

## Hintergrund

Es geht um die Wirtschaftlichkeit, nicht um die technische Fähigkeit. Die Antwort hängt von Roboterpreis, Nachfrage und Personalausstattung ab. Die Vergleichsgröße ist der Kostenbarwert über fünf Jahre bei einem Kalkulationszinssatz von 8 %.

## Daten

Die Leistungsdaten sind Demonstrationen aus dem Haushalt, keine Lageraufgaben und keine Messungen einer eingesetzten Flotte. Das Modell nutzt als Näherung die Grundbewegungen der Demonstrationen (Greifen, Bewegen und Ablegen) mit einem Übertragungsfaktor für die Geschwindigkeit. Diese Übertragung ist die größte Gefahr für die externe Validität.

> [!spec] Modelleingaben
> - Episoden — 2.359 · fünf öffentliche UnifoLM-Datensätze, per Hash fixiert
> - Demonstrationen — Teller in einen Geschirrspüler, Aufheben eines Polsters, Wäsche in eine Waschmaschine, ein- und zweiarmige Manipulation
> - Übertragung — Faktor 0,50–0,90 auf die demonstrierte Geschwindigkeit
> - Szenarien — 7, von reinen Personalteams über Hybridvarianten mit AMR bis zu rein humanoiden Flotten · je 15 Replikationen, 105 Läufe
> - Nachfrage — 120 Aufträge pro Stunde · Auslastung höchstens 0,85
> - Unsicherheit — 10.000 Monte-Carlo-Ziehungen je Szenario
> - Zinssatz — 8 % pro Jahr über fünf Jahre
> - Arbeitskosten — Löhne nach österreichischem Kollektivvertrag (KV)
> - Investitionskosten (Capex) — öffentliche Preisannahmen für Roboter und AMR
> - Kostenpositionen — Integrationskosten und Abschläge für die Verfügbarkeit enthalten

## Methode

Vier Module laufen nacheinander mit einem einzigen Befehl.

| Schritt | Modul | Arbeit |
|:--|:--|:--|
| 1 | Ermittlung der Leistungsdaten | Taktzeiten und eine regelbasierte Aufgabentaxonomie aus den Episoden. |
| 2 | Ereignisdiskrete Simulation | Replikationen jedes Szenarios, nachfragebegrenzt, jedes Szenario auf die Auslastungsgrenze dimensioniert. |
| 3 | Fünfjahreskosten mit Monte-Carlo-Simulation | Ziehungen je Szenario, One-at-a-time-Sensitivitätsanalyse (jeweils ein Parameter variiert) und Sobol-Sensitivitätsanalyse, binäre Suche nach dem Preis humanoider Roboter, bei dem die Flotte kostengleich wird (Breakeven). |
| 4 | Berichtswesen | Grafiken für das Management, CSV-Exporte, eine Management-Zusammenfassung auf Deutsch und Englisch, eine Tableau-Public-Arbeitsmappe. |

> [!definition] Kostenbarwert
> Künftige Zahlungen, mit dem angegebenen Zinssatz auf heute abgezinst, sodass Kosten aus verschiedenen Jahren addierbar sind. Hier gelten 8 % pro Jahr über fünf Jahre.

Ein nachverfolgter Befund hat das Hauptergebnis verändert.[^1] Eine frühere Version hat feste Teams unterschiedlicher Größe verglichen, acht Personen gegen sechs AMR-Hybrideinheiten. Ihre „günstigste Option“ hat daher ein kleineres Team mit einer Technologiewahl vermischt. Derselbe Optimierer dimensioniert nun jedes Szenario außer dem Altszenario auf die geringsten Fünfjahreskosten unter der Auslastungsgrenze. Das Team aus acht Personen bleibt als gekennzeichnete Referenz für die Kosten einer Überbesetzung.

## Ergebnis

> [!figure] Abb. 01-02-1 · Kostenbarwert über fünf Jahre nach Szenario
> Die schlanke Hybridvariante hat die niedrigsten Kosten im Basisfall und gewinnt 99,8 % der Ziehungen, obwohl ihr Intervall das des schlanken Teams überlappt.
> ![[01-02-tco-range.de.svg]]
>
> caption: Tausend Euro, Kostenbarwert bei 8 %. Der Punkt ist der Basisfall, der gestrichelte Strich das Monte-Carlo-Mittel, die Linie das Intervall zu 90 % aus 10.000 Ziehungen. n = 7 Szenarien. Basisfall und Monte-Carlo-Mittel unterscheiden sich. Bei der rein humanoiden Flotte betragen sie 2.878 und 3.490. Im Basisfall kostet die schlanke Hybridvariante 30 % weniger als reines Personal. Die schlanke Hybridvariante kostet weniger als ein Fünftel von Humanoid 2028, dem günstigsten modellierten Humanoid-Szenario. Die Referenz mit acht Personen ist ein Altszenario. Sie ist als Referenz für die Kosten einer Überbesetzung gekennzeichnet.
> source: Fünfjahres-TCO-Modell, Projekt-Repository: Basisfall aus dem Szenarioexport, Monte-Carlo-Werte aus dem Sensitivitätsbericht. Zuletzt aktualisiert am 16. Sep. 2026.

| Szenario | Kostenbarwert, fünf Jahre | Capex | Kosten je Auftrag |
|:--|--:|--:|--:|
| Schlanke Hybridvariante: 1 Person, 3 AMR (S-lean-hybrid-amr) | € 452.706 | € 195.000 | € 0,374 |
| Schlankes Team: 3 Personen (S-lean-human) | € 647.401 | € 0 | € 0,543 |
| Referenz mit acht Personen, Altszenario (S-baseline-human) | € 1.726.403 | € 0 | € 1,444 |
| Humanoid 2028: 3 Personen, 9 Humanoide mit 1,3-fachem Durchsatz (S-future-2028) | € 2.532.753 | € 1.365.349 | € 2,120 |
| Nur Humanoide (S-pure-humanoid) | € 2.877.837 | € 2.051.609 | € 2,407 |
| Humanoide + AMR + Team: 3 Personen, 11 Humanoide, 4 AMR (S-hybrid-amr) | € 3.841.113 | € 2.311.609 | € 3,244 |
| 50/50-Hybrid (S-hybrid-5050) | € 5.251.641 | € 2.051.609 | € 4,411 |

> [!spec] Schlanke Hybridvariante, 10.000 Monte-Carlo-Ziehungen
> - Mittelwert — € 461.414
> - Standardabweichung — € 43.755
> - 90-%-Intervall — € 394.658–€ 537.549
> - Gewonnene Ziehungen — 99,8 % der ausgewerteten Ziehungen

Die Breakeven-Suche hat Investitionskosten humanoider Roboter von € 10.000 bis € 500.000 je Einheit abgedeckt. Bei 120 Aufträgen pro Stunde erreicht eine rein humanoide Flotte bei keinem Preis dieses Bereichs die Kosten je Auftrag der schlanken Hybridvariante. Daher sind die Investitionskosten nicht der begrenzende Faktor.

## Grenzen

Die Rangfolge gilt nur unter den genannten Annahmen.

- **Leistung im Lager.** Demonstrationen aus dem Haushalt bleiben eine Näherung für Lageraufgaben.
- **Standortbezogener Beschaffungsfall.** Es gibt keine im Lager gemessenen Taktzeiten und keine unterzeichneten Angebote für humanoide Roboter.
- **Lokale Preise.** Öffentliche Listenpreise und geschätzte KV-Löhne können die Kosten in beide Richtungen verschieben.
- **Unabhängige Reproduktion.** Ein Agent hat das hinterlegte Reproduktionsprotokoll erstellt. Kein Dritter hat das Repository ohne Vorwissen geklont.

> [!warning] Eine Annahme benachteiligt die Roboter
> Das Modell setzt voraus, dass Arbeitskräfte zu KV-Löhnen verfügbar sind. Wenn Stellen unbesetzt bleiben, kann diese Annahme den Wert der Automatisierung unterschätzen.

## Entscheidung

Wenn die genannten Annahmen gelten, validieren Sie die schlanke Hybridvariante am Standort. Stellen Sie die Beschaffung humanoider Roboter zurück. Prüfen Sie vor jeder Beschaffungsentscheidung den im tatsächlichen Lager gemessenen Durchsatz und unterzeichnete Lieferantenangebote.

> [!faq]- Wann lohnt sich eine erneute Prüfung?
> Eine erneute Prüfung lohnt sich bei wachsender Nachfrage, bei knappen Arbeitskräften oder bei Mehrschichtbetrieb. Bei der modellierten Nachfrage erreicht eine humanoide Flotte zu keinem Preis im durchsuchten Bereich Kostengleichheit.

## Entstehung

```buildlog
```

[^1]: Die Entwicklung folgt einem Governance-Protokoll, das die kontinuierliche Integration (CI, automatisierte Prüfung bei jeder Änderung) durchsetzt. Jede Änderung schließt einen nachverfolgten Befund mit einem benannten Prüfskript ab. Bei jedem Pull-Request startet die CI das Skript jedes abgeschlossenen Befunds erneut.
