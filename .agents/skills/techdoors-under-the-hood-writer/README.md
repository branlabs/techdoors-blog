# TechDoors Under the Hood Writer — v2 (literary craft edition)

An Agent Skill for writing **original literary technical nonfiction** in TechDoors' own voice. It develops the method already visible in *Chiếc máy tính vô hình / The Invisible Computer*: a tangible puzzle, controlled discovery, an accurate mechanism, and a satisfying payoff.

This version adds a storytelling craft playbook inspired by general techniques of mystery-driven literary fiction, including techniques the author admires in J. K. Rowling's writing. It **does not instruct the agent to imitate her distinctive style or copy existing literary work**.

## Install into the TechDoors repository

Copy the folder `techdoors-under-the-hood-writer` (not just `SKILL.md`) into:

```text
techdoors-blog/.agents/skills/techdoors-under-the-hood-writer/
```

It is a repository-scoped Agent Skill. For Codex, reference `$techdoors-under-the-hood-writer` in the prompt. Other code agents can read `SKILL.md` explicitly if their skill discovery differs.

## Files

- `SKILL.md`: entrypoint, rules, writing and editing workflow.
- `references/style-dna-from-01.md`: article-based evidence for the voice.
- `references/literary-craft-playbook.md`: scene/foreshadowing/reveal/payoff techniques and short #02 example.
- `references/under-the-hood-02-brief.md`: nested-virtualization editorial/technical constraints, Terraform proof near the end.
- `references/bilingual-localization.md`: VI↔EN transcreation and repo packaging checks.
- `references/review-rubric.md`: objective acceptance gate for manuscripts.
- `PROMPT_FOR_AGENT.md`: ready-to-copy prompt for the next session.

## Usage

The agent should first offer a **story card** and outline, not jump directly into a long article. Once approved, draft Vietnamese, fact-check the mechanism, perform the literary editing pass, then write idiomatic English when requested. It must not fabricate experiments or merge/publish without explicit consent.

This style system is initially based on **one published article with two language editions**, not a large portfolio. Update it as more posts are approved.
