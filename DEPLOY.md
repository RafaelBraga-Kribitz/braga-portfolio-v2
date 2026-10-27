# Deploying the site

A static Astro build (`dist/`), published with GitHub Pages by
`.github/workflows/pages.yml`. Nothing on the page talks to a server: the
host only has to serve files, return `404.html` for a missing path, and
add the trailing slash to a folder URL (GitHub Pages does all three).

## The two settings that decide every URL

| Setting | Where | Value now |
|---|---|---|
| Origin | `site` in `astro.config.mjs` **and** `url` in `src/lib/site.ts` (keep them equal) | `https://rafaelbragakribitz.com` |
| Base path | the `SITE_BASE` environment variable at build time (read by `astro.config.mjs` as `base`) | `/` (fixed in the workflow) |

The site is live on the custom domain (option 3 below, chosen 27 Oct
2026). Until then it was the project site
`https://rafaelbraga-kribitz.github.io/braga-portfolio-v2/`, which GitHub
now redirects to the domain.

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

## Option 3 · custom domain (in use)

`https://rafaelbragakribitz.com/`, registered at easyname.

- Set the origin in both places (`astro.config.mjs` `site`, `src/lib/site.ts`
  `url`).
- `SITE_BASE`: unset (`/`).
- Add `public/CNAME` containing the bare host name (`example.com`), and set
  the same domain under Settings → Pages → Custom domain; enforce HTTPS.
- Keep the user site or project site repository as it is: GitHub redirects
  the `github.io` address to the custom domain.

### DNS at easyname (domain `rafaelbragakribitz.com`)

easyname → Webhosting & Domains → the domain → DNS. Switch from
"automatisch" to manual records, keep the mail (MX, SPF) records, and set:

| Host | Type | Value |
|---|---|---|
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `@` | AAAA | `2606:50c0:8000::153` |
| `@` | AAAA | `2606:50c0:8001::153` |
| `@` | AAAA | `2606:50c0:8002::153` |
| `@` | AAAA | `2606:50c0:8003::153` |
| `www` | CNAME | `rafaelbraga-kribitz.github.io.` |
| `_github-pages-challenge-RafaelBraga-Kribitz` | TXT | the code GitHub shows (account Settings → Pages → Add a domain) |

Remove any other A, AAAA or CNAME record on `@` and `www` (easyname's
parking page). Then Settings → Pages → Custom domain:
`rafaelbragakribitz.com`, wait for the DNS check, tick **Enforce HTTPS**.

### Email

The published address (`email` in `src/lib/site.ts`, the Impressum,
privacy and accessibility notes, the About page) is
`hello@rafaelbragakribitz.com`. At easyname it is an alias (or a
forwarding) of the main mailbox `rafael@rafaelbragakribitz.com`; mail to it
lands in that mailbox or is forwarded to the owner's Gmail.

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
