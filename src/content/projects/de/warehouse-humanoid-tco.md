---
title: TCO humanoider Roboter im Lager
code: "01-04"
kind: case
date: "2026-05-21"
updated: "2026-09-16"
summary: "€ 453.000 über fünf Jahre. Eine Person mit drei mobilen Robotern führt das Modell an."
lead: "Bei der modellierten Nachfrage schlagen humanoide Roboter die schlanke Hybridvariante noch nicht. Ein Fünfjahres-Kostenmodell für das Greifen, Bewegen und Ablegen von Waren im Lager."
domain: Betrieb
status: complete
tags: [Intralogistik, Gesamtbetriebskosten, Simulation]
lang: de
slug: warehouse-humanoid-tco
metrics:
  - { value: "€ 453.000", label: Niedrigster Kostenbarwert über fünf Jahre, accent: true }
  - { value: "€ 0,374", label: Kosten je Auftrag }
  - { value: "99,8 %", label: Ziehungen zugunsten der Hybridvariante }
repository: https://github.com/RafaelBraga-Kribitz/warehouse_humanoid_tco
draft: false
translationStatus: draft
---

> [!summary] Zusammenfassung
> Eine Person mit drei autonomen mobilen Robotern (AMR) hat den niedrigsten Kostenbarwert über fünf Jahre, € 453.000, und gewinnt 99,8 % der ausgewerteten Ziehungen. Humanoide Roboter werden zurückgestellt, bis sich Nachfrage, Arbeitskräfteangebot oder Schichtmodell ändern.

## Fragestellung

Die Frage gilt der Wirtschaftlichkeit, nicht der technischen Fähigkeit. Bei welchem Preis, welcher Nachfrage und welcher Personalausstattung würde eine Flotte humanoider Roboter das Greifen, Bewegen und Ablegen von Waren im Lager günstiger erledigen? Das Modell bewertet sieben Besetzungsszenarien, von reinen Personalteams über Hybridvarianten mit AMR bis zu rein humanoiden Flotten. Vergleichsgröße ist der Kostenbarwert über fünf Jahre bei einem Kalkulationszinssatz von 8 %.

## Daten

Die Annahmen zur Leistungsfähigkeit stützen sich auf 2.359 Episoden aus fünf öffentlichen UnifoLM-Datensätzen, per Hash fixiert. Es sind Demonstrationen aus dem Haushalt (Teller in einen Geschirrspüler, Aufheben eines Polsters, Wäsche in eine Waschmaschine, ein- und zweiarmige Manipulation), keine Lageraufgaben. Das Modell nutzt ihre Grundbewegungen Greifen, Bewegen und Ablegen als Näherung und wendet auf ihre Geschwindigkeit einen Übertragungsfaktor zwischen 0,50 und 0,90 an. Diese Übertragung ist die größte Gefahr für die externe Validität, und sie wird vor jedem Ergebnis genannt.

Die Arbeitskosten beruhen auf Löhnen nach österreichischem Kollektivvertrag (KV), die Investitionskosten (Capex) für Roboter und AMR auf öffentlichen Preisannahmen. Integrationskosten und Abschläge für die Verfügbarkeit sind Teil des Modells.

> [!aside] Randbemerkung
> Es handelt sich nicht um Messungen einer im Lager eingesetzten Flotte. Die Näherung ist die erste der unten genannten Grenzen.

> [!spec] Modelleingaben
> - Episoden — 2.359 · fünf öffentliche UnifoLM-Datensätze, per Hash fixiert
> - Übertragung — Faktor 0,50–0,90 auf die demonstrierte Geschwindigkeit
> - Szenarien — 7 · je 15 Replikationen, 105 Läufe
> - Nachfrage — 120 Aufträge pro Stunde · Auslastung höchstens 0,85
> - Unsicherheit — 10.000 Monte-Carlo-Ziehungen je Szenario
> - Zinssatz — 8 % pro Jahr über fünf Jahre
> - Arbeitskosten — Löhne nach österreichischem Kollektivvertrag (KV)
> - Capex — öffentliche Preisannahmen für Roboter und AMR

