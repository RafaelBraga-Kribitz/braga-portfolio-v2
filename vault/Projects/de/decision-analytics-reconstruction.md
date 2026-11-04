---
code: "01-04"
kind: case
date: "2026-05-07"
summary: Eine Rekonstruktion in drei Modulen. Allokationsgewinne sind Näherungswerte, keine Kampagneneffekte.
lead: "Die Präsidentschaftswahl 2018 in Paraguay, rekonstruiert als drei verbundene Entscheidungsmodule (Wählersegmentierung, Budgetallokation und Umfrage-Tracking) aus dem, was eine Kampagne Anfang 2018 sehen konnte."
domain: Entscheidungsanalytik
tags: [ status/complete, wahlkampagnen, segmentierung, optimierung, bayessches-tracking ]
lang: de
slug: decision-analytics-reconstruction
metrics:
  - { value: "+54,77 %", label: "Proxy-Kontakte gegenüber Gleichverteilung, synthetische Reichweite, ungefähr", accent: true }
  - { value: "3 von 6", label: "Zurückgehaltene Umfragen im Band zu 95 %" }
  - { value: "50.000", label: "Synthetische Wahlberechtigte, 14 Wochen" }
stack: [ "Python", "PyMC", "Bayesian", "Optimisation", "scikit-learn", "FastAPI", "Streamlit", "MLflow", "Docker", "GCP", "CI/CD" ]
repository: https://github.com/RafaelBraga-Kribitz/decision-analytics-reconstruction
translationStatus: approved
publish: true
---

# Rekonstruktion von Entscheidungs­analysen

## Frage: Wie kann eine Kampagne mit nur öffentlichen Umfragen, Zensusdaten und einem festen Budget ein landesweites Rennen verfolgen und entscheiden, wo sie Geld einsetzt?

> [!summary] Zusammenfassung
> Drei Module laufen durchgängig auf 50.000 synthetischen Wahlberechtigten, angepasst an verifizierte Eckdaten der Departamentos (Verwaltungsbezirke). Bei einem Budgetrahmen von 6 Mio. USD erzielt der Allokator rund 54,77 % mehr linearisierte Proxy-Kontakte als eine über die Departamentos gleichmäßige Verteilung. Dieser Gewinn ist ein Solver-Vergleich auf synthetischer Reichweite, die Tracking-Kurve ist eine Retrodiktion, und nichts hier behauptet, dass Analytik den amtlichen Vorsprung verursacht hat.

## Hintergrund

Diese Rekonstruktion der Präsidentschaftswahl 2018 in Paraguay nutzt, was eine Kampagne Anfang 2018 sehen konnte: acht öffentliche Umfragen und aggregierte Zensusdaten. Sie prüft, wie ehrlich eine Kampagne ausweisen kann, was sie weiß, und vergleicht Proxy-Kontakte mit einer Gleichverteilung und den Tracker mit zurückgehaltenen Umfragen.

