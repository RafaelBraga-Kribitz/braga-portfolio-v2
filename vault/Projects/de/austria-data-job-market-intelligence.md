---
code: "01-01"
kind: case
date: "2026-09-16"
summary: "720 Kerninserate (Momentaufnahme vom 16. Sep. 2026). Eine datierte Sicht auf Stellentitel, Kenntnisse und regionale Nachfrage."
lead: "Eine Evidenzbasis für Berufsentscheidungen im Datenbereich in Österreich, mit Schwerpunkt Steiermark und Graz: eine eintägige Momentaufnahme von 720 Kerninseraten für Datenrollen aus fünf öffentlichen Quellen, ergänzt um das AMS JobBarometer 2020–2025 und die Saisonalität offener Stellen laut Eurostat."
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
translationStatus: draft
publish: true
---

# Arbeitsmarkt für Datenberufe in Österreich

> [!summary] Zusammenfassung
> SQL und Python führen eine eintägige Momentaufnahme von 720 Kerninseraten für Datenrollen an, der Stack (die eingesetzten Werkzeuge) ist auf Microsoft ausgerichtet, und in der AMS-Berufsgruppe „Data Scientist“ ist die Steiermark die einzige große Region über ihrem Niveau von 2020. Die Ergebnisse fließen in zwei Entscheidungsdokumente, die jede Rollenfamilie an einem deklarierten Kompetenzprofil bewerten; die Rohdatensammlung bleibt ein privater Forschungsdatensatz.

> [!note] Stand der Daten
> Diese Seite beschreibt die Momentaufnahme vom 16. Sep. 2026. Das Repository ist inzwischen auf die Momentaufnahme vom 18. Okt. 2026 umgestellt (Release 2026-10-19.1, 699 Kerninserate); seine README enthält die aktuellen Zahlen.

## Fragestellung

Die Fragen sind praktisch. Welche Stellentitel im Datenbereich werden in Österreich ausgeschrieben, wo, und mit welchen Technologien, Sprachen, Ausbildungen, Gehältern und Arbeitsmodellen? Wie unterscheidet sich die Steiermark von Wien? Die Einheit ist das Kerninserat für eine Datenrolle in einer eintägigen Momentaufnahme; die amtlichen Reihen werden als eigene Einheiten gelesen. Der Maßstab für die Antworten: Ein technisch versiertes, skeptisches Publikum soll Methode, Datenherkunft, Grenzen und Schlussfolgerungen prüfen können.

## Daten

Die Inserate wurden am 16. Sep. 2026 in einem einzigen Zeitfenster aus fünf öffentlichen Quellen erhoben, mit 45 Titel-Suchbegriffen auf Englisch und Deutsch, ohne Anmeldung und ohne Umgehung von CAPTCHA oder Paywall (Bezahlschranke). Plattformen, die die Erhebung blockierten, sind ausgeschlossen. Die amtlichen Reihen sind das AMS JobBarometer, das Online-Inserate nach Berufsgruppe und Bundesland zählt, und die vierteljährliche Statistik offener Stellen von Eurostat.

Von 12.429 Rohzeilen sind 720 Kerninserate für Datenrollen, 58 davon in der Steiermark. Über die Aufnahme entscheidet der Stellentitel; ihre Präzision, gemessen an 177 händisch klassifizierten Titeln, beträgt 83 % (streng) und 95 % (großzügig). 24 % der Inserate im Untersuchungsrahmen sind Dubletten und werden per Union-Find (Zusammenführung zusammengehöriger Einträge) vereint.

> [!spec] Momentaufnahme
> - Erhoben — 16. Sep. 2026, 17:00–18:40 UTC
> - Inseratquellen — EURES · karriere.at · LinkedIn (Stellenseiten ohne Anmeldung) · willhaben · jobs.at
> - Blockiert, ausgeschlossen — StepStone · Indeed · hokify · Glassdoor
> - Suche — 45 Titel-Suchbegriffe, Englisch und Deutsch
> - Inserate — 12.429 Rohzeilen · 720 Kerninserate · 58 in der Steiermark
> - Amtliche Reihen — AMS JobBarometer 2020–2025 · Eurostat, offene Stellen je Quartal