## Methode

Vier Module laufen nacheinander mit einem einzigen Befehl:

1. **Extraktion der Leistungsfähigkeit.** Taktzeiten und eine regelbasierte Aufgabentaxonomie aus den Episoden.
2. **Ereignisdiskrete Simulation.** Sieben Besetzungsszenarien mit je 15 Replikationen (105 Läufe), nachfragebegrenzt bei 120 Aufträgen pro Stunde; jedes Szenario wird auf eine Auslastung von höchstens 0,85 dimensioniert.
3. **Fünfjahreskosten mit Monte-Carlo-Simulation.** 10.000 Ziehungen je Szenario, One-at-a-time-Sensitivitätsanalyse (jeweils ein Parameter variiert) und Sobol-Sensitivitätsanalyse sowie eine binäre Suche nach dem Preis humanoider Roboter, bei dem die Flotte kostengleich wird (Breakeven).
4. **Berichtswesen.** Grafiken für das Management, CSV-Exporte, eine Management-Zusammenfassung auf Deutsch und Englisch und eine Tableau-Public-Arbeitsmappe.

> [!definition] Kostenbarwert
> Künftige Zahlungen, mit dem angegebenen Zinssatz auf heute abgezinst, sodass Kosten aus verschiedenen Jahren addiert werden können. Hier 8 % pro Jahr über fünf Jahre.

Ein nachverfolgter Befund hat das Hauptergebnis verändert.[^1] Eine frühere Version verglich feste Teams unterschiedlicher Größe, acht Personen gegen sechs AMR-Hybrideinheiten; ihre „günstigste Option“ vermischte daher ein kleineres Team mit einer Technologiewahl. Jedes Szenario außer dem Altszenario wird nun vom selben Optimierer auf die geringsten Fünfjahreskosten unter der Auslastungsgrenze dimensioniert, und das Team aus acht Personen bleibt nur als gekennzeichnete Referenz für die Kosten einer Überbesetzung.

## Ergebnis

Von den sieben Szenarien hat die schlanke Hybridvariante aus einer Person und drei AMR den niedrigsten Kostenbarwert über fünf Jahre. Ihr Investitionsbedarf beträgt € 195.000.

> [!bars] Abb. 01-04-1 · Kostenbarwert über fünf Jahre nach Szenario
> Die schlanke Hybridvariante kostet 30 % weniger als reines Personal und weniger als ein Fünftel des besten Humanoid-Falls.
> - Person + 3 AMR — 453
> - Nur Personal — 647
> - Humanoid 2028 — 2533
> - Nur Humanoide — 2878
>
> accent: Person + 3 AMR
> caption: Barwert bei 8 %, in Tausend Euro; Skala 0–2.878. n = 4 von 7 Szenarien. Person + 3 AMR ist S-lean-hybrid-amr, Nur Personal S-lean-human, Humanoid 2028 S-future-2028 (der beste Humanoid-Fall), Nur Humanoide S-pure-humanoid.
> source: Fünfjahres-TCO-Modell, Projekt-Repository, zuletzt aktualisiert am 16. Sep. 2026.

Die Tabelle zeigt alle sieben. S-lean-hybrid-amr ist die schlanke Hybridvariante, S-lean-human das schlanke Team aus drei Personen und S-future-2028 der beste Humanoid-Fall; S-baseline-human (Altszenario) ist die gekennzeichnete Referenz für die Kosten einer Überbesetzung.

| Szenario | Barwert, fünf Jahre | Capex | Kosten je Auftrag |
|:--|--:|--:|--:|
| S-lean-hybrid-amr | € 452.706 | € 195.000 | € 0,374 |
| S-lean-human | € 647.401 | € 0 | € 0,543 |
| S-baseline-human (Altszenario) | € 1.726.403 | € 0 | € 1,444 |
| S-future-2028 | € 2.532.753 | € 1.365.349 | € 2,120 |
| S-pure-humanoid | € 2.877.837 | € 2.051.609 | € 2,407 |
| S-hybrid-amr | € 3.841.113 | € 2.311.609 | € 3,244 |
| S-hybrid-5050 | € 5.251.641 | € 2.051.609 | € 4,411 |

