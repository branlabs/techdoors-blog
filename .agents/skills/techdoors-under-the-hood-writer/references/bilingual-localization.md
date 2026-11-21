# TechDoors bilingual transcreation checklist

## Preserve facts, change expression

Vietnamese and English are **editions of one story**. Preserve:

- Central question, setup, technical mechanism and final answer.
- Definitions, constraints and distinctions (including what is conceptual, expected and tested).
- Versions, actual commands and results when included; all numeric values and source references.
- Same diagram meaning and accessible alt text; identical blog slug/expected language links according to the repo's current conventions.
- Caveats that could change a reader's interpretation.

Do **not** require identical word order, sentence count, paragraph rhythm or translated idioms.

## Vietnamese editorial pass

Use clear, naturally spoken but polished Vietnamese. The scene should feel observed, not staged as marketing. Use words like “hóa ra”, “nhưng”, “liệu”, “bên dưới” sparingly at genuine turns. Avoid forced Sino-Vietnamese academic diction and repetitive “bạn có biết...” questions. Keep technical names and code intact; explain acronyms only when the story asks for them.

## English editorial pass

Write idiomatic, accessible US English. Prefer active verbs, restrained contractions, and clear subjects. Avoid literal Vietnamese expressions, excess suspense tropes (“little did you know”, “a hidden secret waited”), and grandiose “magic of innovation” language. Read it as an original English essay about engineering.

## Fact-ledger method

Before localizing, create a private table:

| Claim ID | Technical meaning | VI sentence/section | EN sentence/section | Verified? |
| --- | --- | --- | --- | --- |
| C1 | VM resources are derived from host resources | ... | ... | ... |
| C2 | QEMU CPU emulation is distinct from KVM acceleration | ... | ... | ... |

If one edition weakens or strengthens a claim, correct it. Example: “can run” is not interchangeable with “always runs.” A successful VM boot is not equivalent to proof that hardware nested virtualization was used.

## Article packaging

Check the current repo before editing. TechDoors #01 used:

- VI source: `blog/2026-11-13-chiec-may-tinh-vo-hinh/index.md`.
- EN source: `blog-en/2026-11-13-the-invisible-computer/index.md`.
- Both specify slug `the-invisible-computer`, frontmatter, metadata and `<!-- truncate -->`.

These are observed examples, not permission to assume future dates, slugs, authors/tags or automatic locale routing. Confirm links and build behavior before changing them. Keep diagrams and alt/captions accurate in each edition.
