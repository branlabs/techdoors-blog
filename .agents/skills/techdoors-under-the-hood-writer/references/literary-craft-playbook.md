# Literary craft playbook for technical nonfiction

The author admires J. K. Rowling's **narrative craft**: apparent normality disturbed by an anomaly, a controlled chain of clues, setup and payoff, lucid physical scenes, and revelations earned over time. Apply those **general storytelling techniques** to technology without replicating Rowling's voice or using recognizable imagery, phrases or character archetypes. TechDoors must sound original.

## 1. The ordinary world, then one odd fact

The reader recognizes the setting before the puzzle appears. A spare server, a file with a `.qcow2` suffix, a boot prompt, a network cable: ordinary, precise details carry more force than saying “something magical happened.”

**Weak:** “Nested virtualization is an exciting advanced technology.”

**Stronger direction:** “You are already inside an Ubuntu virtual machine. The prompt looks ordinary. Then you try to start yet another machine from there.”

This is a **hypothetical scene**, not a claim that the author already ran the lab.

## 2. Setup and payoff

Plant one detail whose importance changes after the explanation. Example: the CPU flag visible to the first guest appears unremarkable; later, when KVM inside that guest becomes possible, the reader realizes why the flag mattered.

A payoff must **explain** the planted clue, not merely mention it again. Don't hide the clue for dramatic effect when the missing information is operationally critical.

## 3. Make questions causal, not decorative

Every important question should be the logical consequence of the sentence before it, and the next section should earn an answer.

- **Seen:** A guest can boot another guest.
- **Asked:** Where does the second guest's CPU execution happen?
- **Discovered:** The physical CPU still executes instructions, with nested virtualization support exposed through the layers.
- **Follow-up:** How do we verify the path actually uses KVM rather than software-only QEMU?

Do not stack more than two large unanswered questions. Avoid repetitive “But wait...” and “What if...?” transition tricks.

## 4. Scene → mechanism → return to scene

A useful cycle for a dense concept:

- **Scene:** reader sees L2 start from inside L1.
- **Mechanism:** L0 CPU capability, guest exposure, KVM in L1, QEMU's device model.
- **Return:** L2's shell prompt now demonstrates an understandable relation between layers—not new hardware.

A scene is a **mental picture**, not necessarily a reported personal experience. Signal hypothetical/observed appropriately.

## 5. Rhythm is a tool, not a decoration

Use longer sentences to build a physical situation; shorter ones to register a turn. Let a complete technical explanation occupy a normal paragraph. Use whitespace thoughtfully. Avoid both 800-word walls and dozens of one-line dramatic fragments.

Subheadings may be plain and literary (“The CPU we never added”) if they clarify a long article; do not turn them into a formula.

## 6. A meaningful contrast is stronger than hype

Contrast: the guest *believes* it owns a CPU, while its instructions ultimately execute on the host's physical CPU. But be precise: “believes” is a metaphor, guest OS does not possess a mental state.

Keep image and mechanism clearly distinguished. Never personify a kernel or assert a process thinks or decides unless it is figurative and immediately grounded.

## 7. A quiet reframe

At the end, return to the same object or scene, but let it mean something new. The terminal was never magic; the physical CPU and hypervisor layers explain it. After the payoff, an optional next question can point to the next episode.

## 8. Example: a short opening direction for #02

*Original illustrative draft; describes a hypothetical situation, not a recorded lab run.*

> Một cửa sổ terminal đang mở trên Ubuntu. Bạn có thể cài phần mềm, tạo file, khởi động lại máy — mọi thứ trông bình thường đến mức chẳng có lý do gì để chú ý.
>
> Nhưng Ubuntu ấy không chạy trên một chiếc máy tính riêng. Nó đã là một máy ảo.
>
> Bây giờ, hãy thử đặt thêm một máy ảo vào bên trong nó. Không phải mở một cửa sổ từ máy chủ bên ngoài, mà thực sự để chính Ubuntu này khởi động một hệ điều hành khác.
>
> Nếu máy tính đầu tiên đã phải dùng nhờ CPU của máy chủ, chiếc máy tính thứ hai sẽ lấy CPU ở đâu?

The next passage should first clarify **which machine is doing the work**, not jump directly into provider configuration. Later sections must give the precise answer and address the difference between a QEMU-only guest and nested KVM acceleration.

## Anti-imitation check

Remove anything that evokes recognizable language, fantasy-world tropes, famous character dynamics or stylistic tics of any particular novelist. Keep only transferable craft: readable scenes, curiosity, clue placement, causal explanation, satisfying resolution.
