---
code: "01-01"
kind: case
date: "2026-09-16"
summary: "Das Projekt nutzt fünf öffentliche Jobbörsen und eine getestete Python-Pipeline. Es führt Dubletten zusammen und prüft die Titelregeln an 177 händisch klassifizierten Titeln. Jede Zahl ist bis zur Quelle nachvollziehbar."
lead: "Das Projekt liefert eine Evidenzbasis für Berufsentscheidungen im Datenbereich in Österreich, mit Schwerpunkt Steiermark und Graz. Sie stützt sich auf eine eintägige Momentaufnahme von 720 Kerninseraten für Datenrollen aus fünf öffentlichen Quellen. Dazu kommen das AMS JobBarometer 2020–2025 und die Saisonalität offener Stellen laut Eurostat."
domain: Arbeitsmarkt
tags: [ status/complete, arbeitsmarkt, datenpipeline, deskriptive-statistik ]
lang: de
slug: austria-data-job-market-intelligence
metrics:
  - { value: "720", label: Kerninserate, accent: true }
  - { value: "83 % / 95 %", label: "Titelpräzision, streng / großzügig" }
  - { value: "24 %", label: Dublettenquote }
stack: [ "Python", "Power BI", "DAX", "pandas", "scikit-learn", "Clustering", "CI/CD" ]
repository: https://github.com/RafaelBraga-Kribitz/austria-data-job-market-intelligence
translationStatus: approved
publish: true
---
# Arbeitsmarkt für Datenberufe in Österreich

## Frage: Welche Datenjobs werden in Österreich ausgeschrieben, wo, und was verlangen sie?

> [!summary] Zusammenfassung
> In der eintägigen Momentaufnahme von 720 Kerninseraten für Datenrollen nennen die Inserate SQL am häufigsten. Unter den genannten Anbietern neigen die Inserate zu Microsoft. Seit 2022 ging die Zahl in der AMS-Berufsgruppe „Data Scientist“ in der Steiermark um 29 % zurück, in Österreich um 56 %. Die Rohdatensammlung bleibt ein privater Forschungsdatensatz.

> [!note] Stand der Daten
> Diese Seite beschreibt die Momentaufnahme vom 16. Sep. 2026. Das Repository ist inzwischen zur Momentaufnahme vom 18. Okt. 2026 gewechselt (Release 2026-10-19.1, 699 Kerninserate). Die README des Repositorys enthält die aktuellen Zahlen.

## Hintergrund

Das Projekt liest aus jedem Inserat Stellentitel, Ort, Technologien, Sprachen, Ausbildung, Gehalt und Arbeitsmodell und vergleicht die Steiermark mit Wien. Die Einheit ist das Kerninserat für eine Datenrolle in einer eintägigen Momentaufnahme. Das Projekt liest die amtlichen Reihen als eigene Einheiten. Ein technisch versiertes, skeptisches Publikum soll Methode, Datenherkunft, Grenzen und Schlussfolgerungen prüfen können.

## Daten

> [!spec] Momentaufnahme
> - Erhoben — 16. Sep. 2026, 17:00–18:40 UTC
> - Inseratquellen — EURES 202 · karriere.at 134 · LinkedIn (Stellenseiten ohne Anmeldung) 300 · willhaben 26 · jobs.at 58. Kerninserate nach maßgeblicher Quelle (Tabelle T01).
> - Zugang — Keine Anmeldung, keine Umgehung von CAPTCHA oder Paywall (Bezahlschranke)
> - Blockiert, ausgeschlossen — StepStone · Indeed · hokify · Glassdoor
> - Suche — 45 Titel-Suchbegriffe, Englisch und Deutsch
> - Aufnahme — Nach Stellentitel. Präzision 83 % (streng) und 95 % (großzügig), gemessen an 177 händisch klassifizierten Titeln
> - Amtliche Reihen — AMS JobBarometer 2020–2025, Online-Inserate nach Berufsgruppe und Bundesland · Eurostat, offene Stellen je Quartal

