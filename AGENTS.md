# Project conventions

- Docusaurus 3, React, strict TypeScript. Use CSS Modules for components and `src/css/custom.css` for shared tokens/theme overrides.
- For frontend UI/UX changes or visual reviews, use `$techdoors-frontend` at [`.agents/skills/techdoors-frontend/SKILL.md`](.agents/skills/techdoors-frontend/SKILL.md). It does not apply to prose-only post edits or deployment work.
- Vietnamese first; keep copy clear and factual. About and Projects placeholders must remain visibly labeled until supplied with verified content.
- Write posts in `blog/YYYY-MM-DD-slug/index.md` or `.mdx`. Copy `templates/blog-post.md`, declare authors/tags in YAML, and include `<!-- truncate -->`.
- Home/recommendations derive from the blog plugin through `plugins/content.ts`; never duplicate post data. Avoid hand-editing generated files.
- Preserve semantic HTML, keyboard navigation, visible focus, reduced motion, readable contrast and mobile layouts. Keep assets/fonts local.
- Use Node 24 and `npm ci`. Before a PR run `npm run typecheck`, `npm run build`, `npm run check:site`, and `npm run test:e2e` (install Chromium once).
- No backend, database, paid integrations, analytics, secrets, or fabricated claims. Keep `package-lock.json` committed and review security overrides when upgrading.
- Work on feature branches and open a PR to `main`. Do not merge, change DNS, enable Pages, or deploy production without owner approval. Preserve the opt-in deployment gate and environment review described in `docs/deployment.md`.
