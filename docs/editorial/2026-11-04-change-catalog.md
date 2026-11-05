# Change catalog: the 4 Nov 2026 design refinement

Audience: Rafael. Use this file after the merge, when you check the live site and decide what to keep.

Each visitor-visible change is one commit. The commit subject starts with its ID, for example `[DC-07]`. You can remove any one change and the site works as before for that change. You can put it back later.

## How to remove one change

Look up the commit by its ID. Do not use the SHA. The example removes DC-07.

```
git switch -c remove-dc-07 origin/main
git revert --no-edit $(git log --format=%H -1 --grep='^\[DC-07\]')
git push -u origin remove-dc-07
```

Then open a pull request from `remove-dc-07` and merge it. Replace `07` with the ID you want.

Rules:

- Remove one DC at a time. Each revert leaves a working site. The revert of any two DCs also applies without a conflict.
- To put a removed change back, revert the revert commit. Use `git log --grep='^Revert "\[DC-07\]'` to find it.
- To change a DC instead of removing it, make a new commit on a branch. Do not edit the old commit.
- `[DC-00]` commits are small preparation commits. They change no behaviour. Do not remove them.
- `[DC-99]` is this record. `design-system/DECISIONS.md` is a dated record. A revert does not change it. After you remove a change, add a short dated note to D-063 in `design-system/DECISIONS.md`.
- The live site needs the deploy to run after the merge. Check the URL in the table after the deploy.

## Changes

### DC-01 Title "Data Analyst"

- **Visitor sees:** the home heading, the page title, the structured-data job title, the About role row and the share text read "Data Analyst". The cover heading breaks as "Data" over "Analyst". The past role "Marketing Data Scientist" and the Domains row stay.
- **Look at:** `/en/` and `/de/` (heading, browser tab), `/en/about/` (role row).
- **Remove:** `--grep='^\[DC-01\]'`
- **Depends on:** nothing. DC-02, DC-03 and DC-04 read best with it (see their entries).
- **After removal:** the site reads "Marketing Data Analyst" again, in two cover lines "Marketing" and "Data Analyst".

### DC-02 Home lead sentence

- **Visitor sees:** the first sentence under the heading reads "Applied analytics for marketing and customer decisions." (DE: "Angewandte Analytik für Marketing- und Kundenentscheidungen."). The second sentence stays.
- **Look at:** `/en/`, `/de/`, and the home meta description.
- **Remove:** `--grep='^\[DC-02\]'`
- **Depends on:** nothing. DC-04 uses the same sentence on the share card.
- **After removal:** the old first sentence "Marketing experience, translated into analytical work." returns.

### DC-03 Contact sentences name two roles

- **Visitor sees:** the home contact line and the About contact sentence name "Data Analyst" and "applied Data Scientist" roles. About also says marketing and customer data are the domain.
- **Look at:** `/en/` (section 04 About), `/en/about/` (Contact), and the DE twins.
- **Remove:** `--grep='^\[DC-03\]'`
- **Depends on:** nothing. It reads best with DC-01.
- **After removal:** both sentences name "Marketing Data Analyst" roles again.

### DC-04 Share card image

- **Visitor sees:** the picture in link previews shows "Data Analyst" and the new one-line sentence.
- **Look at:** `/share-card.png`. Link-preview caches (LinkedIn, X) can keep the old picture for days.
- **Remove:** `--grep='^\[DC-04\]'`
- **Depends on:** it shows the text of DC-01 and DC-02. If you remove DC-01 or DC-02, remove DC-04 too, or the card and the site disagree.
- **After removal:** the old card with "Marketing Data Analyst" returns.

### DC-05 About language row

- **Visitor sees:** a new row in the About skills list: "Languages — Portuguese (native) · English (fluent) · German (A2 certificate; course in progress)". DE: "Sprachen — …".
- **Look at:** `/en/about/` and `/de/about/`, section Skills.
- **Remove:** `--grep='^\[DC-05\]'`
- **Depends on:** nothing.
- **After removal:** the list has no language row.

### DC-06 Toolbox order