> [!figure] Abb. 01-01-1 · Von den Rohzeilen zu den Kerninseraten
> 12.429 Rohzeilen reduzieren sich auf 720 Kerninserate.
> ![[01-01-funnel.de.svg]]
>
> caption: Anzahl der Zeilen. Die Breite jedes Streifens ist proportional zur Anzahl. Der Untersuchungsrahmen umfasst Kerninserate, benachbarte Rollenfamilien und deren Dubletten. Die Dublettenquote von 24 % entspricht 404 der 1.670 Zeilen im Untersuchungsrahmen.
> source: Repository-Tabellen market_summary, dedupe_summary und Q04_duplicates, Commit 267b115. Momentaufnahme vom 16. Sep. 2026.

## Methode

| Schritt | Feld | Regel |
|:--|:--|:--|
| 1 | Titel | Geordnete Regex-Regeln (reguläre Ausdrücke) ordnen Stellentitel acht Rollenfamilien zu. |
| 2 | Region | Zuerst explizite Felder, dann NUTS-3-Codes, dann Postleitzahlen und Ortsnamen im Text. |
| 3 | Gehalt | Gelesen aus strukturierten Feldern oder aus Text in der Nähe von Gehaltsbegriffen. Umgerechnet auf ein Jahresgehalt mit 14 Monatsgehältern. |
| 4 | Sprache | Gelesen aus einem Fenster von 120 Zeichen beiderseits jeder Sprachnennung. |
| 5 | Dubletten | Union-Find gruppiert Inserate über Unternehmen, Titel, Bundesland und einen Fingerabdruck der Stellenbeschreibung. |

- Jeder Schritt ist ein Skript, und jede Regel steht in einer Konfigurationsdatei.
- Jede Tabelle speichert ihr n. Anteile, die in eine Entscheidung einfließen, tragen Wilson-Intervalle zu 95 %.
- Amtliche Reihen sind eigene Einheiten. Das Projekt vermischt sie nie mit Statistiken auf Inseratsebene.
- Eine Testsuite prüft das Verhalten der Regeln. Sie prüft auch, ob die Ausgaben konsistent sind.
- Ein Digest-Skript (Zusammenfassungsskript) erzeugt jede zitierte Zahl neu aus den Tabellen.

> [!definition] Textbasierter Anteil
> Ein Anteil, den das Projekt aus dem Inseratstext liest, etwa eine Sprachanforderung. Sein Nenner sind die Inserate mit einer Beschreibung von mehr als 300 Zeichen.

## Ergebnis

### Kompetenzen

> [!figure] Abb. 01-01-2 · Nennung von Kompetenzen mit Intervallen zu 95 %
> SQL führt mit 40 %, KI-Formulierungen und Datenvisualisierung folgen mit 38 %. Bei Cloud-Plattformen und BI-Werkzeugen führen Azure und Power BI.
> ![[01-01-skills-top.de.svg]]
>
> caption: Anteil der 719 Inserate mit einer Beschreibung von mehr als 300 Zeichen, die die Kompetenz nennen. Ein Inserat kann mehrere Kompetenzen nennen. Allgemeine Themen wie KI (allgemein) zählen so, wie die Taxonomie sie führt. Die Linien sind Wilson-Intervalle zu 95 %.
> source: Repository-Tabelle T05_skills_all_tech, Commit 267b115. Momentaufnahme vom 16. Sep. 2026.