> [!spec] Amtliches Ergebnis 2018
> - Mario Abdo Benítez — 1.206.067 Stimmen
> - Efraín Alegre — 1.110.464 Stimmen
> - Vorsprung — 95.603 Stimmen
> - Anteil der gültigen Kandidatenstimmen — 3,88 Prozentpunkte von 2.463.441
> - Anteil aller abgegebenen Stimmen — 3,68 Prozentpunkte von 2.597.989
> - Wahlbeteiligung — 61,25 %, TSJE
> - Quelle — [amtliches statistisches Jahrbuch, Tabelle 5.3.1](https://informacionpublica.paraguay.gov.py/public/7234448-AnuarioEstadistico2018pdf-AnuarioEstadistico2018.pdf)

> [!note] Modellanker
> Serie A des Repositorys verwendet +3,70 Prozentpunkte (46,43 % gegenüber 42,73 %). Diese Konvention ist bei keinem der beiden Nenner der exakte Prozentsatz der Endauszählung. Diese redaktionelle Korrektur passt das Rekonstruktionsmodell nicht neu an.

## Daten

Die öffentlichen Eckdaten sind verifiziert, und alle einzelnen Wählerinnen und Wähler sind synthetisch. So ist keine reale Person abgebildet, die Aggregate stimmen aber weiterhin.

> [!spec] Eingaben
> - Öffentliche Eckdaten — Endergebnisse des TSJE · Zensusaggregate der DGEEC · Haushaltserhebung 2018 des INE zur Nutzung von Internet und WhatsApp · acht veröffentlichte Tracking-Umfragen
> - Wählerdatensatz — 50.000 synthetische Einträge, per Raking (iterative Gewichtung an vorgegebene Randverteilungen) angepasst an Wahlbeteiligung, Geschlecht, ländlichen Anteil und Sprache je Departamento
> - Zeitfenster — 14 Wochen · Seed 42 (Startwert des Zufallsgenerators)
> - Modul A — der synthetische Wählerdatensatz · eine Holdout-Stichprobe (zurückgehaltene Testmenge) von 15.000 Wahlberechtigten
> - Modul B — 2.772 Zeilen: 18 Departamentos × 11 Kanäle × 14 Wochen · ein Budgetrahmen von 6 Mio. USD
> - Modul C — die acht veröffentlichten Umfragen · das verifizierte Ergebnis

Jedes Artefakt trägt ein epistemisches Etikett (verifiziert, kalibriert, simuliert oder illustrativ). Das Repository enthält das Register der Etiketten, und das Etikett wandert mit der Zahl.

## Methode

Jede zentrale Zahl steht in einer einzigen numerischen Referenztabelle (Source of Truth), die die kontinuierliche Integration prüft. Die Pipeline erzwingt die Übergabe der Allokation zwischen den Modulen.

> [!figure] Abb. 01-04-1 · Drei Module, eine Pipeline
> Drei Module laufen nacheinander, und jedes endet in einer eigenen Prüfung.
> ![[01-04-module-flow.de.svg]]
>
> caption: Modul A liest den Wählerdatensatz, Modul B seine 2.772 Zeilen und den Budgetrahmen von 6 Mio. USD, Modul C die acht Umfragen und das verifizierte Ergebnis. Die Pipeline erzwingt die Übergabe der Allokation.
> source: Projekt-Repository, Pipeline und Prüfungen wie unter Daten aufgeführt.

| Modul | Methode | Belegbar | Nicht belegbar |
|:--|:--|:--|:--|
| A | K-Means mit sechs Segmenten, dazu eine nach Platt kalibrierte Wahlbeteiligungsneigung (Propensity). Schwellen: Silhouettenkoeffizient und Bootstrap-ARI (Adjusted Rand Index über Bootstrap-Stichproben). Brier-Score (mittlerer quadratischer Fehler der vorhergesagten Wahrscheinlichkeiten) auf einer Holdout-Stichprobe von 15.000 Wahlberechtigten. | Sechs Segmente, die beide Schwellen bestehen. Eine kalibrierte Neigung, bewertet an 15.000 zurückgehaltenen synthetischen Wahlberechtigten. | Dass das Modell generalisiert. |
| B | Gemischt-ganzzahliges lineares Programm (MILP, Mixed-Integer Linear Program) in PuLP, gelöst mit CBC, über 2.772 Zeilen. Budget, Reichweitenobergrenzen, eine Wechselkursebene und eine Mindestabdeckung von 80 %. Es maximiert einen linearisierten Persuasion-Proxy (eine Ersatzgröße für Überzeugungswirkung) und läuft über FastAPI. | Ein Solver-Vergleich (ein Vergleich von Ergebnissen des Optimierers) auf synthetischer Reichweite: Kontakte einer Allokation gegenüber einer anderen. | Ein historischer Effekt der Kampagne von 2018. |
| C | Gauß’scher Random Walk (Zufallspfad) mit House Effects (der systematischen Abweichung einzelner Umfrageinstitute), in PyMC an acht Umfragen angepasst. Stratifizierte Monte-Carlo-Szenarien, standardmäßig 10.000 Ziehungen. | Eine Retrodiktion des Rennens durch die acht Umfragen. | Eine Prognose oder Prognosefähigkeit. |

Modul A erreicht zudem eine AUC (Fläche unter der ROC-Kurve) von rund 0,89. Das Projekt hebt sie bewusst nicht hervor. Die Merkmale der Neigung teilen Kalibrierungsanker mit der Zielgröße, daher misst die AUC, wie gut das Raking wiederhergestellt wurde, nicht die Generalisierung.

> [!definition] Retrodiktion
> Eine Anpassung, die auf das bekannte Ergebnis konditioniert. Die Tracking-Kurve ist eine solche: Sie konditioniert auf das verifizierte Ergebnis und kann daher nicht als Prognose gelesen werden.

## Ergebnis

| Modul | Maß | Wert | Schwelle oder Vergleichswert |
|:--|:--|--:|:--|
| A | Silhouettenkoeffizient | 0,2562 | Schwelle 0,22 |
| A | Bootstrap-ARI | 0,4304 | Schwelle 0,40 |
| A | Brier-Score, Wahlbeteiligungsneigung | 0,1185 | Holdout-Stichprobe, 15.000 Wahlberechtigte |
| B | Linearisierte Proxy-Kontakte | Rund +54,77 % | Gleichmäßige Verteilung über die Departamentos, Budgetrahmen 6 Mio. USD |
| C | Brier-Score, Vorzeichen des Vorsprungs | 0,31 | Zurückgehaltene Umfragen |
| C | Zurückgehaltene Umfragen im Intervall zu 80 % | 33,3 % | 6 zurückgehaltene Wellen |

Der Allokationswert ist ein Solver-Vergleich auf synthetischer Reichweite, kein historischer Effekt der Kampagne von 2018.

Die Neuanpassungen halten jede reale Umfragewelle zurück und schließen das Wahlergebnis nachweislich aus. Das ist die einzige echte Out-of-Sample-Prüfung (Prüfung an Daten, die nicht in die Anpassung eingehen), ungeschönt berichtet.

> [!figure] Abb. 01-04-2 · Zurückgehaltene Umfragen gegenüber dem Band zu 95 %
> Das Band zu 95 % erfasste 3 von 6 zurückgehaltenen Umfragen. Ein kalibriertes Band würde etwa 6 erfassen.
> ![[01-04-wave-intervals.de.svg]]
>
> caption: Beobachteter Abstand jeder realen Umfragewelle in Prozentpunkten, gegenüber dem Band zu 95 % einer Neuanpassung. Diese Neuanpassung hält die Welle zurück und schließt das Wahlergebnis aus. n = 6 Wellen. Verfehlungen sind in der Akzentfarbe gezeichnet. Acht Wellen ergeben 6 Holdouts bei `min_train_size=2`, und sechs Wellen sind wenig. Der eingecheckte Bericht entstand mit `MC_FAST=1` und empfiehlt einen Neulauf ohne diese Option für Stichproben in Veröffentlichungsqualität. Das ist nicht erfolgt.
> source: Projekt-Repository, reports/module_c/walk_forward_loo_report.md.

Acht Umfragen sind bei Weitem zu wenige, um Prognosefähigkeit zu beanspruchen, und das Projekt beansprucht sie nicht.

## Grenzen

- **Manuell gesetzte Eingaben.** Das [Datenregister des Repositorys](https://github.com/RafaelBraga-Kribitz/decision-analytics-reconstruction/blob/6a5d2cef1216f43572d073e8abfab57329daff85/README.md) kennzeichnet Wechselkurs, Wechselkursspanne, Kanalkosten je Einheit und Bevölkerungszahlen der Departamentos als manuell gesetzte, noch nicht verifizierte Eingaben. Der Gewinn von Modul B ist ein Solver-Vergleich unter diesen Annahmen.
- **Kausaler Effekt.** Ein Vergleich mit und ohne Analytik lässt sich hier nicht verifizieren.
- **Individuelles Verhalten.** Die aggregierte Kalibrierung synthetischer Wahlberechtigter bedeutet nicht, dass reales Verhalten wiederhergestellt wurde.
- **Kampagnenökonomie.** Modul B optimiert linearisierte Kontakte, nicht die geprüfte Buchhaltung der Kampagne 2018 oder angepasste Wirkungskurven (Response Curves).
- **Voller Maßstab.** Die Pipeline rechnet mit 50.000 Wahlberechtigten über 14 Wochen. Das vollständige Wählerverzeichnis mit 4,26 Mio. Personen ist eine Designreferenz.
- **Produktiver Einsatz.** Dies ist eine Portfolio-Rekonstruktion, kein produktives Kampagnensystem.

## Entscheidung

Jedes Modul wird nur so weit berichtet, wie seine eigene Prüfung reicht. Das öffentliche Ergebnis ist der Anker, und zu zeigen, was das Modell stützen kann und was nicht, ist der Zweck der Arbeit.

## Entstehung

```buildlog
```