- **Visitor sees:** the toolbox starts with SQL, then Python: "SQL · Python · DuckDB · dbt · PyMC · DVC · Git · Spark". Spark stays. No tool is added.
- **Look at:** `/en/about/` and `/de/about/`, section Skills, row Toolbox.
- **Remove:** `--grep='^\[DC-06\]'`
- **Depends on:** nothing.
- **After removal:** the old order "Python · PyMC · … · SQL · Spark" returns.

### DC-07 Contact items named GitHub and LinkedIn

- **Visitor sees:** the two profile links in About have the labels "GitHub" and "LinkedIn", and both show your name. The first had the label "Elsewhere" (DE "Anderswo") and the link text "GitHub".
- **Look at:** `/en/about/` and `/de/about/`, section Contact.
- **Remove:** `--grep='^\[DC-07\]'`
- **Depends on:** nothing.
- **After removal:** the first item has the label "Elsewhere" / "Anderswo" and the link text "GitHub" again.

### DC-08 Gap after a table

- **Visitor sees:** a heading that follows a table has the normal section gap above it (96 px, 64 px on a phone). On About, the Contact heading no longer sits close under the CV table.
- **Look at:** `/en/about/` at the Contact heading. A table followed by a callout or another table is unchanged.
- **Remove:** `--grep='^\[DC-08\]'`
- **Depends on:** nothing.
- **After removal:** the Contact heading sits about 12 px under the CV table again.

### DC-09 Home link to the projects

- **Visitor sees:** a quiet link under the contact button on the home cover: "See the 5 projects →" (DE "Die 5 Projekte ansehen →"). It goes to the Work section. The button stays the only accent.
- **Look at:** `/en/` and `/de/`, first screen.
- **Remove:** `--grep='^\[DC-09\]'`
- **Depends on:** nothing.
- **After removal:** the cover ends with the contact button only.

### DC-10 Rail evidence counts

- **Visitor sees:** the second row of the cover rail reads "Evidence — 5 projects · 7 essays" (DE "Belege — 5 Projekte · 1 Essay"). The numbers come from the content, not from typed text. The old row "Focus — Marketing · Data · Decisions" is gone.
- **Look at:** `/en/` and `/de/`, left rail of the cover (below the heading on a phone).
- **Remove:** `--grep='^\[DC-10\]'`
- **Depends on:** nothing.
- **After removal:** the row "Focus / Schwerpunkt" with the typed words returns.

### DC-11 Essay author link

- **Visitor sees:** every essay starts its meta row with the author name "Rafael Braga-Kribitz". It links to About. Notes do not change.
- **Look at:** `/en/writing/the-evidence-clock/` and `/de/writing/ai-prospecting-vendor-3x-lift/`, under the title.
- **Remove:** `--grep='^\[DC-11\]'`
- **Depends on:** nothing.
- **After removal:** the meta row starts with the kind (Essay) again.

### DC-12 Essay close

- **Visitor sees:** every essay ends with a close block: "Written by Rafael Braga-Kribitz. Questions about this essay, or a role where this kind of work fits?", the contact button and a quiet link "See the projects →" to Work (DE: "Geschrieben von …", "Die Projekte ansehen →").
- **Look at:** the end of any essay, above the "§ END" bar.
- **Remove:** `--grep='^\[DC-12\]'`
- **Depends on:** nothing.
- **After removal:** an essay ends with the end bar only. Project pages keep their close.

### DC-13 Contact button for assistive technology

- **Visitor sees:** nothing new on screen. A screen-reader user hears "Copy the email address: …" and "Open an email: …" with the address, and hears "Copied" after Copy. Without JavaScript the link is named "Open contact details". The built HTML still holds no plain address.
- **Look at:** any contact button (home, About, project, essay) with a screen reader or the browser accessibility tree.
- **Remove:** `--grep='^\[DC-13\]'`
- **Depends on:** nothing.
- **After removal:** the old names return ("Write an email", "Contact details"). They do not contain the visible word "Open", and nothing is announced after Copy.

### DC-14 Listing headings

- **Visitor sees:** nothing new on screen. On the home page, project, essay and tool titles are level-3 headings. On Work, Writing and Tools, the row titles are level-2 headings. Screen-reader users can jump between them.
- **Look at:** the heading list of `/en/` and `/en/work/` in a screen reader or the browser accessibility tree.
- **Remove:** `--grep='^\[DC-14\]'`
- **Depends on:** nothing.
- **After removal:** the titles are plain text again.

