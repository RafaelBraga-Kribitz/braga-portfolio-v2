---
page: accessibility
lang: de
updated: "2026-11-02"
summary: Diese Website soll den Web Content Accessibility Guidelines 2.2, Stufe AA, entsprechen.
slug: accessibility
translationStatus: draft
publish: true
---

# Erklärung zur Barriere­freiheit

Diese Website soll den Web Content Accessibility Guidelines 2.2, Stufe AA, entsprechen.

> [!spec] Prüfung
> - Automatisiert — Chromium-Layoutprüfungen bei sechs Breiten in beiden Farbschemata; axe auf einer Auswahl von Vorlagenseiten bei 390 und 1.280 px
> - Manuelle Prüfungen mit Screenreader, verschiedenen Browsern und realen Geräten sind noch unvollständig; siehe die bekannten Einschränkungen unten

## Tastatur

Die Tabulatortaste führt durch Links und Bedienelemente; der erste Halt ist „Zum Inhalt springen“. Der Fokus wird durch einen 2 px breiten Rahmen in Tintenfarbe angezeigt. In den Werkzeugen bewegen sich die Regler mit den Pfeiltasten, und jeder Wert lässt sich auch in sein Feld eintippen.

> [!spec] Kürzel
> - 0 — Startseite
> - 1 bis 4 — Arbeit, Schreiben, Werkzeuge, Über, wie in der Kopfzeile nummeriert
> - j / k — Nächster / vorheriger Abschnitt der Seite
> - n / p — Nächstes / vorheriges Projekt; älterer / neuerer Essay
> - u — Eine Ebene höher
> - l — Englische Version, sofern vorhanden; sonst die englische Startseite
> - t — Hell- oder Dunkelmodus
> - ? — Die Liste der Kürzel; Esc schließt sie

Die Kürzel sind einzelne Tasten und benötigen JavaScript. Beim Tippen in einem Feld sowie bei gehaltener Cmd-, Strg- oder Alt-Taste sind sie inaktiv. „Tastaturkürzel“ in der Fußzeile öffnet dieselbe Liste.

## Einschränkungen

Die E-Mail-Adresse wird visuell erzeugt und nicht im HTML ausgegeben. Ohne JavaScript kann ein Screenreader sie über das Kontaktelement nicht abrufen. Die Tastatur-Fokusreihenfolge in der Desktop-Kopfzeile weicht von der visuellen Reihenfolge ab. Automatisierte Prüfungen belegen keine vollständige WCAG-Konformität; manuelle Screenreader-, Browser-, Geräte- und Zoomprüfungen sind noch unvollständig.

Bekannte Einschränkung: Die interaktiven Werkzeuge benötigen JavaScript. Ohne JavaScript wird das Standardszenario als Text und Tabelle angezeigt.

Rückmeldungen zu Barrieren an [hello@rafaelbragakribitz.com](mailto:hello@rafaelbragakribitz.com). Erstellt am 20. Okt. 2026, aktualisiert am 2. Nov. 2026.