## Methode

Jeder Schritt ist ein Skript, und jede Regel steht in einer Konfigurationsdatei:

1. Stellentitel werden über geordnete Regex-Regeln (reguläre Ausdrücke) acht Rollenfamilien zugeordnet.
2. Die Region stammt aus expliziten Feldern, dann aus NUTS-3-Codes, dann aus Postleitzahlen und Ortsnamen im Text.
3. Gehaltsangaben werden aus strukturierten Feldern oder aus Text in der Nähe von Gehaltsbegriffen gelesen und auf ein Jahresgehalt mit 14 Monatsgehältern umgerechnet.
4. Sprachanforderungen werden aus einem Fenster von 120 Zeichen beiderseits jeder Sprachnennung gelesen.
5. Dubletten werden per Union-Find über Unternehmen, Titel, Bundesland und einen Fingerabdruck der Stellenbeschreibung gruppiert.

Jede Tabelle speichert ihr n, und Anteile, die in eine Entscheidung einfließen, tragen Wilson-Intervalle zu 95 %. Die amtlichen Reihen werden als eigene Einheiten ausgewertet und nie mit Statistiken auf Inseratsebene vermischt. Eine Suite aus 67 Tests prüft das Verhalten der Regeln und die Konsistenz der Ausgaben, und ein Digest-Skript (Zusammenfassungsskript) gibt jede in den Dokumenten zitierte Zahl erneut aus den Tabellen aus.

> [!definition] Textbasierter Anteil
> Ein Anteil, der aus dem Inseratstext gelesen wird, etwa eine Sprachanforderung. Sein Nenner sind die Inserate mit einer Beschreibung von mehr als 300 Zeichen.

## Ergebnis

Die Momentaufnahme beantwortet die Frage für einen Tag; die AMS-Reihe ergänzt den Trend.

### Technologien

SQL und Python führen, und der Stack ist auf Microsoft ausgerichtet: Azure und Power BI liegen weit vor Tableau.

> [!bars] Abb. 01-01-1 · Technologie-Nennungen
> SQL und Python führen die Momentaufnahme an.
> - SQL — 40
> - Python — 35
> - Azure — 19
> - Power BI — 18
> - Tableau — 3
>
> scale: 0–100 · unit: % · centre: no
> caption: Anteil der Inserate, die die jeweilige Technologie nennen; Skala 0–100 %. Mehrfachnennungen möglich.
> source: Inserat-Momentaufnahme, 16. Sep. 2026. Anteile gerundet; unvollständige Abdeckung.

### Region

Wien hält 48 % der offenen Kerninserate. Die Steiermark stellt 7,5 % der Momentaufnahme, aber 13,6 % des amtlichen Jahresvolumens, und ist in der AMS-Berufsgruppe „Data Scientist“ die einzige große Region über ihrem Niveau von 2020.[^1]

> [!bars] Abb. 01-01-2 · Region
> 58 der 720 Kerninserate entfallen auf die Steiermark.
> - Steiermark — 58
> - Alle Inserate — 720
>
> caption: Anzahl der Kerninserate; n = 720. Steirische Zellen sind klein, daher werden sie als Anzahlen berichtet und als vorläufig gekennzeichnet.
> source: Inserat-Momentaufnahme, 16. Sep. 2026.

> [!bars] Abb. 01-01-3 · Jahresvolumen
> Die Steiermark entwickelt sich gegen den Bundestrend.
> - Österreich — −28
> - Steiermark — +34
>
> scale: −50–50 · unit: % · centre: yes
> accent: Steiermark
> caption: Veränderung gegenüber dem Niveau von 2020, AMS-Berufsgruppe „Data Scientist“, Reihe 2020–2025. Mittellinie = null; Bereich −50 % bis +50 %.
> source: AMS JobBarometer, Online-Inserate nach Berufsgruppe und Bundesland.

