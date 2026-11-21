# TechDoors Under the Hood Writer — v3 (purpose before mechanism)

An Agent Skill for writing **original literary technical nonfiction** in TechDoors' own voice. It develops the method already visible in *Chiếc máy tính vô hình / The Invisible Computer*: a tangible puzzle, controlled discovery, an accurate mechanism, and a satisfying payoff.

V3 adds a pre-draft check for who needs the mechanism, the obstacle they face, and what a simpler approach leaves unmet. The story starts with curiosity and reveals that need through the situation. The payoff is a change in the reader's understanding. The playbook uses general storytelling techniques in TechDoors' own voice.

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

Complete the **story card** before drafting. Share it for approval when the brief asks for an outline first, or use it privately when the author requests a reading draft. Draft Vietnamese, check the mechanism and evidence, and use the editorial rubric before delivery. Write a separate, idiomatic English edition when requested. Keep reading drafts in chat when requested and label experiments according to their actual evidence.

This style system is initially based on **one published article with two language editions**, not a large portfolio. Update it as more posts are approved.
