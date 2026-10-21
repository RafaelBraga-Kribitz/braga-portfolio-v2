---
title: "Ein Anbieter von KI-Prospecting behauptet einen 3×-Uplift. Was ich vor der Unterschrift verlangen würde."
code: "02-01"
kind: essay
date: "2026-09-19"
summary: "Ein vom Anbieter selbst verfasster Benchmark zu KI-Prospecting rechtfertigt ein Pilotprojekt, keinen Kauf. Vier Bedingungen auf Käuferseite schließen die Lücke."
lead: "Ein vom Anbieter selbst verfasster Benchmark zu KI-Prospecting rechtfertigt ein Pilotprojekt, keinen Kauf. Vier Bedingungen auf Käuferseite schließen die Lücke."
tags: [Marketingtechnologie, Messung, Prospecting]
lang: de
slug: ai-prospecting-vendor-3x-lift
draft: false
translationStatus: draft
---

Anbieter von KI-Prospecting-Tools (Werkzeugen für die KI-gestützte Suche nach potenziellen Neukunden) versprechen mehr Leads, weniger Recherche, bessere Qualifizierung und eine schnellere Pipeline. Eine aktuelle Fallstudie beziffert das: Eine KI-Prospecting-Plattform fand rund dreimal so viele relevante Leads wie ein herkömmlicher Webcrawler, bei etwa 90 % Precision und Recall (Genauigkeit und Trefferquote) in der Lead-Qualifizierung, und Vertriebsprofis bewerteten ihre KI-generierten Zusammenfassungen positiv.

Es handelt sich um die Studie von Kaplan, Seker und Yoruk (2025), „A review of AI-based business lead generation: Scrapus as a case study“, erschienen in Frontiers in Artificial Intelligence. Ein Detail zählt vor allem anderen: Der dritte Autor ist mit OptiWisdom affiliiert, dem Unternehmen hinter Scrapus. Hier bewertet ein Anbieter sein eigenes Produkt. Das macht die Ergebnisse nicht falsch. Es macht sie zu einer Verkaufsunterlage mit Methodenteil, und ich lese sie als solche.

Ich habe zwanzig Jahre lang Marketingtechnologie eingekauft. Die Frage, die ich dabei zu stellen gelernt habe, lautet nicht „Funktioniert das Modell?“, sondern „Was müsste zutreffen, damit dieses Ergebnis in meinen Zahlen auftaucht?“

Im Folgenden: was die Studie zeigt, was sie nicht zeigt, und die vier Bedingungen, die vor einer Unterschrift für mich erfüllt sein müssten.

## Was die Belege tatsächlich stützen

Die Studie ist stellenweise sorgfältig. Sie stimmt den Crawler auf Ausbeute ab, den Extraktor auf Recall und den Qualifizierer auf Precision, und sie sagt das offen. Außerdem bindet sie das Sprachmodell an extrahierte Fakten (Grounding), um Erfundenes zu begrenzen. Das sind vernünftige Entscheidungen.

Drei Punkte schwächen die Kernaussage.

**Der Crawler wird an seiner eigenen Belohnung gemessen.** Der Crawler erhält eine Belohnung (Reward), wenn das Extraktionsmodul auf einer Seite einen Lead findet. Die Erfolgskennzahl, die Harvest Rate (Ausbeute), ist der Anteil der gecrawlten Seiten, auf denen das Extraktionsmodul einen Lead gefunden hat. Das System wird auf genau das Signal optimiert, an dem es später gemessen wird. Eine 3×-Verbesserung in dieser Schleife sagt mir, dass der Crawler gelernt hat, dem Extraktor zu gefallen. Sie sagt mir nicht, dass die Leads gut sind.

**Jede Baseline ist die schwächste, die noch plausibel ist.** Crawling in Breitensuche (Breadth-first) mit einem Stichwortfilter. Eine Standard-Entitätenerkennung ohne Fine-Tuning (Nachtraining). Ein Lead-Scoring, das Stichwörter zählt. Eine Zusammenfassung, kopiert von der Über-uns-Seite. Diese Vergleichsbasen zu schlagen, ist zu erwarten. Der Vergleich, den ich sehen möchte, gegen einen kommerziellen Mitbewerber oder einen geschulten Sales Development Representative (zuständig für die Erstansprache im Vertrieb) mit einer Suchmaschine, steht nicht in der Studie.

**Die Precision-Recall-Kurve ist keine Kurve.** Der Text beschreibt Precision-Recall-Kurven, ein Modell, das das andere dominiert, und eine Fläche unter der Kurve von 0,92 gegenüber 0,79. Die Abbildung ist ein Balkendiagramm mit zwei Precision-Balken und zwei Recall-Balken. Eine Fläche unter der Kurve lässt sich nicht an vier Balken ablesen. Entweder wurde die Abbildung vertauscht, oder die Kurve wurde nie gezeichnet. So oder so: Wer dem Text mehr glaubt als der Abbildung, glaubt der falschen Quelle.

Nichts davon ist ein Ausschlussgrund. Es ist die übliche Lücke zwischen einem Anbieter-Benchmark und einer Kaufentscheidung. Mit den folgenden vier Bedingungen schließe ich diese Lücke.

## Mehr gefundene Leads müssen zu mehr Pipeline werden