Die Breakeven-Suche variierte die Investitionskosten humanoider Roboter von € 10.000 bis € 500.000 je Einheit und fand keinen Preis, bei dem eine rein humanoide Flotte die Kosten je Auftrag der schlanken Hybridvariante bei 120 Aufträgen pro Stunde erreicht. Selbst nahezu kostenlose humanoide Roboter unterliegen; die Investitionskosten sind also nicht der begrenzende Faktor.

Für die schlanke Hybridvariante liegt der Mittelwert der Monte-Carlo-Kosten bei € 461.414, die Standardabweichung bei € 43.755 und das 90-%-Intervall zwischen € 394.658 und € 537.549.

> [!quote] Ergebnis · 10.000 Ziehungen je Szenario
> Die schlanke Hybridvariante gewinnt 99,8 % der ausgewerteten Ziehungen.

## Grenzen

Die Rangfolge gilt nur unter den genannten Annahmen. Was diese Arbeit nicht belegt:

- **Leistung im Lager.** Demonstrationen aus dem Haushalt bleiben eine Näherung für Lageraufgaben.
- **Standortbezogener Beschaffungsfall.** Es gibt keine im Lager gemessenen Taktzeiten und keine unterzeichneten Angebote für humanoide Roboter.
- **Lokale Preise.** Öffentliche Listenpreise und geschätzte KV-Löhne können die Kosten in beide Richtungen verschieben.
- **Unabhängige Reproduktion.** Das hinterlegte Reproduktionsprotokoll wurde von einem Agenten erstellt, nicht von Dritten, die das Repository ohne Vorwissen klonen.

> [!warning] Eine Annahme benachteiligt die Roboter
> Das Modell setzt voraus, dass Arbeitskräfte zu KV-Löhnen verfügbar sind. In der österreichischen Intralogistik treiben vor allem unbesetzte Stellen die Automatisierung, nicht die Lohnarbitrage (das Ausnutzen von Lohnunterschieden); der Wert der Roboter ist daher überall dort unterschätzt, wo Stellen offen bleiben.

## Entscheidung

Unter diesen Annahmen: die schlanke Hybridvariante jetzt einsetzen und die Beschaffung humanoider Roboter zurückstellen. Die Investitionskosten sind nicht der begrenzende Faktor; ein niedrigerer Preis humanoider Roboter allein ändert die Entscheidung daher nicht.

> [!faq]- Wann lohnt sich eine erneute Prüfung?
> Wenn die Nachfrage wächst, Arbeitskräfte knapp werden oder auf Mehrschichtbetrieb umgestellt wird. Bei der modellierten Nachfrage wird kein Preis humanoider Roboter im durchsuchten Bereich kostengleich.

Das Repository enthält den Code, die Grafiken, die Management-Zusammenfassungen und die Governance-Dokumentation.

> [!bookmark] Weiter
> [01-05 Risikoanalyse für die Energiebeschaffung](/de/work/energy-procurement-risk-analyzer/) — Von Strompreisdaten zu einer Kosten-Risiko-Entscheidung. Im Aufbau.

> [!cta] Handlungsaufforderung
> [Repository öffnen](https://github.com/RafaelBraga-Kribitz/warehouse_humanoid_tco)

[^1]: Die Entwicklung folgt einem Governance-Protokoll, das in der Continuous Integration (CI, automatisierte Prüfung bei jeder Änderung) durchgesetzt wird: Jede Änderung schließt einen nachverfolgten Befund mit einem benannten Prüfskript ab, und die CI führt bei jedem Pull-Request das Skript jedes abgeschlossenen Befunds erneut aus.