> [!figure] Abb. 01-01-3 · Nennung von Kompetenzen nach Rollenfamilie
> Jede Rollenfamilie nennt ihre eigene Mischung: BI nennt Visualisierung am häufigsten (86 %), Data Science KI-Formulierungen (82 %), Data Engineering SQL (69 %).
> ![[01-01-skills-heatmap.de.svg]]
>
> caption: Basis: dieselben 719 Inserate, ohne das eine Inserat zu Product Analytics. Die Zeilen zeigen 11 der 115 Kompetenzen der Taxonomie, geordnet nach ihrem Anteil an allen Inseraten. „Governance/Qualität“ enthält Governance-Schlüsselwörter, daher ist der Wert von 82 % bei Data-Governance-Inseraten teils per Definition wahr. Der dunkelste Ton ist der Höchstwert, 86 %. Marketing-Analytics hat n = 24. Stärkere Ränder markieren die Zellen des Befunds.
> source: Repository-Tabelle T05_skills_all_tech_by_family, Commit 267b115. Momentaufnahme vom 16. Sep. 2026.

### Region

| Rollenfamilie | Wien | Steiermark | Übrige | Gesamt |
|:--|--:|--:|--:|--:|
| Data Engineering | 78 | 17 | 65 | 160 |
| Data Science | 80 | 13 | 65 | 158 |
| Business Analysis | 74 | 4 | 42 | 120 |
| Data Analytics | 41 | 11 | 55 | 107 |
| BI | 34 | 4 | 47 | 85 |
| Data Governance | 22 | 5 | 38 | 65 |
| Marketing- und Product-Analytics | 14 | 0 | 11 | 25 |
| Gesamt | 343 | 54 | 323 | 720 |

Die Zählung nutzt das primäre Bundesland. Die Steiermark hat daher hier 54 Inserate und nach Ort unten 58. „Übrige“ enthält 22 Inserate ohne angegebenes Bundesland. Steirische Zellen sind klein und vorläufig. Je 22 % der Kerninserate gehören zu Data Engineering und zu Data Science. Quelle: Repository-Tabelle T03_family_by_state, n = 720.

| Kennzahl | Anteil | Basis |
|:--|--:|:--|
| Wien, Momentaufnahme | 48 % | 345 von 720, Ortszählung |
| Steiermark, Momentaufnahme | 8,1 % | 58 von 720, Ortszählung |
| Steiermark, AMS-Berufsgruppe „Data Scientist“ | 13,6 % | 300 von 2.207, 2025. Die Gesamtzahl enthält Inserate ohne benanntes Bundesland |
| Steiermark, sieben AMS-Berufsgruppen für Daten zusammen | 10,9 % | 926 von 8.477, 2025 |

Das sind verschiedene Einheiten, und das Projekt vermischt sie nicht.

### AMS-Entwicklung

AMS-Berufsgruppe „Data Scientist“, Online-Inserate je Jahr. Burgenland ist in jedem Jahr unter 20 zensiert und zählt daher als kein benanntes Bundesland.

| Jahr | Österreich gesamt | Summe der benannten Bundesländer | Ohne benanntes Bundesland | Anteil ohne benanntes Bundesland | Steiermark |
|:--|--:|--:|--:|--:|--:|
| 2020 | 3.049 | 1.892 | 1.157 | 37,9 % | 224 |
| 2022 | 5.032 | 4.430 | 602 | 12,0 % | 423 |
| 2024 | 2.680 | 2.403 | 277 | 10,3 % | 271 |
| 2025 | 2.207 | 2.008 | 199 | 9,0 % | 300 |

