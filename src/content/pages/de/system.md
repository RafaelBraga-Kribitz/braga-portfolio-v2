---
title: Musterseite
slug: system
lang: de
summary: "Jedes Element, das die Inhaltspipeline versteht, einmal gezeigt, mit dem Fall „TCO humanoider Roboter im Lager“ als Beispiel. Nicht indexiert."
lead: "Jedes Element, das die Inhaltspipeline versteht, einmal und in der Reihenfolge des Autorenleitfadens, unter seinem Namen und seiner Markdown-Syntax. Den Inhalt liefert der Fall „TCO humanoider Roboter im Lager“."
draft: false
translationStatus: draft
---

## Überschriften und Text

### Unterabschnitt · `###`

Der Titel der Seite ist ihre einzige `h1` und kommt aus dem Frontmatter; der Text beginnt daher bei `##`. Das Stylesheet zeichnet die Nummer jedes Abschnitts aus der Reihenfolge der `##`-Überschriften; `###` eröffnet einen Unterabschnitt und wird nie nummeriert.

### Typografie · `„ “ ‚ ‘ – − …`

Satzzeichen werden getippt, nie umgewandelt. Anführungszeichen sind „doppelt“ und ‚einfach‘. Der Gedankenstrich ist ein Halbgeviertstrich mit Leerzeichen – wie hier –, ein Bereich nimmt ihn ohne Leerzeichen: ein Übertragungsfaktor von 0,50–0,90. Ein negativer Wert erhält das echte Minuszeichen: Gegenüber reinem Personal ändern sich die Kosten der schlanken Hybridvariante um −30 %. Eine Auslassung ist ein einziges Zeichen (…). Ein geschütztes Leerzeichen hält ein Datum zusammen: Der Fall wurde am 21. Mai 2026 veröffentlicht und am 16. Sep. 2026 aktualisiert.

### Links · `[Text](/de/…/)`

