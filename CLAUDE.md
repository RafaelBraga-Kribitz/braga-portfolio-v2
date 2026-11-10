# Working in this repository

## The vault is the single source of content

`website_vault/` is an Obsidian vault and the only place the site's words live. The owner edits it in Obsidian; the build reads it. Keep it that way in every change:

- **Documents** (projects, essays, notes, About, System, legal pages) are notes in `website_vault/{Projects,Essays,Notes,Pages,Legal}/{en,de}/`. Edit the note, never a template.
- **Copy of the laid-out pages** (home, the Work / Writing / Notes / Tools indexes, the two tool pages, 404, the language chooser) and the **site identity** (name, role, place, links) are properties of the notes in `website_vault/Site/`. The contract is `COPY` in `src/lib/vault/copy.mjs`; pages read it with `copyOf(note, lang)` or through `t()` (the `VAULT_COPY` keys in `src/lib/i18n.ts`).
- **Never type a reader-facing sentence, title, description or meta description into `src/`.** A request such as "change the home lead" or "rename the role" is an edit to a vault note. New copy means: add the property to `COPY`, to the EN and DE notes, to `website_vault/.obsidian/types.json`, and to the note's explanatory body; then read it in the template.
- Only interface labels (button names, table heads, counts, aria labels, the tools' control labels) stay in code: `src/lib/i18n.ts` and `src/components/tools/`.
- The folder name is written once in code: `VAULT_NAME` in `src/lib/vault/index.mjs`.

`tests/unit/site-copy.test.mjs` fails when a template holds a per-language block of copy or the vault misses a property. `npm run vault:check` reports vault faults with file and property.

## Before pushing

`npm run verify` (check, lint, unit tests, vault check, build, gates). The gates need Playwright's Chromium.

Both languages always change together: a property added to `Site/en/` is added to `Site/de/`.
