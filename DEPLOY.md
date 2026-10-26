# Deploying the site

A static Astro build (`dist/`), published with GitHub Pages by
`.github/workflows/pages.yml`. Nothing on the page talks to a server: the
host only has to serve files, return `404.html` for a missing path, and
add the trailing slash to a folder URL (GitHub Pages does all three).

## The two settings that decide every URL

| Setting | Where | Value now |
|---|---|---|
| Origin | `site` in `astro.config.mjs` **and** `url` in `src/lib/site.ts` (keep them equal) | `https://rafaelbraga-kribitz.github.io` |
| Base path | the `SITE_BASE` environment variable at build time (read by `astro.config.mjs` as `base`) | `/` by default |

The origin is a guess built from the GitHub account name
(`RafaelBraga-Kribitz`; host names are lower case, so the user site is
`rafaelbraga-kribitz.github.io`). Confirm it before launch.

Every internal URL goes through `src/lib/routes.ts` (`route()`,
`withBase()`, `absolute()`), so the base reaches the shell, the footer,
canonical and hreflang links, the favicons, the share card, `code.js`, the
RSS link, the root redirect, the 404 page, `sitemap.xml`, `feed.xml` and
`robots.txt`. Root-relative links written in Markdown (`[…](/en/work/…/)`)
get the base from `src/lib/rehype/links.mjs`. Stylesheet font URLs and the
tool islands get it from Vite. Never write a root path by hand in a
template: use `route()` or `withBase()`.

## Option 1 · user site (recommended)

The repository is named `RafaelBraga-Kribitz.github.io`; the site is served
at `https://rafaelbraga-kribitz.github.io/`.

- `SITE_BASE`: leave unset (`/`).
- Origin: as now.

## Option 2 · project site

Any other repository name, e.g. `braga-portfolio`; the site is served at
`https://rafaelbraga-kribitz.github.io/braga-portfolio/`.

- `SITE_BASE=/braga-portfolio/` (the repository name between slashes). In
  the workflow, set it as a repository variable: Settings → Secrets and
  variables → Actions → Variables → `SITE_BASE`.
- Origin: as now.
- `robots.txt` then sits under `/braga-portfolio/`, where crawlers do not
  read it; the sitemap is still linked from every page footer.

Check a project-site build locally:

```sh
SITE_BASE=/braga-portfolio/ npx astro build --outDir /tmp/bk-base
node scripts/gates/run.mjs --dir /tmp/bk-base --base /braga-portfolio/ --quick
node scripts/gates/server.mjs --dir /tmp/bk-base --base /braga-portfolio/   # look at it in a browser
```

L-01 fails any internal link that misses the base.

## Option 3 · custom domain

E.g. `https://example.com/` (none is chosen yet).

- Set the origin in both places (`astro.config.mjs` `site`, `src/lib/site.ts`
  `url`).
- `SITE_BASE`: unset (`/`).
- Add `public/CNAME` containing the bare host name (`example.com`), and set
  the same domain under Settings → Pages → Custom domain; enforce HTTPS.
- Keep the user site or project site repository as it is: GitHub redirects
  the `github.io` address to the custom domain.

## The workflow

`.github/workflows/pages.yml`, on every push to `main` or `master`, by
hand (Actions → Deploy to GitHub Pages → Run workflow), and daily at 04:43
UTC so a vault note with a future `date` goes online on that day:

1. checks out the repository and sets up Node 22 with the npm cache;
2. `npm ci` (the lockfile is the source of truth);
3. installs Playwright's Chromium for the gates (`npx playwright install
   --with-deps chromium`; in the agents' container the browser is
   preinstalled and this step is never run there);
4. `npm run activity` refreshes `src/data/activity.json`, the data of
   the project build logs, from each project repository's git history
   (public clones, no token); if it fails, the committed file is used;
5. `npm run verify`: `astro check`, both lints, the unit tests, `vault:check`, the build
   (with `SITE_BASE` when set) and every gate over `dist/` (with the same
   base: the gate runner reads `SITE_BASE` too). A red gate stops the
   deploy;
6. uploads `dist/` with `actions/upload-pages-artifact` and publishes it
   with `actions/deploy-pages`.

One-time setup: Settings → Pages → Build and deployment → Source:
**GitHub Actions**.

## Generated files

`public/favicon-32.png`, `public/favicon-180.png` and
`public/share-card.png` are committed. Re-render them with `npm run assets`
after a change to the faces, the tokens, the name, the role or the card's
line (`scripts/assets/build-assets.mjs`).
