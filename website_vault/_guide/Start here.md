# Start here

This vault **is** the website. Every note in a site folder with `publish: true` is a page, and the sentences of the pages that are not notes (the home page, the section headings, the tool pages, the 404 page, the name and role) are properties of the notes in `Site/`. Everything else stays private. Write here, push, and the site rebuilds itself (about two minutes).

## Set up once (on each computer)

1. In Obsidian: **Open folder as vault** → choose the `website_vault` folder inside the repository (`~/Dev/braga-portfolio-v2/website_vault`). The settings come with it: wikilinks, attachments into `Attachments/`, templates from `_templates/`, the property types, and the site's look as two CSS snippets (Settings → Appearance → CSS snippets: `braga-tokens`, `braga`).
2. Community plugins (Settings → Community plugins → Browse), all optional:
   - **Obsidian Git**: publish from Obsidian. Set *Auto commit-and-sync interval* (e.g. 10 minutes) or use the command *Commit-and-sync*. The vault folder sits inside the repository, so the plugin finds it.
   - **Dataview**: the ` ```dataview ` blocks show their results in Obsidian too (the site runs them on its own).
   - **Templater** is not needed: the core *Templates* plugin is set up.
3. Fonts: to see the site's faces in Obsidian, install the BKribitz fonts from `public/fonts/` on the computer.

## Write

| To… | Do this |
|---|---|
| start a project, essay or note | create a note in `Projects/en/`, `Essays/en/` or `Notes/en/`, then *Insert template* → Project, Essay or Note |
| publish it | set `publish: true` (the templates start with `false`) |
| unpublish it | set `publish: false`, or `draft: true` |
| schedule it | set `date` in the future: it goes online that day |
| change a project's status | change its tag: `#status/complete`, `#status/functional`, `#status/under-revision`, `#status/in-build`, `#status/archived` |
| add an image, video, audio, a PDF | drop it into the note (it lands in `Attachments/`) |
| set a cover image | `cover: photo.png` (and `cover_alt`) |
| pin a note first in its list | `featured: true` |
| write the German version | the same file name in the `de` folder (or the same `slug`) |
| change a sentence on the home page, a section heading, a tool's title or lead, the 404 page | edit the property in `Site/en/` (and `Site/de/`): see below |
| change the name, the role, the place, a profile link | edit `Site/Identity` |
| see what is wrong before publishing | `npm run vault:check` in the repository |

The **title** is the note's first `# heading`. Headings go down to `######`. Everything Obsidian does in a note works on the site: links between notes, embeds, tags, callouts, tables, lists, tasks, footnotes, maths, code, Mermaid diagrams, Dataview queries. The full list is in [[Syntax reference]].

## The pages that are not notes: `Site/`

Some pages are layouts, not documents: the home page, the three index pages, the two tools, the 404 page. Their words are still here. Each has a note in `Site/en/` and `Site/de/` whose **properties** are the sentences; the text under the properties only explains them and never reaches the site.

| Note | Holds |
|---|---|
| [[Identity]] (in `Site/`, once for both languages) | name, wordmark, role, place, email, the profile links |
| `Home` | the cover (title, lead) and the opening lines of the home sections, the contact paragraph |
| `Work`, `Writing`, `Notes`, `Tools` | each index page's heading, paragraph and search description; the closing question of a project and of an essay |
| `Confusion matrix`, `AB sample size` | each tool's row in the listings and its page's title, lead and meta line |
| `Not found` | the 404 page |
| `Language chooser` (English only) | the page at the bare address |

Three rules:

- Every property must be filled. An empty one stops the build, and `npm run vault:check` names the note and the property first.
- Keep the placeholders in braces: `{n}` and `{k}` are counts the site fills in, `{name}` and `{role}` come from `Identity`.
- `&nbsp;` is a no-break space and `&shy;` a soft hyphen, written out so they stay visible here.

Button names, table heads and other interface labels are not in the vault: they are part of the site's code (`src/lib/i18n.ts`), as are the controls inside the two tools.

## How it maps to Ghost

| Ghost | Here |
|---|---|
| Post, page | a note in `Essays/`, `Notes/`, `Projects/`, `Pages/` |
| Publish, unpublish, draft | `publish: true` / `false`, `draft: true` |
| Schedule | a future `date` |
| Feature image | `cover`, `cover_alt` |
| Excerpt | `summary` (notes: the first paragraph by default) |
| Tags, tag pages | `tags` and `#tags`; every tag has a page at `/en/tags/<tag>/` |
| Featured post | `featured: true` |
| Meta title, description, canonical | `seo_title`, `seo_description`, `canonical` |
| Image, gallery, video, audio, file cards | `![[…]]` embeds (one, several in a paragraph, a video, an audio file, a PDF) |
| Bookmark card | `> [!bookmark]` or `![[Other note]]` |
| Button card | `> [!cta]` |
| Callout, toggle | `> [!note]`, `> [!faq]-` |
| Embed (YouTube, Vimeo) | the link alone on a line: a card that links out |
| Code, Markdown, HTML cards | code fences; Markdown; HTML is not allowed (the design system decides the look) |
| Related posts | "Related" under every project and piece of writing |
| RSS | `/feed.xml` |
| Members, newsletters, comments | not part of this site |

## What never reaches the site

Anything without `publish: true` (the `Site/` notes are the exception: they are never pages, only their properties are read); anything in `_templates/`, `_guide/` or another folder starting with `_`; `%% comments %%`; attachments that no published note uses; links to unpublished notes (they show as plain text).
