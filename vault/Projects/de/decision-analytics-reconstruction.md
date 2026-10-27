---
code: "01-02"
kind: case
date: "2026-05-07"
summary: Eine Rekonstruktion in drei Modulen. Allokationsgewinne sind Näherungswerte, keine Kampagneneffekte.
lead: "Die Präsidentschaftswahl 2018 in Paraguay, rekonstruiert als drei verbundene Entscheidungsmodule (Wählersegmentierung, Budgetallokation und Umfrage-Tracking) aus dem, was eine Kampagne Anfang 2018 sehen konnte."
domain: Entscheidungsanalytik
tags: [ status/functional, wahlkampagnen, segmentierung, optimierung, bayessches-tracking ]
lang: de
slug: decision-analytics-reconstruction
metrics:
  - { value: "+3,70 PP", label: "Verifizierter Vorsprung, TSJE", accent: true }
  - { value: "61,25 %", label: "Wahlbeteiligung, TSJE" }
  - { value: "50.000", label: "Synthetische Wahlberechtigte, 14 Wochen" }
repository: https://github.com/RafaelBraga-Kribitz/decision-analytics-reconstruction
translationStatus: draft
publish: true
---

# Rekonstruktion von Entscheidungs­analysen

> [!summary] Zusammenfassung
> Drei verbundene Module laufen durchgängig auf 50.000 synthetischen Wahlberechtigten, die an die verifizierten Eckdaten der Departamentos angepasst sind: Bei einem Budgetrahmen von 6 Mio. USD erzielt der Allokator rund 54,77 % mehr linearisierte Proxy-Kontakte als eine über die Departamentos gleichmäßige Verteilung, und das Unsicherheitsband des Trackers zu 95 % erfasste die zurückgehaltene Umfrage in 3 von 6 getesteten Wellen. Jedes Modul wird nur so weit berichtet, wie seine eigene Prüfung reicht: Der Gewinn gilt als Solver-Vergleich auf synthetischer Reichweite, die Tracking-Kurve als Retrodiktion, und nichts hier behauptet, dass Analytik den verifizierten Vorsprung von 3,70 Prozentpunkten verursacht hat.

## Fragestellung

Wie lässt sich mit nur acht öffentlichen Umfragen, aggregierten Zensusdaten und einem festen Budget ein landesweites Rennen verfolgen, Geld über das ganze Land verteilen und dabei ehrlich ausweisen, was tatsächlich bekannt ist? Die Rekonstruktion arbeitet mit dem, was eine Kampagne Anfang 2018 sehen konnte, und argumentiert auf ein öffentlich bekanntes Ergebnis hin: Laut den Endergebnissen des Wahlgerichts (TSJE) gewann Mario Abdo Benítez die Präsidentschaftswahl mit einem Vorsprung von 3,70 Prozentpunkten (46,43 % gegenüber 42,73 %) bei einer Wahlbeteiligung von 61,25 %. Die Vergleichseinheiten sind linearisierte Proxy-Kontakte bei festem Budget, gemessen an einer über die Departamentos (Verwaltungsbezirke) gleichmäßigen Verteilung, und für den Tracker zurückgehaltene Umfragewellen.

## Daten

Die öffentlichen Eckdaten sind verifiziert: die Wahlergebnisse des TSJE, aggregierte Zensusdaten der DGEEC, die Haushaltserhebung 2018 des INE zur Nutzung von Internet und WhatsApp sowie acht veröffentlichte Tracking-Umfragen. Alle einzelnen Wählerinnen und Wähler sind synthetisch. Ein Wählerdatensatz mit 50.000 Einträgen wird per Raking (iterative Gewichtung an vorgegebene Randverteilungen) an die verifizierten Eckdaten der Departamentos angepasst (Wahlbeteiligung, Geschlecht, ländlicher Anteil, Sprache), sodass keine reale Person abgebildet ist, die Aggregate aber weiterhin stimmen.

> [!spec] Eingaben
> - Öffentliche Eckdaten — Endergebnisse des TSJE · Zensusaggregate der DGEEC · Haushaltserhebung 2018 des INE · acht veröffentlichte Tracking-Umfragen
> - Wählerdatensatz — 50.000 synthetische Einträge, angepasst an Wahlbeteiligung, Geschlecht, ländlichen Anteil und Sprache je Departamento
> - Zeitfenster — 14 Wochen · Seed 42 (Startwert des Zufallsgenerators)
> - Modul A — der synthetische Wählerdatensatz · eine Holdout-Stichprobe von 15.000 Wahlberechtigten
> - Modul B — 2.772 Zeilen: 18 Departamentos × 11 Kanäle × 14 Wochen · ein Budgetrahmen von 6 Mio. USD
> - Modul C — die acht veröffentlichten Umfragen · das verifizierte Ergebnis

