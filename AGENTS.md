# blog-jon

Personal blog — Astro 6, Markdown content, static site.

## Commands

```sh
npm run dev       # dev server at localhost:4321
npm run build     # production build → dist/
npm run preview   # serve built output
npx astro ...     # any astro subcommand
```

No lint, test, or typecheck scripts configured.

## Content

Posts live in `src/content/posts/*.md`. Frontmatter schema
(`src/content.config.ts:6`):

```yaml
title: string (required)
subtitle: string (optional)
date: date   (optional, auto-stamped)
draft: bool  (default false)
```

- **Do not manually add `date`** — `scripts/stamp-date.mjs` auto-stamps it
  on first commit via a husky pre-commit hook. Editing the post later won't
  change the date.
- Drafts (`draft: true`) are visible in dev but hidden in production builds.

## Quirks

- `.astro/` (generated types) is gitignored. Run `npm run dev` or `npm run build`
  to create it.
- `dist/` is build output, gitignored.
- Markdown supports LaTeX via `remark-math` + `rehype-katex` (inline `$x$`,
  display `$$...$$`).
- Code blocks use Shiki dual themes: `github-light` / `github-dark`.
- Body font: IBM Plex Mono (UI). Post prose: Spectral (serif).
