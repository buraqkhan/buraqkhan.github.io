# Portfolio — Technical Documentation

A minimal, static personal site with three sections — **Blog**, **Reading**, and
**Notes** — built with [Jekyll](https://jekyllrb.com/) and deployed to
**GitHub Pages** via GitHub Actions.

- [1. Overview](#1-overview)
- [2. Project structure](#2-project-structure)
- [3. How it works](#3-how-it-works)
- [4. Design system](#4-design-system)
- [5. Running locally](#5-running-locally)
- [6. Deploying to GitHub Pages](#6-deploying-to-github-pages)
- [7. Adding content](#7-adding-content)
- [8. Common customizations](#8-common-customizations)
- [9. Troubleshooting](#9-troubleshooting)

---

## 1. Overview

| Concern            | Choice                                                         |
| ------------------ | -------------------------------------------------------------- |
| Generator          | Jekyll 4.3 (Ruby). Markdown in, static HTML out.               |
| Hosting            | GitHub Pages (free, HTTPS, CDN).                               |
| Build / deploy     | GitHub Actions (`.github/workflows/pages.yml`) on push to `main`. |
| Styling            | One hand-written CSS file, no framework, no build step.        |
| JavaScript         | ~30 lines: dark-mode toggle + notes topic filter. Site works without JS. |
| Fonts              | Fraunces (display/headings), Inter (body), JetBrains Mono (code) via Google Fonts. |
| Plugins            | `jekyll-feed` (RSS at `/feed.xml`), `jekyll-seo-tag` (meta/OpenGraph), `jekyll-sitemap`. |

**Why Jekyll?** It's the generator GitHub Pages was built around, so adding a
blog post means adding one Markdown file and pushing. There's no
`node_modules`, no bundler, and no client-side framework.

**Why Actions instead of the classic "deploy from branch"?** The classic mode
pins you to an old Jekyll (3.x) and a fixed plugin allowlist. The Actions
workflow uses whatever is in the `Gemfile`, and it sets `baseurl`
automatically, so the same code works whether the repo is
`<user>.github.io` or a project repo like `<user>/portfolio`.

---

## 2. Project structure

```
.
├── _config.yml              # Site settings: name, tagline, links, nav, collections
├── Gemfile / Gemfile.lock   # Ruby dependencies (Jekyll + plugins)
├── .github/workflows/
│   └── pages.yml            # Build + deploy pipeline
│
├── index.html               # Home page (intro, projects, recent posts, currently reading)
├── blog/index.html          # Blog archive, grouped by year
├── reading/index.html       # Reading list, grouped by status
├── notes/index.html         # Notes index with topic filter chips
├── 404.html
│
├── _posts/                  # Blog posts:   YYYY-MM-DD-slug.md
├── _notes/                  # Notes:        slug.md  (a Jekyll "collection")
├── _data/
│   ├── reading.yml          # Books — edit this to update the Reading page
│   └── projects.yml         # Projects listed on the home page
│
├── _layouts/
│   ├── default.html         # HTML shell: <head>, header, footer
│   ├── page.html            # Generic page with prose styling
│   ├── list.html            # Index pages (blog/notes/reading), sans-serif lists
│   ├── post.html            # Blog post: date, read time, tags, prev/next
│   └── note.html            # Note: topic + date
├── _includes/
│   ├── head.html            # Fonts, CSS, theme bootstrapping, SEO + feed tags
│   ├── header.html          # Site title + nav (generated from _config.yml `nav`)
│   ├── footer.html          # Copyright + social links (from _config.yml)
│   └── post-list.html       # Reusable "title ........ date" list
│
└── assets/
    ├── css/main.css         # All styles
    ├── js/theme.js          # Theme toggle + notes filter
    └── favicon.svg
```

Files and folders starting with `_` are Jekyll inputs and never published as-is.
The build output goes to `_site/`, which is git-ignored.

---

## 3. How it works

### Content types

| Section | Source                | Mechanism                               | URL pattern                    |
| ------- | --------------------- | --------------------------------------- | ------------------------------ |
| Blog    | `_posts/*.md`         | Jekyll's built-in posts                 | `/blog/YYYY/MM/slug/`          |
| Notes   | `_notes/*.md`         | Custom collection (`collections:` in config) | `/notes/slug/`            |
| Reading | `_data/reading.yml`   | Data file rendered by `reading/index.html` | `/reading/`                 |

Layouts are assigned automatically through `defaults:` in `_config.yml`
(posts → `post`, notes → `note`, everything else → `page`), so content files
only need a `title` in their front matter.

### Navigation

The header is generated from the `nav:` list in `_config.yml`. The current
section is highlighted with `aria-current="page"`. Any URL under `/blog/`
(i.e. all posts) highlights "Blog", and the same goes for notes.

### URLs and `baseurl`

Internal links always go through the `relative_url` filter:

```liquid
<a href="{{ '/blog/' | relative_url }}">Blog</a>
```

That prepends `site.baseurl`. You don't set it by hand: the workflow passes
`--baseurl` from `actions/configure-pages`, which gives `""` for a
`<user>.github.io` repo and `"/<repo-name>"` for a project repo.
**Keep using `relative_url` in any template you add**, or links break on
project sites.

### Theming

- Colors are CSS custom properties on `:root`.
- Dark mode follows the OS (`prefers-color-scheme`) by default.
- The toggle button sets `data-theme="light|dark"` on `<html>` and saves it in
  `localStorage`. A tiny inline script in `head.html` re-applies the saved
  theme before the page paints, so there's no flash of the wrong theme.

---

## 4. Design system

All design tokens live at the top of `assets/css/main.css`:

```css
--bg, --fg, --ink-soft, --muted, --faint, --accent, --glow, --code-bg, --avatar-ring  /* colors (light + dark) */
--display, --sans, --mono                                          /* font stacks */
--measure: 40rem                                    /* content width */
```

- **Palette:** cream background (`#fcfaf4`) with a faint ember glow in the
  top-right corner, near-black ink (`#111111`) with neutral greys, and an
  ember-orange accent used for the uppercase section labels, the italic name on
  the home page, link hover, and the blockquote rule. Dark mode inverts to a
  near-black background with cream text.
- **Typography:** [Fraunces](https://fonts.google.com/specimen/Fraunces) at
  regular weight (400) with tight tracking (`-0.025em`) for the site name,
  headings, and list titles. Inter is the body text (about 17px with a 1.75
  line height). Section labels are Inter 11px semibold, uppercase, with
  `0.18em` tracking.
- **Profile photo:** `avatar:` in `_config.yml`. It shows as a 32px circle next
  to the name in the header and a 104px ringed circle beside the home intro.
  Remove the key to hide both.
- **Layout:** a single centered column, 40rem wide, with a 16px gutter on
  mobile.
- **Lists:** "title ........ date" rows separated by hairlines, used across
  the home, blog, and notes pages.
- **Code:** Rouge syntax highlighting with a small built-in palette (One
  Light/One Dark-ish) that adapts to the theme.

To change the look, edit the tokens first. Most of the site follows from them.

---

## 5. Running locally

You need Ruby **3.1+** with Bundler.

```bash
# Ubuntu / WSL
sudo apt install ruby-full build-essential zlib1g-dev
# macOS
brew install ruby

gem install bundler
```

**Or with conda (no sudo needed)**, which is how this machine is set up:

```bash
conda create -y -n jekyll -c conda-forge ruby=3.3 compilers make   # one time
conda activate jekyll
```

Then, from the project root:

```bash
bundle config set --local path vendor/bundle   # keep gems inside the project
bundle install
bundle exec jekyll serve --livereload
```

Open <http://localhost:4000>. Pages rebuild when you save, but changes to
`_config.yml` need a server restart.

Useful flags:

- `--drafts` also renders files in `_drafts/` (see below).
- `--future` renders posts dated in the future.
- `--baseurl /portfolio` simulates a project-site URL locally.

No Ruby? Use Docker:

```bash
docker run --rm -it -p 4000:4000 -v "$PWD":/srv/jekyll -w /srv/jekyll \
  ruby:3.3 bash -c "bundle install && bundle exec jekyll serve --host 0.0.0.0"
```

---

## 6. Deploying to GitHub Pages

### One-time setup

1. **Pick the repo name.**
   - `<username>.github.io` serves the site at `https://<username>.github.io/`
     (recommended for a personal site).
   - Any other name, e.g. `portfolio`, serves it at
     `https://<username>.github.io/portfolio/`.

2. **Edit `_config.yml`.** Set `url` to the origin (for example
   `https://<username>.github.io`), plus your name, tagline, and
   `github_username`. Leave `baseurl` empty.

3. **Create the repo on GitHub and push:**

   ```bash
   git init -b main
   git add .
   git commit -m "Initial site"
   git remote add origin git@github.com:<username>/<repo>.git
   git push -u origin main
   ```

   Or, with the GitHub CLI: `gh repo create <repo> --public --source=. --push`

4. **Turn on Pages with Actions.** In the repo, go to **Settings → Pages →
   Build and deployment → Source** and choose **GitHub Actions**.

5. **Watch the first deploy.** Open the **Actions** tab and wait for
   "Deploy to GitHub Pages" to go green (about a minute). The deploy job
   prints the live URL.

> Note: GitHub Pages on a free account requires a **public** repo. Private
> repos need GitHub Pro or higher.

### What the workflow does

`.github/workflows/pages.yml` runs on every push to `main`, and can also be
started manually from the Actions tab (`workflow_dispatch`).

1. **build:** checks out the repo, installs Ruby 3.3 and gems (cached),
   reads the Pages `base_path`, runs
   `jekyll build --baseurl <base_path>` with `JEKYLL_ENV=production`, then
   uploads `_site/` as a Pages artifact.
2. **deploy:** publishes that artifact with `actions/deploy-pages`.

### Custom domain (optional)

1. In **Settings → Pages → Custom domain**, enter e.g. `buraq.dev` and save.
2. At your DNS provider:
   - Apex domain: `A` records to `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153` (and optionally the matching
     `AAAA` records).
   - `www` subdomain: a `CNAME` to `<username>.github.io`.
3. Set `url: https://buraq.dev` in `_config.yml` and push.
4. Tick **Enforce HTTPS** once the certificate has been issued.

With the Actions deploy, the custom domain is stored in repo settings, so you
don't need a `CNAME` file.

---

## 7. Adding content

Everything is **add a file → commit → push**. The site redeploys automatically.

### New blog post

Create `_posts/YYYY-MM-DD-your-slug.md`:

~~~markdown
---
title: My new post
description: One-sentence summary (shown under the title, in RSS and link previews).
tags: [systems, rust]          # optional
---

Write in Markdown. **Bold**, _italic_, [links](https://example.com), lists, tables.

## Subheadings

```python
print("fenced code blocks get syntax highlighting")
```
~~~

- The date in the filename sets the post date and URL. Add `date: 2026-10-04 09:30`
  to front matter to set the time as well.
- Posts dated in the future are **not published** until a build runs after that
  date. Push again, or re-run the workflow, once the date has passed.
- **Images:** put them in `assets/img/` and reference them with
  `![Alt text]({{ '/assets/img/photo.jpg' | relative_url }})`.
- **Drafts:** put work in progress in `_drafts/your-slug.md` (no date in the
  filename). It isn't published. Preview it with `jekyll serve --drafts`. To
  publish, move it to `_posts/` with a date prefix.

### New note

Create `_notes/your-slug.md`:

```markdown
---
title: How to do X
topic: Linux           # becomes a filter chip on /notes/
date: 2026-10-04       # used for sorting (newest first)
---

Short content here.
```

Topics are collected automatically. A new `topic` value adds a new filter chip.

### Update the reading list

Edit `_data/reading.yml`:

```yaml
- title: Book Title
  author: Author Name
  status: reading        # reading | finished | queue
  finished: 2026-11-01   # optional, for finished books (sorted newest first)
  rating: 4              # optional, 1–5
  url: https://...       # optional link
  note: One-line takeaway.   # optional
```

When you finish a book, change `status` to `finished` and add `finished:`
and `rating:`. Books marked `reading` also show up on the home page.

### Projects on the home page

Edit `_data/projects.yml` (`name`, `url`, `description`). To hide the section,
delete every entry or delete the file.

### A new top-level page (e.g. "About" or "Uses")

1. Create `about.md`:
   ```markdown
   ---
   title: About
   permalink: /about/
   ---
   Content…
   ```
2. To put it in the header, add it to `nav:` in `_config.yml`:
   ```yaml
   - title: About
     url: /about/
   ```

---

## 8. Common customizations

| Want to…                         | Do this                                                        |
| -------------------------------- | -------------------------------------------------------------- |
| Change name, tagline, links      | `_config.yml`                                                  |
| Change profile photo             | Put a square image (≥ 256px) in `assets/img/`, e.g. `assets/img/me.jpg`, and set `avatar: /assets/img/me.jpg` in `_config.yml` |
| Change colors / fonts / width    | Tokens at the top of `assets/css/main.css`                     |
| Swap fonts                       | Update the Google Fonts `<link>` in `_includes/head.html` and `--display` / `--sans` in `main.css` |
| Change the home page intro text  | `index.html`                                                   |
| Change post URLs                 | `permalink:` in `_config.yml` (e.g. `/blog/:title/`). This breaks existing links. |
| Add comments                     | Drop a [giscus](https://giscus.app) `<script>` at the end of `_layouts/post.html` |
| Add analytics                    | Add a privacy-friendly script (e.g. GoatCounter, Plausible) to `_includes/head.html` |
| Social preview image             | Add `image: /assets/img/og.png` to `_config.yml`, or to a post's front matter |

### Updating dependencies

```bash
bundle update          # updates Gemfile.lock
bundle exec jekyll build
git commit -am "Update gems" && git push
```

---

## 9. Troubleshooting

| Symptom                                         | Fix                                                          |
| ----------------------------------------------- | ------------------------------------------------------------ |
| Site loads without styles / links 404 on a project site | A template uses a hard-coded `/path`. Use `{{ '/path' \| relative_url }}`. |
| Workflow fails at "deploy" with a permissions error | Settings → Pages → Source must be **GitHub Actions**.     |
| Workflow fails at `bundle install` with a platform error | Run `bundle lock --add-platform x86_64-linux` locally and commit `Gemfile.lock`. |
| New post doesn't show up                         | Check the filename (`YYYY-MM-DD-slug.md`), that the front matter has `---` lines, and that the date isn't in the future (UTC). |
| Liquid error on a page that contains `{{ }}` in a code sample | Wrap that block in `{% raw %}` … `{% endraw %}`.  |
| `jekyll serve` fails with "cannot load such file -- webrick" | Run `bundle install`. `webrick` is already in the Gemfile. |
| Changes to `_config.yml` don't appear locally    | Restart `jekyll serve`.                                     |
