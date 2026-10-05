# Portfolio

A minimal personal site with **Blog**, **Reading**, and **Notes**, built with Jekyll and deployed to GitHub Pages.

```bash
bundle install
bundle exec jekyll serve --livereload   # http://localhost:4000
```

- New blog post: add `_posts/YYYY-MM-DD-slug.md`
- New note: add `_notes/slug.md` (with `topic:` and `date:`)
- Reading list: edit `_data/reading.yml`
- Site settings: `_config.yml`

Push to `main` to deploy. See **[DOCS.md](DOCS.md)** for architecture, deployment setup, and the full content guide.
