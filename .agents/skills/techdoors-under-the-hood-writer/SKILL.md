---
name: techdoors-under-the-hood-writer
description: Plan, draft, edit, and transcreate literary yet technically rigorous TechDoors Under the Hood stories in Vietnamese and English. Use when writing narrative explanations of Linux, virtualization, cloud, networking, and infrastructure concepts or preparing the accompanying evidence/lab section; not for generic how-to guides, API documentation, runbooks, marketing, or unrelated fiction.
---

# TechDoors — Under the Hood | Narrative technical writing

## Purpose

Write a **story of discovery about a real technical mechanism**, not a textbook chapter disguised with colorful adjectives. A newcomer should finish thinking: *“So that is what is really happening underneath.”*

The author wants to learn from the **craft** of literary mystery and discovery—including broad narrative techniques they admire in J. K. Rowling's storytelling—while developing **TechDoors' own original prose voice**. Borrow craft principles (careful setup and payoff, deliberate revelation, an observable world, narrative tension); **do not mimic any novelist's distinctive diction, recognizable narrative voice, phrasing, characters, motifs, or prose**. There is no magic in place of technical explanation. The real mechanism supplies the wonder.

**Priority order:** actual user brief and constraints → repository `AGENTS.md`/site conventions → published TechDoors article(s) as voice references → authoritative technical sources → this skill's flexible heuristics. If facts or instructions conflict, call it out; don't silently invent a resolution.

## Read only the references the task needs

- Always use `references/style-dna-from-01.md` for the evidence-backed voice profile. Read the actual published source when access is possible: VI `https://techdoors.io/blog/the-invisible-computer/` and EN `https://techdoors.io/en/blog/the-invisible-computer/` (one bilingual work, **not** two different samples).
- Use `references/literary-craft-playbook.md` when planning the story and performing the literary edit.
- Use `references/bilingual-localization.md` when preparing both languages.
- For Under the Hood #02 (nested virtualization), **must** read `references/under-the-hood-02-brief.md`.
- Use `references/review-rubric.md` before submitting or publishing a draft.

## Narrative contract: purpose before mechanism

Before drafting, answer these in a private story card or a proposal when requested:

1. **Observation and question:** What does the reader witness that makes them curious?
2. **Need:** Who would actually need this, and what are they trying to do?
3. **Obstacle:** What gets in their way?
4. **Simpler option:** What would they normally do, and what requirement would that option leave unmet?
5. **Mechanism:** Which technical capability addresses that gap, under what conditions, and what evidence can distinguish it from other explanations?
6. **Change in understanding:** What can the reader explain or predict after the reveal?

If the purpose, obstacle, or simpler option feels contrived, revise the situation before writing prose. These questions guide the writer. Let curiosity open the story, let actions disclose the practical need, and let the obstacle create a reason to discover the mechanism. Keep the published prose free of a mandatory Problem → Solution → Benefits outline.

## Literary craft adapted to infrastructure

### The opening: something ordinary, slightly impossible

Open with a specific and understandable situation. Establish what the reader sees, expects, and finds puzzling. An ordinary server or a familiar screen can be enough. Introduce a term, filename, configuration detail, or command only after the reader knows why it matters.

Introduce **one** central mystery rather than spraying questions. A good hook creates curiosity *without claiming anything impossible actually occurred*. No fictional benchmark, real server state, successful test, or dialogue unless provided by the user or explicitly labeled as imagined.

### Controlled revelations: let concepts earn their entrance

Guide readers from **observation → question → practical need → obstacle → mechanism → changed understanding**. Let each answer make the next uncertainty more specific. Reveal enough for the reader to follow the decision at hand, and introduce deeper detail when it explains a consequence. Introduce jargon at the moment it solves a real uncertainty. A term can receive one accurate, plain-language introduction and then be used normally; avoid glossary detours. Do not use “to understand X, first we must understand Y” as the default transition.

Setup can be an expectation, decision, or constraint. A recurring object or phrase is optional. Payoff comes from changing what the reader understands about the opening situation. Never hide a required prerequisite just to create suspense.

### Narration at human scale

Let readers observe actions: a machine boots; the cursor moves; a disk image appears; the first prompt responds. **Then** zoom down to the systems beneath. Return to the observable world after a difficult explanation, so the reader can connect mechanism to experience.

Write with natural variation: a longer descriptive paragraph can lead into a short, pointed sentence; a measured explanatory paragraph can end with a useful question. Short standalone lines are occasional turning points, not the entire page. Use the second person (`bạn`/`you`) only when it helps the reader inhabit a scene.

### Earn the reveal and close the loop

The most important revelation should answer or reframe the opening question. After giving the answer, show **what has changed in the reader's understanding**. A return to the opening scene can help if the reader can now explain a result or make a different choice. End quietly, not with “technology is magic” or “the possibilities are endless.” A natural unanswered question may link to the next Under the Hood episode; avoid a formulaic cliffhanger in every post.

### Analogies as temporary scaffolding

Use an analogy only if it clarifies a specific mechanism. Name the exact correspondence, then identify where the analogy **stops** applying. Return promptly to actual system names, responsibilities, and data/control paths. One accurate analogy is better than three impressive but imprecise ones. Do not recycle #01's CPU interpreter analogy as a signature gimmick.

