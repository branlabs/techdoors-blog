# Literary craft playbook for technical nonfiction

The author admires J. K. Rowling's **narrative craft**: apparent normality disturbed by an anomaly, a controlled chain of clues, setup and payoff, lucid physical scenes, and revelations earned over time. Apply those **general storytelling techniques** to technology without replicating Rowling's voice or using recognizable imagery, phrases or character archetypes. TechDoors must sound original.

## 1. The ordinary world, then one odd fact

Give the reader something familiar to picture and one reason to look closer. Hold filenames, commands, and settings until the reader understands the decision they affect.

Before committing to a scene, name the person, their task, and the ordinary way they would do it. Then ask what that option leaves outside their control. If the simpler route meets the need, let it win and narrow the story to the case where the mechanism earns its place. A modest operational constraint often supplies all the tension the story needs.

## 2. Setup and payoff

Set up an expectation the reader can revise. For #02, adding another guest seems like the obvious move until the engineer needs to change the system that manages the guest. The reveal changes which layer the reader would choose to work in.

A physical detail can carry the setup if it matters to the explanation. To test the payoff, remove the repeated name or image and ask what the reader now understands. State operational prerequisites as soon as they bear on a decision.

## 3. Make questions causal, not decorative

Check each transition by asking what in the previous action, finding, or constraint makes the next beat necessary. For #02, the engineer wants to change a hypervisor setting. Two guests on the shared host would still leave the system under test on that host. A guest with its own hypervisor gives the engineer a place to make the change, which raises a concrete question about where that guest gets hardware virtualization support.

Write some transitions as consequences or decisions so the prose can move without another rhetorical question. Delay a technical answer until its question matters, while giving the reader the facts needed to follow the scene.

## 4. Scene → mechanism → return to scene

A useful cycle for a dense concept:

- **Scene:** an engineer wants to change how a machine starts without experimenting on the shared host's hypervisor.
- **Mechanism:** L1 can manage L2 and use KVM if L0 exposes the necessary CPU capability.
- **Return:** the reader can now place the setting, the guest it affects, and the physical resources both still share.

A scene is a **mental picture**, not necessarily a reported personal experience. Signal hypothetical/observed appropriately.

## 5. Rhythm is a tool, not a decoration

Use longer sentences to build a physical situation; shorter ones to register a turn. Let a complete technical explanation occupy a normal paragraph. Use whitespace thoughtfully. Avoid both 800-word walls and dozens of one-line dramatic fragments.

Subheadings may be plain and literary (“The CPU we never added”) if they clarify a long article; do not turn them into a formula.

## 6. A meaningful contrast is stronger than hype

Contrast: the guest *believes* it owns a CPU, while its instructions ultimately execute on the host's physical CPU. But be precise: “believes” is a metaphor, guest OS does not possess a mental state.

Keep image and mechanism clearly distinguished. Never personify a kernel or assert a process thinks or decides unless it is figurative and immediately grounded.

## 7. A quiet reframe

At the end, let a concrete consequence show how the opening situation now makes sense. Sometimes the strongest ending is a decision the reader could not have made at the start. A recurring image or a question for the next episode is optional.

## 8. Example: a short opening direction for #02

*Original illustrative draft; describes a hypothetical situation, not a recorded lab run.*

> Chiếc Ubuntu của kỳ trước vẫn đang chạy. Nếu cần thêm một chiếc nữa, chỗ quen thuộc để tạo nó là máy chủ ngoài kia. Vậy tại sao có người lại muốn khởi động nó từ bên trong Ubuntu?
>
> Hãy hình dung người đó đang thử cách máy chủ cấp tài nguyên cho máy ảo. Thêm một chiếc Ubuntu thì dễ. Cái khó là tìm một nơi có thể thay đổi chính phần mềm cấp tài nguyên ấy, trong khi máy chủ còn đang phục vụ những việc khác.

The next beat can show where that change belongs. The need to run the experiment from inside the first guest gives the reader a reason to discover what L0 must expose and how KVM differs from software emulation.

## Anti-imitation check

Remove anything that evokes recognizable language, fantasy-world tropes, famous character dynamics or stylistic tics of any particular novelist. Keep only transferable craft: readable scenes, curiosity, clue placement, causal explanation, satisfying resolution.