Eine Harvest Rate von 15 % gegenüber 5 % ist eine Effizienzkennzahl. Sie misst, wie gut das System durch das Web navigiert. Sie misst weder vereinbarte Termine noch vom Vertrieb akzeptierte Leads (Sales-accepted Leads), geschaffene Verkaufschancen oder Umsatz.

Das ist der häufigste Fehler bei der Bewertung von Marketingtechnologie. Anbieter optimieren Zwischenkennzahlen, weil sie diese kontrollieren. Käufer brauchen Ergebnisse, weil sie dafür bezahlen.

Käuferfrage: Werden aus den zusätzlichen Leads zusätzliche Umsätze oder nur zusätzliche Datensätze im CRM?

## Mein Idealkunde muss in öffentlichen Daten sichtbar sein

Das System findet Unternehmen über das, was sie veröffentlichen: Websites, Finanzierungsmeldungen, Stellenausschreibungen, Produkteinführungen, Partnerschaften. Die Studie testete fünf von den Autoren definierte Profile, etwa Software für das Gesundheitswesen oder europäische Logistik-Start-ups, auf einem Korpus von mehr als 200.000 Seiten. Das ist echte Arbeit. Es ist aber auch ein Markt, in dem Unternehmen ständig Spuren hinterlassen.

Ein österreichischer Industriezulieferer, der an einige hundert Werksleitungen verkauft, ist ein anderes Umfeld. Einkaufsgremien (Buying Committees) bleiben verborgen, Kaufsignale (Intent Signals) sind selten, und die Beziehung zählt mehr als jede Ankündigung. Ein Modell generalisiert nicht, weil es intelligent ist. Es generalisiert, wenn der datenerzeugende Prozess auf meiner Seite dem ähnelt, an dem es getestet wurde.

Käuferfrage: Hinterlässt mein Idealkunde überhaupt genug beobachtbare Signale, damit das funktionieren kann?

## Precision hat eine Kostenstruktur, und das Vertriebsteam bezahlt sie

Neunzig Prozent Precision klingen hervorragend, bis man sie hochrechnet. Tausend Leads bei 10 % Falsch-Positiven sind hundert schlechte Empfehlungen. Bei fünf Minuten Prüfung pro Lead ist das ein voller Arbeitstag für Leads, die nie echt waren, und zwar bei jeder Aktualisierung der Liste.

Und das setzt voraus, dass das Team sie überhaupt prüft. Ein Tool mit 90 % Precision, das der Vertrieb ignoriert, hat eine Precision von null. Die Studie berichtet, dass die Nutzerinnen und Nutzer die KI-Zusammenfassungen bevorzugten. Sie misst weder die Akzeptanz im Alltag noch die eingesparte Zeit, die CRM-Integration oder das Verhalten des Vertriebs nach der zweiten Woche. Das Implementierungsrisiko ist meist größer als das Algorithmusrisiko. Ich habe mehr Tools an Reibung scheitern sehen als an schlechten Modellen.

Käuferfrage: Wie viele Leads werden vom Vertrieb angenommen, zu Kosten, die das Team zu tragen bereit ist?

## Die Gesamtkosten müssen sinken, statt sich zu verlagern

Die Zahl, auf die es ankommt, ist nicht Leads geteilt durch Lizenzgebühr. Es ist geschaffene Pipeline geteilt durch Gesamtkosten: Lizenz, Integration, Datenbereinigung, Arbeitszeit im Vertrieb, Change-Management und die Projekte, die nicht stattfanden, weil dieses stattfand.

Ein 3×-Uplift bei der Lead-Suche kann trotzdem Wert vernichten, wenn er den Prüfaufwand verdreifacht, einen Bereinigungsschritt hinzufügt und eine eigene Stelle braucht, die die CRM-Synchronisierung beaufsichtigt.

Käuferfrage: Senkt das die Akquisitionskosten, oder verschiebt es die Arbeit in einen Teil des Prozesses, den ich nicht messe?

## Meine Entscheidungsregel

Ich würde nicht auf Basis eines veröffentlichten Benchmarks kaufen, am wenigsten auf Basis eines Benchmarks, den der Anbieter selbst geschrieben hat.

Ich würde ein zweiwöchiges, bezahltes Pilotprojekt durchführen, mit meinem eigenen Idealkundenprofil (Ideal Customer Profile), meiner eigenen Region, meinem eigenen Vertriebsprozess, meinem eigenen CRM und meinem eigenen Team. Vor dem Start würde ich die Antwort zum Datenschutz schriftlich haben wollen: Das System speichert Datensätze auf Personenebene, die aus dem offenen Web ausgelesen werden, und in der Europäischen Union braucht das eine Rechtsgrundlage und die Erfüllung einer Informationspflicht, kein Versprechen.

Ich würde messen: vom Vertrieb akzeptierte Leads, vereinbarte Termine, geschaffene Verkaufschancen, Kosten pro vom Vertrieb akzeptiertem Lead und ob das Team das Tool am zehnten Tag noch öffnet.

Ich würde nicht messen: Harvest Rate, extrahierte Datensätze, Crawl-Abdeckung oder F1-Scores. Das sind die Kennzahlen des Anbieters. Das Pilotprojekt soll herausfinden, ob daraus meine werden.

Die Studie reicht, um ein Pilotprojekt zu rechtfertigen. Sie reicht nicht, um einen Kauf zu rechtfertigen. Genau dort gehört ein begutachteter (peer-reviewed) Anbieter-Benchmark hin: interessant, plausibel und zwei Wochen meiner Daten davon entfernt, geglaubt zu werden.