### Rollenfamilien, Sprache und Gehalt

Die Anteile der Rollenfamilien stammen aus den Titelregeln, die Sprachanteile aus dem Inseratstext und der Gehaltsanteil aus den ausgelesenen Gehaltsangaben.

| Befund | Wert |
|:--|--:|
| Rollenfamilie Data Engineering | 22 % |
| Rollenfamilie Data Science | 22 % |
| Titel in Marketing- und Product-Analytics | 25 von 720 |
| Davon in der Steiermark | keine |
| Inserate mit deutscher Sprachanforderung | 40 % |
| Inserate auf Englisch | 24 % |
| Davon weiterhin mit deutscher Sprachanforderung | 19 % |
| Gehaltsangaben auf kollektivvertraglichem Mindestniveau | 81 % |

Data Engineering und Data Science sind die größten Rollenfamilien. Titel in Marketing- und Product-Analytics sind selten und fehlen in der Steiermark. Die meisten ausgeschriebenen Gehaltsangaben sind kollektivvertragliche Mindestgehälter: Die Inserate zeigen Untergrenzen, nicht die tatsächliche Bezahlung.

### Saison und Zyklus

Die Saisonalität ist gegenüber dem Zyklus klein: Die Eurostat-Reihen zeigen eine unterjährige Schwankungsbreite von 5–14 %, gegenüber 255–567 % zwischen den Jahren.

> [!quote] Ergebnis · Momentaufnahme vom 16. Sep. 2026 und AMS JobBarometer
> In Inseraten für Datenrollen in Österreich liegen SQL und Python vorn, bei einem auf Microsoft ausgerichteten Stack, und in der AMS-Berufsgruppe „Data Scientist“ ist die Steiermark die einzige große Region über ihrem Niveau von 2020.

## Grenzen

Was diese Arbeit nicht belegt:

- **Nachfrage über die Zeit.** Es ist ein eintägiger Bestand an Inseraten, kein Jahresvolumen, keine offenen Stellen und keine Einstellungen.
- **Vollständige Abdeckung.** StepStone, Indeed und Karriereseiten von Unternehmen fehlen, und die titelbasierte Aufnahme hat eine gemessene Präzision, aber eine ungemessene Trefferquote (Recall).
- **Steirische Details.** Steirische Zellen sind klein (n = 58), daher werden sie als Anzahlen berichtet und als vorläufig gekennzeichnet.
- **Kausalität.** Es gibt keine Einstellungsergebnisse; keine Anforderung belegt daher, was zu einer Einstellung führt.

## Entscheidung

Die Momentaufnahme ist eine Evidenzbasis, kein Urteil. Ihre Ergebnisse fließen in zwei Entscheidungsdokumente, die jede Rollenfamilie an einem deklarierten Kompetenzprofil bewerten, mit offengelegten Gewichten und einer Sensitivitätsprüfung unter alternativen Gewichten. Es gibt keine verdeckte Bewertung, und jede Aussage lässt sich auf eine Tabellen-ID zurückführen.

> [!faq]- Warum werden die Rohinserate nicht veröffentlicht?
> Eine Prüfung der Nutzungsbedingungen ergab, dass alle fünf Inseratquellen die automatisierte Extraktion einschränken; die Sammlung bleibt daher ein einmaliger, privater Forschungsdatensatz. Die Erhebungsskripte und die Rohinserate werden nicht veröffentlicht; das öffentliche Repository enthält den Code, die Regeln und die aggregierten Tabellen, ohne jede Text- und URL-Spalte.

Code unter MIT-Lizenz; Dokumente und aggregierte Ergebnisse unter CC BY 4.0.



[^1]: Das AMS JobBarometer zählt Online-Inserate nach Berufsgruppe und Bundesland; „Data Scientist“ ist die Berufsgruppe, aus der der Trend gelesen wird.
