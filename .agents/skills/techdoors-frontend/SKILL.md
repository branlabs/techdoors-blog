---
name: techdoors-frontend
description: 'Design, implement, or review TechDoors frontend changes in its Docusaurus blog. Use for layouts, components, typography, spacing, article readability, responsive behavior, accessibility, and light/dark styling. Do not use for prose-only post edits, backend work, CI/CD, hosting, or DNS.'
---

# TechDoors Frontend

Improve the requested interface while preserving TechDoors as a calm, minimalist engineering publication. Skill setup or invocation alone does not authorize a redesign. Keep unrelated pages and content unchanged.

## Read the relevant source first

Paths below refer to this repository, not the skill installation directory.

- Follow [AGENTS.md](../../../AGENTS.md). Inspect the affected component and its CSS Module before choosing an approach.
- Read [src/css/custom.css](../../../src/css/custom.css) for semantic color tokens, paired themes, locally hosted fonts, typography, and shared Docusaurus overrides.
- For page work, inspect `src/pages/` and the applicable overrides in `src/theme/`. For article work, inspect `src/theme/BlogPostItem/`, the Markdown styles, and a real post in `blog/`.
- Read `docusaurus.config.ts` when changing theme behavior or syntax highlighting. Home/recommendation data comes from `plugins/content.ts`; do not maintain a second post list.

## Editorial direction

- Preserve the existing paper-like light theme, restrained clay accent, quiet borders, and generous whitespace. Extend the current identity unless the user explicitly requests a different direction.
- Establish a clear progression: page heading, introduction, primary reading or browsing area, then supporting navigation. Use spacing and thin rules to separate sections; avoid repetitive card grids, dashboard chrome, oversized promotional blocks, and decorative noise.
- Avoid the default documentation-template appearance: dense sidebars, heavy category navigation, and indiscriminate Infima defaults. Keep useful Docusaurus behavior while composing an editorial layout.
- Reuse Be Vietnam Pro for Vietnamese prose and JetBrains Mono for code and restrained technical metadata. Keep fonts local and avoid introducing a new typeface without a design reason.
- Use a consistent spacing rhythm and fluid type scale. Keep metadata readable, heading line heights generous enough for Vietnamese diacritics, and alignment consistent across neighboring sections.
- Keep Vietnamese-first labels and truthful copy. Preserve clearly marked biography/project placeholders until the user supplies verified replacement content.

## Technical article readability

- Prioritize long-form reading: a comfortable prose measure, approximately 60–80 characters per line on wide screens, with a readable body size and relaxed line height. Let the actual font and content guide adjustments rather than forcing every region to the same width.
- Maintain clear heading levels and distinct spacing around paragraphs, lists, quotations, code blocks, images, and tables. Underline prose links; color alone must not identify them.
- Keep syntax colors legible in both themes. Preserve code titles, copy controls, reading time, tags, desktop TOC, mobile TOC, and related-content navigation when touching article layouts.
- Contain horizontal scrolling inside long code blocks or tables. Wrap long URLs and tag labels; never shrink the whole article or hide content to make it fit.
- Check a real technical article when shared styles change, including Vietnamese headings, inline code, lists, links, and a fenced code block. Use temporary fixtures for missing cases without publishing fictional posts.

## Docusaurus implementation

- Use React and strict TypeScript, CSS Modules for owned components, and `custom.css` for shared tokens or theme overrides. Prefer a narrow wrapper/override over copying a complete theme implementation.
- Keep static rendering safe: access browser APIs in effects or event handlers. Use `@theme/Layout` for page structure and `@docusaurus/Link` for site routes; preserve plain anchors for asset/feed URLs.
- Target owned classes or verified stable Docusaurus theme class names. Inspect the installed theme before writing selectors; do not guess class prefixes or depend on generated CSS hashes.
- Preserve canonical metadata, semantic landmarks, the skip link, valid heading structure, and existing content-plugin behavior. Never edit `build/`, `.docusaurus/`, or `node_modules/` as the implementation.

## Responsive, theme, and accessibility requirements

- Adapt the composition to its content rather than scaling down the desktop page. Preserve reading order, navigation, search, and controls on narrow screens, with no page-level horizontal overflow.
- Reuse `--td-paper`, `--td-surface`, `--td-ink`, `--td-muted`, `--td-line`, and `--td-accent`. If tokens change, review both `:root` and `[data-theme='dark']`; avoid light-only backgrounds or invisible dark-mode borders and focus states.
- Meet WCAG AA contrast: at least 4.5:1 for ordinary text and 3:1 for large text and essential UI boundaries. Use semantic buttons/links, labels, visible keyboard focus, and accessible names for icon-only controls. Never nest interactive controls.
- Keep controls comfortably tappable, targeting 44 CSS pixels where practical. Preserve keyboard operation and reduced-motion preferences; use subtle purposeful transitions rather than distracting animation.
- When changing search or dialogs, check initial focus, Tab/arrow-key navigation, Escape with a nonempty query, and focus restoration. Preserve the existing native-dialog approach unless the task requires a justified alternative.

## Verify and hand off

- Run checks required by `AGENTS.md`; `npm run verify` runs typecheck, production build, artifact/link checks, and the existing Playwright suite. Install locked dependencies or browsers only if missing.
- For visible UI changes, inspect a local production preview in light and dark mode on desktop and mobile. Include a small phone (320–390 px), a wide desktop (about 1440 px), and the breakpoints affected by the change. Existing Playwright projects cover 320, 390, 820, and 1440 px; add checks for other breakpoints affected by the change.
- Check keyboard use, overflow, contrast, console errors, and the affected article flow. Capture useful before/after screenshots when they help assess the change; state any browser or device verification limits.
- Report what changed, why, and what passed. Keep hosting, DNS, PR merges, and production deployment outside this skill's scope; they require a separate explicit request.
