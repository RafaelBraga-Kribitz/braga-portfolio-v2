# CV (LaTeX)

`braga-cv.tex` builds the one-page CV designed in `Design System v2 - Templates.dc.html` · 06.

- Engine: `xelatex braga-cv.tex` or `lualatex braga-cv.tex` (fontspec). Fonts load from `../fonts/BKribitz/` and `../fonts/BKribitzMono/`.
- Data: experience, education and languages are macros (`\cvRoleA`, `\cvEmployerA`, …). Create `cv-data.tex` from the commented block at the end of the file and `\input{cv-data}` before `\begin{document}`. No employer is typed in the template.
- Tokens: ink (black on paper), ink-2 `#5A5C61`, mid `#9EA0A5`, accent `#2F4BE0` — the same values as `colors.css`; hairlines 0.4pt; `\key{…}` is the one accent figure per page.
- Output: the PDF linked from the About page as "Download CV". Keep the file name stable so the link never breaks.
