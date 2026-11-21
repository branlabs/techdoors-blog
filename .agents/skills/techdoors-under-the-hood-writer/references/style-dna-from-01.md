# Voice evidence — Under the Hood #01

## Primary reference files

- Vietnamese: `blog/2026-11-13-chiec-may-tinh-vo-hinh/index.md` in TechDoors, published at `https://techdoors.io/blog/the-invisible-computer/`.
- English: `blog-en/2026-11-13-the-invisible-computer/index.md`, published at `https://techdoors.io/en/blog/the-invisible-computer/`.
- They are **two language editions of the same story**. One article is too small a sample to infer an unchanging house style. Refine this profile as the author approves more articles.

## What the actual article does

| Observed feature | Evidence from #01 | Transferable principle (not a phrase to copy) |
| --- | --- | --- |
| Familiar impossibility | The opening describes a computer created without another motherboard, RAM stick, or processor. | Begin with a concrete expectation being quietly contradicted. |
| The reader witnesses the scene | The reader looks around the room and notices only a window with another OS. | Ground abstraction in something observable. |
| The first name arrives after the experience | QEMU is named after the virtual machine scene. | Earn a technical term before defining it. |
| A question sharpens the mystery | “Nhưng còn CPU thì sao?” / “But what about the CPU?” | Turn to a new layer only when the last one raises a real problem. |
| One bounded analogy | CPU emulation is briefly compared with an interpreter between languages. | A simple bridge works; then return to the mechanism. |
| The reveal is technical, not mystical | KVM and hardware virtualization explain efficient CPU execution. | Let the actual engineering resolve the puzzle. |
| Diagram appears after the roles are explained | The QEMU/KVM diagram follows the distinction between the tools. | Place visuals at a knowledge transition, not just at the top. |
| The ending reframes and opens | No physical resources were added; a question asks whether the VM could make another VM. | Close the current mystery and seed a legitimate next one. |

## Narrative rhythm

The opening moves from vivid scene to specific hardware. The central paragraphs are short-to-medium and mostly uninterrupted by subheadings. Questions occur at turning points; they don't replace explanation. Explanations are detailed enough to distinguish QEMU's role from KVM's, but not weighed down by deployment tools.

There is **no evidence** in #01 that every TechDoors post should have zero subheadings, one rhetorical-question opening, the interpreter analogy, or an identical ending. Those are observations about this post, not universal rules.

## Bilingual voice

- **VI:** natural, direct, lightly conversational without slang overkill; a question can be short and colloquial, while technical terms remain exact.
- **EN:** fluent and calm, neither a sentence-by-sentence literal translation nor an overwrought science-fiction monologue.
- Both follow the same knowledge journey and make the same technical claims. Their rhythm is allowed to differ.

## Distill into a voice statement

> A curious engineer notices something ordinary behaving in a surprising way, follows the question down through successive layers, and returns with a precise explanation that makes the original sight newly meaningful.

Use this as the **north star**, not as an opening paragraph to copy.