### DC-15 "1 essay"

- **Visitor sees:** when only one essay exists in a language, the home row reads "1 essay" (DE "1 Essay"). The DE home shows this now. Before, it read "Alle 1 Essays".
- **Look at:** `/de/`, section 02 Writing, last register row.
- **Remove:** `--grep='^\[DC-15\]'`
- **Depends on:** nothing.
- **After removal:** the DE row reads "Alle 1 Essays" again.

### DC-16 Footer links 44 px

- **Visitor sees:** on a phone (below 768 px) the footer link rows are 44 px high, as all other tap targets. The footer is about 12 px taller per link row. The accessibility gate G-05 now checks 44 px for the footer.
- **Look at:** the footer of any page at 390 px width.
- **Remove:** `--grep='^\[DC-16\]'` (this also restores the old gate rule and its test fixture)
- **Depends on:** nothing.
- **After removal:** footer rows are 32 px again, and gate G-05 allows 32 px for them.

### DC-17 Tag folder archive: one rule under the header

- **Visitor sees:** on a notes folder archive, no second hairline sits under the page header.
- **Look at:** `/en/tags/eigenvalues-eigenvectors-and-the-characteristic-polynomial/`, top of the page.
- **Remove:** `--grep='^\[DC-17\]'`
- **Depends on:** nothing.
- **After removal:** a second rule shows above the archive heading.

### DC-18 Tag folder archive: no "Notes →" link

- **Visitor sees:** the archive heading has no "Notes →" link at the right. The trail above it already links to Notes.
- **Look at:** the same archive page, heading row.
- **Remove:** `--grep='^\[DC-18\]'`
- **Depends on:** nothing.
- **After removal:** the "Notes →" link returns.

### DC-19 Trail arrows

- **Visitor sees:** in a wrapped trail (the "02 Writing → …" line), an arrow stays with the item after it. It no longer stands alone at the end of a line. This applies to document trails and to the tag folder trail.
- **Look at:** the same archive page at 390 px, and any project or essay page at a narrow width.
- **Remove:** `--grep='^\[DC-19\]'`
- **Depends on:** nothing.
- **After removal:** an arrow can end a line alone again.

### DC-20 Project tables on a phone

- **Visitor sees:** below 560 px, a table with four or more columns keeps its text columns at least 16 characters wide. A value no longer wraps to four lines. The table scrolls sideways inside its frame. The line "← Scroll sideways →" (German: "← Seitlich scrollen →") shows under the table. Number cells keep their natural width. The header of a number column keeps 14 characters. A table with one to three columns does not change.
- **Look at:** a project page with a table at 390 px, for example `/en/work/austrian-mmm-budget-optimizer/`.
- **Remove:** `--grep='^\[DC-20\]'`
- **Depends on:** nothing.
- **After removal:** narrow columns squeeze values again.

### DC-21 Gate G-15 waits for page transitions

- **Visitor sees:** nothing. This is a test change. The gate that checks one accent per section now waits until the page's CSS transitions end. The contact button fades its two halves for 140 ms after the page script runs. A gate run inside that window counted a second accent by mistake. The same race exists on the base build.
- **Look at:** nothing on the site. Run `npm run test:gates`.
- **Remove:** `--grep='^\[DC-21\]'`
- **Depends on:** nothing.
- **After removal:** `npm run test:gates` can fail on `/de/about/` G-15 about once in 1000 runs.

### DC-22 Reduced mobile footer