Das AMS gibt an, dass manche Inserate kein eindeutiges Bundesland haben ([Methodenpaper](https://jobbarometer.ams.at/dam/jcr:353f155f-0769-410e-bd8d-727ecc09d144/Methodenpaper_v1.2.pdf), § 3.1.6).[^1] Der Anteil dieser Inserate sank von 38 % auf 9 %. Der Rückgang betrifft alle Berufsgruppen. Der Median über 59 AMS-Berufsgruppen sank von 37,6 % auf 8,9 %. Der Grund ist nicht geklärt. Die Veränderung seit 2020 ist daher unsicher. Die Steiermark liegt roh bei +34 %. Bei anteilsmäßiger Verteilung der nicht zugeordneten Inserate liegt sie bei −8,7 % (eine Sensitivitätsanalyse, keine Messung). Seit 2022 ist das Bild stabil. Die Steiermark liegt bei −29 %, die benannten Bundesländer bei −55 % und Österreich bei −56 %.

### Sprache, Bezahlung und Saison

| Befund | Wert | Basis |
|:--|--:|:--|
| Inserate mit deutscher Sprachanforderung | 40 % | Inseratstext |
| Inserate auf Englisch | 24 % | Inseratstext |
| Davon weiterhin mit deutscher Sprachanforderung | 19 % | Inseratstext |
| Gehaltsangaben auf kollektivvertraglichem Mindestniveau | 81 % | Ausgelesene Gehaltsangaben |
| Unterjährige Schwankungsbreite | 5–14 % | Eurostat |
| Schwankungsbreite zwischen den Jahren | 255–567 % | Eurostat |

Die meisten ausgeschriebenen Gehaltsangaben sind kollektivvertragliche Mindestgehälter. Die Inserate zeigen daher Untergrenzen, nicht die tatsächliche Bezahlung. Die Saisonalität ist gegenüber dem Zyklus klein.

## Grenzen

Was diese Arbeit nicht belegt:

- **Nachfrage über die Zeit.** Die Momentaufnahme ist ein eintägiger Bestand an Inseraten, kein Jahresvolumen, keine offenen Stellen und keine Einstellungen. Amtliche Reihen enthalten nicht zugeordnete Inserate, daher sind Änderungen je Bundesland seit 2020 unsicher.
- **Vollständige Abdeckung.** StepStone, Indeed und Karriereseiten von Unternehmen fehlen. Die titelbasierte Aufnahme hat eine gemessene Präzision, aber eine ungemessene Trefferquote (Recall).
- **Steirische Details.** Steirische Zellen sind klein (n = 58), daher kennzeichnet die Seite Anzahlen als vorläufig.
- **Kausalität.** Es gibt keine Einstellungsergebnisse. Keine Anforderung belegt daher, was zu einer Einstellung führt.

## Entscheidung

Die Momentaufnahme ist eine Evidenzbasis, kein Urteil. Jede Aussage lässt sich auf eine Tabellen-ID zurückführen. Zwei Entscheidungsdokumente bewerten jede Rollenfamilie anhand eines deklarierten Kompetenzprofils. Sie legen die Gewichte offen, bewerten nicht verdeckt und enthalten eine Sensitivitätsanalyse mit alternativen Gewichten.

> [!faq]- Warum veröffentlicht das Projekt die Rohinserate nicht?
> Das Projekt hat die Nutzungsbedingungen geprüft. Alle fünf Inseratquellen schränken die automatisierte Extraktion ein. Die Sammlung bleibt daher ein einmaliger, privater Forschungsdatensatz. Das öffentliche Repository enthält den Code, die Regeln und die aggregierten Tabellen, ohne jede Text- und URL-Spalte. Das Projekt veröffentlicht die Erhebungsskripte und die Rohinserate nicht.

Der Code steht unter der MIT-Lizenz. Dokumente und aggregierte Ergebnisse stehen unter CC BY 4.0.



[^1]: Das AMS JobBarometer zählt Online-Inserate nach Berufsgruppe und Bundesland. Das AMS gibt im [Methodenpaper](https://jobbarometer.ams.at/dam/jcr:353f155f-0769-410e-bd8d-727ecc09d144/Methodenpaper_v1.2.pdf) (§ 3.1.6) an, dass das AMS manche Inserate keinem Bundesland zuordnen kann. Die Österreichsumme kann daher die Summe der Bundesländer übersteigen. Das AMS gibt außerdem an, dass die Zahlen auch Inserate aus Deutschland für österreichische Grenzregionen enthalten.
