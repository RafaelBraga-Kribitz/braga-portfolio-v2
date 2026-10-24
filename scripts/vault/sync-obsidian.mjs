#!/usr/bin/env node
// npm run vault:sync — copies the site's look into the vault's Obsidian
// settings: design-system/tokens.css and design-system/obsidian-snippet.css
// become vault/.obsidian/snippets/braga-tokens.css and braga.css, the two
// CSS snippets the vault enables. `npm run vault:check` fails while they
// differ, so the vault never shows an old look.
import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
export const SNIPPETS = [
  ['design-system/tokens.css', 'vault/.obsidian/snippets/braga-tokens.css'],
  ['design-system/obsidian-snippet.css', 'vault/.obsidian/snippets/braga.css'],
];

if (import.meta.url === `file://${process.argv[1]}`) {
  mkdirSync(`${root}vault/.obsidian/snippets`, { recursive: true });
  for (const [from, to] of SNIPPETS) { copyFileSync(root + from, root + to); console.log(`${from} → ${to}`); }
}