- **Visitor sees:** on a phone (below 768 px) the footer has three rows and no group labels. Row 1: Contact, Tags, Sitemap, RSS. Row 2: Impressum, Privacy, Accessibility. Row 3: GitHub, LinkedIn, Kaggle, Tableau (the label was "Tableau Public" before DC-23; row 3 wraps to two rows below 348 px, a measurement with the current fonts). Then the BRAGA bar. These links are hidden on a phone: the Index group (the header has the doors), Home (the header wordmark), Deutsch / English (the header's language link) and Keyboard shortcuts (a phone has no keyboard). Contact stays, because the header hides its Contact link below 327 px. Link rows stay 44 px high. From 768 px the footer does not change. Owner request of 5 Nov 2026; decision D-064.
- **Look at:** the footer of any page at 390 px and 320 px width, in English and German.
- **Remove:** `--grep='^\[DC-22\]'`
- **Depends on:** nothing to work. It rewrites the CSS lines that DC-16 set, so remove DC-22 before DC-16 if you want both gone; reverting DC-16 alone can conflict.
- **After removal:** the five labelled groups sit two by two again, as after DC-16.

### DC-23 Footer link "Tableau"

- **Visitor sees:** the footer link to the Tableau Public profile reads "Tableau" with its arrow, in English and German, at every width. The link target does not change. Prose that names the product "Tableau Public" (the warehouse TCO project page) does not change. Owner request of 5 Nov 2026. With this label the four Elsewhere links sit on one row on a phone from 348 px width up; at 320 to 347 px they take two rows.
- **Look at:** the footer of any page at 390 px, 320 px and 1280 px.
- **Remove:** `--grep='^\[DC-23\]'`
- **Depends on:** nothing. It only changes the strings `link.tableau` in `src/lib/i18n.ts`. It reads best with DC-22, whose row 3 it shortens.
- **After removal:** the label reads "Tableau Public" again, and row 3 takes two rows at 390 px again.

### DC-24 Footer columns at 768 to 857 px

- **Visitor sees:** in English, from 768 to 857 px width, the first footer column is wider than the other four (22 px at 768, none at 857). "Keyboard shortcuts" stays on one line; before, it wrapped to two lines and the footer was 401 px high instead of 383 px. German and widths from 858 px do not change. The trade-off: in this range the five columns are not equal. The first and last columns still start and end on the page grid's outer lines. Owner approval of 5 Nov 2026; decision D-064.
- **Look at:** `/en/` at 768 px, 800 px and 857 px.
- **Remove:** `--grep='^\[DC-24\]'`
- **Depends on:** nothing.
- **After removal:** "Keyboard shortcuts" wraps to two lines from 768 to 857 px in English.

### DC-25 Gate server follows symlink stubs

- **Visitor sees:** nothing. This is a test change. On a Windows checkout without symlink rights, git writes the fixtures' two symlinks (`tests/gates/fixtures/tokens.css` and `fonts`) as one-line text files. The gate server now follows such a file. Before, `npm run test:gates:self` saw no tokens and no fonts there and reported 11 mismatches (G-11 and G-12 failing on the clean fixture, and G-03, G-04, G-08, G-15, G-16 not failing on the bad one). On Linux nothing changes.
- **Look at:** nothing on the site. Run `npm run test:gates:self` and `node --test tests/unit/gates-server.test.mjs`.
- **Remove:** `--grep='^\[DC-25\]'`
- **Depends on:** nothing.
- **After removal:** on a checkout without symlinks, the self-test shows the 11 mismatches again.

### DC-26 Gate G-18: Contact stays reachable

- **Visitor sees:** nothing. This is a test change. New gate G-18: on a page with a header contact link, at least one visible link to the same address must exist in every tested width. At 320 px the header hides its Contact link, so the footer's Contact must be visible there. The gate has a bad fixture (the header link hidden below 327 px, no other link to its address) and an entry in `expect.json`.
- **Look at:** nothing on the site. Run `npm run test:gates` and `npm run test:gates:self`.
- **Remove:** `--grep='^\[DC-26\]'`
- **Depends on:** nothing to work. It guards DC-22.
- **After removal:** nothing stops a change to the footer from hiding Contact on a phone.

## Links between changes

No change needs another change to work. These pairs read best together:

| Pair | Reason |
|---|---|
| DC-01, DC-02, DC-03, DC-04 | They all name the role. Keep or remove them as a set to keep the site, the About page and the share card consistent. |
| DC-09, DC-12 | Both add a quiet "see the projects" link. They are independent. |

## Open owner decisions (not changed)

These items stay open. See `TODO-BEFORE-SHARING.md`, items 4.14 to 4.18.

- O1 German wording of the language row (DC-05 uses the narrower text).
- O2 Spark in the toolbox.
- O3 Approval of the new copy and the new German strings.
- O4 The "· EUR" footer mark and the Tableau link.
- O5 The MMM page note "Reviewed on 26 Oct 2026".