Jedes Artefakt trägt ein epistemisches Etikett (verifiziert, kalibriert, simuliert oder illustrativ), und das Register dieser Etiketten ist Teil des Repositorys. Das Etikett wandert mit der Zahl.

## Methode

Die drei Module laufen als eine Pipeline, von A über B zu C, mit einer erzwungenen Übergabe der Allokation zwischen ihnen:

1. **Modul A, Segmentierung und Wahlbeteiligung.** Die synthetischen Wahlberechtigten werden in Segmente gruppiert, und ihre Wahlbeteiligungsneigung wird geschätzt.
2. **Modul B, Allokation.** Ein gemischt-ganzzahliges lineares Programm verteilt das Budget auf Departamentos, Kanäle und Wochen.
3. **Modul C, Umfrage-Tracking.** An die acht Umfragen wird eine Tracking-Kurve angepasst, aus der anschließend Szenarien gerechnet werden.

Bei jedem Modul steht, was es belegen kann und was nicht.

### Modul A: Segmentierung und Wahlbeteiligung

K-Means mit sechs Segmenten auf der synthetischen Population, ergänzt um eine nach Platt kalibrierte Wahlbeteiligungsneigung (Propensity). Die Segmente müssen zwei Schwellen bestehen, den Silhouettenkoeffizienten und den Bootstrap-ARI (Adjusted Rand Index über Bootstrap-Stichproben); die Neigung wird über ihren Brier-Score (den mittleren quadratischen Fehler der vorhergesagten Wahrscheinlichkeiten) auf einer Holdout-Stichprobe (zurückgehaltenen Testmenge) von 15.000 Wahlberechtigten bewertet.

- **Belegbar.** Sechs Segmente, die beide Schwellen bestehen, und eine nach Platt kalibrierte Wahlbeteiligungsneigung, bewertet an 15.000 zurückgehaltenen synthetischen Wahlberechtigten.
- **Nicht belegbar.** Dass das Modell generalisiert. Es erreicht zudem eine AUC (Fläche unter der ROC-Kurve) von rund 0,89, die bewusst nicht hervorgehoben wird: Die Merkmale der Neigung teilen Kalibrierungsanker mit der Zielgröße, daher misst die AUC, wie gut das Raking wiederhergestellt wurde, nicht, wie gut das Modell generalisiert.

### Modul B: Allokation

Ein gemischt-ganzzahliges lineares Programm (MILP, Mixed-Integer Linear Program), formuliert in PuLP und gelöst mit CBC, über 2.772 Zeilen: 18 Departamentos × 11 Kanäle × 14 Wochen. Es rechnet unter einem Budget, Reichweitenobergrenzen, einer Wechselkursebene und einer Mindestabdeckung von 80 %, maximiert einen linearisierten Persuasion-Proxy (eine Ersatzgröße für Überzeugungswirkung) und wird über eine FastAPI-Anwendung bereitgestellt.

- **Belegbar.** Ein Solver-Vergleich (ein Vergleich von Ergebnissen des Optimierers) auf synthetischer Reichweite: wie viele linearisierte Proxy-Kontakte eine Allokation gegenüber einer anderen erzeugt.
- **Nicht belegbar.** Ein historischer Effekt der Kampagne von 2018.

### Modul C: Umfrage-Tracking

Ein Gauß’scher Random Walk (Zufallspfad) mit House Effects (der systematischen Abweichung einzelner Umfrageinstitute), in PyMC an die acht Umfragen angepasst, danach stratifizierte Monte-Carlo-Szenarien mit standardmäßig 10.000 Ziehungen.

> [!definition] Retrodiktion
> Eine Anpassung, die auf das bekannte Ergebnis konditioniert. Die Tracking-Kurve ist eine solche: Sie konditioniert auf das verifizierte Ergebnis und kann daher nicht als Prognose gelesen werden.