Ein Link innerhalb der Website ist wurzelrelativ: Der vollständige Fall steht unter [TCO humanoider Roboter im Lager](/de/work/warehouse-humanoid-tco/). Ein Link nach außen ist eine vollständige URL: [das Repository](https://github.com/RafaelBraga-Kribitz/warehouse_humanoid_tco).

### Hervorgehobene Zahl · `==…==`

Die schlanke Hybridvariante, eine Person mit drei autonomen mobilen Robotern (AMR), hat einen Kostenbarwert über fünf Jahre von ==€ 453.000==, 30 % weniger als reines Personal.

### Nummerierte Liste · `1.`

Vier Schritte, jeder aus dem Repository reproduzierbar:

1. Annahmen zu Leistungsfähigkeit und Taktzeiten aus den Episoden ableiten.
2. Sieben Besetzungsszenarien ereignisdiskret simulieren, die Auslastung auf 0,85 begrenzt.
3. Die Unsicherheit mit 10.000 Ziehungen je Szenario durchrechnen.
4. Eine Sobol-Sensitivitätsanalyse durchführen und den Investitionspreis suchen, bei dem die Kosten gleichziehen (Breakeven).

### Aufzählung · `-`

Die Grenzen des Modells:

- Haushaltsaufgaben sind eine unvollkommene Näherung für den Lagerbetrieb.
- Öffentliche Annahmen zu Investitionskosten sind keine verbindlichen Lieferantenangebote.
- Löhne nach Kollektivvertrag können die tatsächlichen lokalen Kosten unterschätzen.

## Callouts

Callouts (hervorgehobene Hinweisblöcke) folgen der Syntax von Obsidian: ein Zitatblock, dessen erste Zeile `[!type] Titel` lautet. Der Titel ist optional; ohne ihn steht der Name des Typs.

### Zitat · `>`

Ein Zitatblock ohne Markierung bleibt ein Zitat. Der Autorenleitfaden über die Reihenfolge eines Dokuments, übersetzt:

> Jedes Projekt und jeder Essay folgt einer Richtung: Frage → Daten → Methode → Ergebnis → Grenzen → Entscheidung.

### Breit · `[!note|wide]`

> [!note|wide] Daten
> Die Annahmen zur Leistungsfähigkeit stützen sich auf 2.359 Episoden aus fünf öffentlichen UnifoLM-Datensätzen, per Hash fixiert. Demonstrationen aus dem Haushalt stehen für Lagerarbeit, mit einem Übertragungsfaktor für die Geschwindigkeit zwischen 0,50 und 0,90.

### Geöffnet · `[!faq]+`

> [!faq]+ Was ist die Vergleichsgröße?
> Der Kostenbarwert über fünf Jahre bei einem Kalkulationszinssatz von 8 %.

### Verschachtelt · `> > [!aside]`

> [!note] Unsicherheit
> Die Unsicherheit wird mit 10.000 Monte-Carlo-Ziehungen je Szenario durchgerechnet.
>
> > [!aside] Randbemerkung
> > Die schlanke Hybridvariante gewinnt 99,8 % davon.

### Notiz · `[!note]`

> [!note] Szenarien
> Diese Seite zeigt vier der sieben Szenarien; der Fall führt alle sieben auf.

### Randbemerkung · `[!aside]`

> [!aside] Randbemerkung
> Es handelt sich nicht um Messungen einer im Lager eingesetzten Flotte. Die Näherung ist die erste Grenze in der Aufzählung oben.

### Warnung · `[!warning]`

> [!warning] Vor der Entscheidung
> Die Rangfolge gilt nur unter den genannten Annahmen.

### Werkzeug · `[!tool]`

> [!tool] 04-02 · A/B-Stichprobengröße · interaktiv
> Die Regler brauchen JavaScript. Ohne JavaScript gilt das Standardszenario: Bei einer Basisrate von 4 %, einem relativen Lift (Steigerung der Konversionsrate) von 10 % und einer Power (Teststärke) von 80 % braucht der Test **39.473** Besucher pro Arm – 40 Tage bei 2.000 Besuchern pro Tag. Eine Demonstration des Vokabulars; das Werkzeug selbst ist [04-02 A/B-Stichprobengröße](/de/tools/ab-sample-size/).

### Zusammenfassung · `[!summary]`

> [!summary] Zusammenfassung
> Eine Person mit drei autonomen mobilen Robotern hat den niedrigsten Kostenbarwert über fünf Jahre, € 453.000, und gewinnt 99,8 % der ausgewerteten Ziehungen. Humanoide Roboter werden zurückgestellt, bis sich Nachfrage, Arbeitskräfteangebot oder Schichtmodell ändern.

### Definition · `[!definition]`

> [!definition] Kostenbarwert
> Künftige Zahlungen, mit dem angegebenen Zinssatz auf heute abgezinst, sodass Kosten aus verschiedenen Jahren addiert werden können. Hier 8 % pro Jahr über fünf Jahre.

### Hervorgehobenes Zitat · `[!quote]`

> [!quote] Ergebnis · 10.000 Ziehungen je Szenario
> Die schlanke Hybridvariante gewinnt 99,8 % der ausgewerteten Ziehungen.

### Spezifikation · `[!spec]`

> [!spec] Modelleingaben
> - Episoden — 2.359 · fünf öffentliche Datensätze
> - Szenarien — 7 · je 15 Replikationen
> - Durchsatz — 120 Aufträge pro Stunde · Auslastung höchstens 0,85
> - Unsicherheit — 10.000 Monte-Carlo-Ziehungen je Szenario
> - Zinssatz — 8 % pro Jahr über fünf Jahre

### Metriken · `[!metrics]`

> [!metrics] Kennzahlen
> - ==€ 453.000== — Niedrigster Kostenbarwert über fünf Jahre
> - € 0,374 — Kosten je Auftrag
> - 99,8 % — Ziehungen zugunsten der Hybridvariante

### Frage · `[!faq]-`

> [!faq]- Was würde die Entscheidung umkehren?
> Höhere Nachfrage, Arbeitskräftemangel oder Mehrschichtbetrieb. Jeder dieser Faktoren verschiebt den Investitionspreis, bei dem die Kosten gleichziehen; das Modell wird neu gerechnet, sobald sich einer davon ändert.

### Lesezeichen · `[!bookmark]`

> [!bookmark] Weiter
> [01-05 Risikoanalyse für die Energiebeschaffung](/de/work/energy-procurement-risk-analyzer/) — Von Strompreisdaten zu einer Kosten-Risiko-Entscheidung. Im Aufbau.

### Handlungsaufforderung · `[!cta]`

> [!cta] Handlungsaufforderung
> [Repository öffnen](https://github.com/RafaelBraga-Kribitz/warehouse_humanoid_tco)

## Belegabbildungen

Die Belegabbildung aus Muster 05 der Website: eine Dachzeile, der Befund als Überschrift, dunkle Balken auf einer grauen Grundlinie und eine Bildunterschrift mit der Quelle. Sie wird als `[!bars]`-Callout geschrieben und nimmt die breite Spalte ein.

### Balken · `[!bars]`

> [!bars] Abb. 1 · Kostenbarwert über fünf Jahre nach Szenario
> Die schlanke Hybridvariante kostet 30 % weniger als reines Personal und weniger als ein Fünftel des besten Humanoid-Falls.
> - Hybridvariante — 453
> - Nur Personal — 647
> - Bester Fall — 2533
> - Nur Humanoide — 2878
>
> accent: Hybridvariante
> caption: Barwert bei 8 %, in Tausend Euro; Skala 0 bis € 2.878.000. n = 4 von 7 Szenarien. Hybridvariante: eine Person mit drei AMR; Bester Fall: der beste Humanoid-Fall.
> source: bereitgestelltes Projektinventar, 16. Sep. 2026.

### Zentrierte Balken · `centre: yes`

> [!bars] Abb. 2 · Gegenüber reinem Personalbetrieb
> Die schlanke Hybridvariante kostet 30 % weniger als reines Personal.
> - Nur Personal — 0
> - Hybridvariante — −30
>
> scale: −50–50 · unit: % · centre: yes
> caption: Veränderung des Kostenbarwerts über fünf Jahre gegenüber reinem Personalbetrieb, der Nulllinie; Skala −50 % bis +50 %. Zwei der sieben Szenarien.
> source: bereitgestelltes Projektinventar, 16. Sep. 2026.

## Tabellen

### Tabelle · `|--:|`

| Szenario | Kostenbarwert über fünf Jahre | Relativ zum Sieger |
|:--|--:|--:|
| Eine Person + drei AMR | € 453.000 | 1,00× |
| Reiner Personalbetrieb | € 647.000 | 1,43× |
| Bester Humanoid-Fall | € 2.533.000 | 5,59× |
| Rein humanoider Betrieb | € 2.878.000 | 6,35× |

## Mathematik

### Formel im Text · `$…$`

Die Kosten jedes Jahres werden mit dem Zinssatz $r = 0{,}08$ auf das Jahr 0 abgezinst, sodass Kosten aus verschiedenen Jahren addiert werden können.

### Abgesetzte Formel · `$$…$$`

Der Kostenbarwert ist die Summe der abgezinsten Jahreskosten; $t$ zählt die Jahre ab 0:

$$
\text{Kostenbarwert} = \sum_{t} \frac{c_t}{(1 + r)^{t}}
$$

## Code

### Codeblock · `` ```python ``

Dieselbe Summe in Python:

```python
def present_cost(cash_flows, rate=0.08):
    """Sum of yearly costs discounted to year 0 (listing for the specimen)."""
    return sum(c / (1 + rate) ** t for t, c in enumerate(cash_flows))
```

### Code im Text · `` `…` ``

Code im Fließtext behält die helle Hinterlegung: `present_cost(cash_flows, rate=0.08)`.

## Fußnoten

### Fußnote · `[^1]`

Unter diesen Annahmen: die schlanke Hybridvariante einsetzen und humanoide Roboter zurückstellen.[^1]

[^1]: Für die Arbeitskosten wurden Löhne nach österreichischem Kollektivvertrag angesetzt; lokale Löhne können höher liegen.