## Original TechDoors voice

- **Calm, observant, a little cinematic:** curiosity is more powerful than hype.
- **Literary but concrete:** prefer verbs, physical details, causal turns, and subtext over ornamental adjectives or forced mystery.
- **Warm without acting clever:** write for a beginner without talking down; experts should still trust the technical claims.
- **Precise when it matters:** complexity is allowed when an inaccurate simplification would mislead.
- **Mostly continuous prose:** add a few narrative headings only when useful. Do not force numbered chapters, tables, lists, FAQ, or a glossary into the finished story.
- **One diagram when useful:** add it where it resolves a specific spatial/conceptual confusion, not as decoration. Use meaningful alt text and distinguish conceptual diagrams from observed architectures.

Remember: #01's rhythm is a reference, **not a reusable sentence template**. Choose the situation and pacing that fit each article's question. Do not start every episode with “Have you ever imagined...?” or end every episode with the same “the story is not over” line.

## Technical truth is part of the story

- Check claims against primary documentation or actual measurements. Distinguish what **can** happen, what **usually** happens, what **is configured**, and what **was observed**.
- Do not claim a command succeeded, a VM booted, an environment supports nested KVM, a performance improvement was measured, or a diagram matches reality without evidence.
- State mechanism and limits: QEMU emulation is not KVM acceleration; QEMU, KVM, libvirt and Terraform have distinct jobs; virtual resources don't create physical capacity.
- When a caveat matters to the thesis, place it in the prose rather than burying it in a footnote. A well-timed constraint often creates better narrative tension than a grand metaphor.
- The experiment must test the central technical claim, not merely show attractive terminal output. Explain **what evidence demonstrates**, and what it **cannot** establish.
- Keep production/homelab safety intact: scripts must not silently mutate hypervisor modules, storage, networks, or existing workloads. Seek approval for disruptive changes.

## Evidence is a supporting character, not the plot

For conceptual Under the Hood stories, put full Terraform/cloud-init/Ansible/scripts, dependency pinning and troubleshooting in a separate repo/README. Near the end of the article, present a short experiment as proof: **hypothesis → setup → critical observation → interpretation → limitation**. If the experiment is not yet executed, say *“we can test this by...”* rather than reporting a success.

## Bilingual publishing: transcreation, not line-by-line translation

Default first draft to Vietnamese unless the user specifies otherwise. Write natural, independent VI and EN editorial passes preserving the same factual claims, conditions, examples, images, caveats and outcome. English should sound idiomatic in US English; Vietnamese should be polished, conversational, and native, not stilted or translated word for word. Technical terms stay consistent. Follow `references/bilingual-localization.md`.

## Agent workflow

1. **Inspect** the relevant article(s), actual repo conventions and user brief. For a TechDoors repo task, inspect `AGENTS.md`, frontmatter, existing blog paths, assets, language routing, and checks. Never assume paths from this skill supersede the current repo.
2. **Complete the purpose-before-mechanism story card** using the six questions above. Record the anticipated evidence and its status. Present the card and wait only when the brief asks to approve an outline first. For an authorized reading draft, use the card privately and deliver in the requested medium.
3. **Outline the turns of discovery.** Show why each action or finding motivates the next. Decide when the reader needs the simpler option, the central explanation, and the evidence.
4. **Draft the story** using specific physical details and controlled reveals. Avoid inventing autobiographical experience or conversations. Use a diagram only when it helps.
5. **Technical truth pass**: verify each essential claim, analogy boundaries and prerequisites; label hypothetical vs measured facts; check source and configuration specifics. Resolve inconsistencies before polishing literary language.
6. **Literary revision**: remove generic prose, strengthen transitions, shorten overexplained passages, vary sentence length, test whether the reveal answers or reframes the opening question, and keep recurring details only when they help that change land. Check for accidental imitation of the novelist or the #01 article.
7. **Localize** into the second language only when requested; compare a claim-by-claim fact ledger across editions.
8. **Package** to match repo conventions. Separate companion code/README from the editorial post. Run applicable formatting, build/link and browser checks if repository files changed; report checks that were not run.
9. **Deliver for review**: article/outline, an ultra-short “reader learns” statement, technical verification notes and unresolved claims. **Never merge, publish, deploy, or make disruptive infrastructure changes without explicit authorization.**

## Fast rejection criteria

Revise before submitting if any of the following is true:

- A reader cannot state the core question after the opening.
- The opening leads with incidental implementation details or the first third reads mainly as definitions.
- The example exists mainly to showcase the technology, or the story cannot name the requirement a simpler option leaves unmet.
- The story uses long stretches of rhetorical questions with no new information.
- An analogy contradicts the real mechanism or keeps going after it stops helping.
- A “magical” tone substitutes for causal explanation.
- A fabricated measurement, log, command result, or first-hand experience is presented as real.
- Terraform instructions dominate a nested-virtualization story meant to explain nested virtualization.
- The ending leaves the opening question unanswered, or relies on a callback alone for its payoff.
- Both languages are literal copies rather than individually natural versions.
- Any passage sounds like a particular novelist instead of TechDoors' own voice.

**Editorial north star:** The story should be interesting because the engineering truth is interesting. Literary craft controls **when and how** the truth becomes visible; it never replaces the truth.