- **Belegbar.** Eine Retrodiktion des Rennens durch die acht Umfragen.
- **Nicht belegbar.** Eine Prognose oder Prognosefähigkeit.

## Ergebnis

Jede zentrale Zahl steht in einer einzigen numerischen Referenztabelle (Source of Truth), die die kontinuierliche Integration (CI) prüft. Die Ergebnisse folgen Modul für Modul.

### Segmentierung

Beide Schwellen werden bestanden, und die Wahlbeteiligungsneigung erreicht auf der Holdout-Stichprobe von 15.000 Wahlberechtigten einen Brier-Score von 0,1185.

| Maß | Wert | Schwelle |
|:--|--:|--:|
| Silhouettenkoeffizient | 0,2562 | 0,22 |
| Bootstrap-ARI | 0,4304 | 0,40 |

### Allokation

Bei einem Budgetrahmen von 6 Mio. USD erzeugt das MILP rund 54,77 % mehr linearisierte Proxy-Kontakte als eine über die Departamentos gleichmäßige Verteilung. Das ist ein Solver-Vergleich auf synthetischer Reichweite, kein historischer Effekt der Kampagne von 2018.

### Tracking

Die einzige echte Out-of-Sample-Prüfung (Prüfung an Daten, die nicht in die Anpassung eingehen) wird ungeschönt berichtet. Wird der Tracker mit jeweils einer zurückgehaltenen realen Umfragewelle neu angepasst und das Wahlergebnis nachweislich ausgeschlossen, erfasste das Band zu 95 % die zurückgehaltene Umfrage in 3 von 6 getesteten Wellen, bei einem Brier-Score von 0,31 für das Vorzeichen des Vorsprungs.

> [!bars] Abb. 01-02-1 · Out-of-Sample-Prüfung
> Das Band zu 95 % erfasste die zurückgehaltene Umfrage in 3 von 6 Wellen.
> - Getestet — 6
> - Erfasst — 3
>
> scale: 0–6
> caption: Anzahl realer Umfragewellen auf einer Skala von 0–6, jede Welle einzeln zurückgehalten, bei ausgeschlossenem Wahlergebnis; n = 6 getestete Wellen.
> source: Neuanpassungen von Modul C, Projekt-Repository.

Acht Umfragen sind bei Weitem zu wenige, um Prognosefähigkeit zu beanspruchen, und das Projekt beansprucht sie nicht.

> [!quote] Ergebnis · Solver-Vergleich in Modul B, Neuanpassungen in Modul C
> Die drei Module laufen durchgängig; der Allokationsgewinn von rund 54,77 % ist ein Solver-Vergleich auf synthetischer Reichweite, und das Band des Trackers zu 95 % erfasste die zurückgehaltene Umfrage in 3 von 6 getesteten Wellen.

## Grenzen

Was diese Arbeit nicht belegt:

- **Kausaler Effekt.** Ein Vergleich mit und ohne Analytik lässt sich hier nicht verifizieren.
- **Individuelles Verhalten.** Die aggregierte Kalibrierung synthetischer Wahlberechtigter bedeutet nicht, dass reales Verhalten wiederhergestellt wurde.
- **Kampagnenökonomie.** Modul B optimiert linearisierte Kontakte, nicht die geprüfte Buchhaltung der Kampagne 2018 oder angepasste Wirkungskurven (Response Curves).
- **Voller Maßstab.** Die Pipeline rechnet mit 50.000 Wahlberechtigten über 14 Wochen; das vollständige Wählerverzeichnis mit 4,26 Mio. Personen ist eine Designreferenz.

## Entscheidung

Jedes Modul wird nur so weit berichtet, wie seine eigene Prüfung reicht: die Segmente als Anpassung an synthetische Wahlberechtigte, der Allokationsgewinn als Solver-Vergleich auf synthetischer Reichweite und die Tracking-Kurve als Retrodiktion. Die Rekonstruktion behauptet nicht, dass Analytik den Vorsprung von 3,70 Prozentpunkten verursacht hat. Das öffentliche Ergebnis ist der Anker; zu zeigen, was das Modell stützen kann und was nicht, ist der Zweck der Arbeit.

Funktionsfähig: Die drei Module laufen durchgängig. Es ist eine Portfolio-Rekonstruktion, kein produktives Kampagnensystem. Das Repository enthält den Code, die Fallstudie und die Validierungsprüfungen (Gates).

## Entstehung

```buildlog
```
