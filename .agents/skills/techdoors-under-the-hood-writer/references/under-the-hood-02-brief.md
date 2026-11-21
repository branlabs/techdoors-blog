# Under the Hood #02 — Máy ảo bên trong máy ảo

Status: **Editorial brief / technical proposal, not a claim that the lab has succeeded.**

Working Vietnamese title: **Máy ảo bên trong máy ảo**
Working English title: **A Virtual Machine Inside Another Virtual Machine**
Series: **Under the Hood #02**

## Reader-facing story promise

**Core question:** “If an Ubuntu computer is already virtual, where does it get the ability to run another virtual computer?”

**Aha:** An L1 guest may act as a hypervisor if the underlying L0 can support and expose the necessary hardware virtualization features. Both levels ultimately share physical resources; creating L2 never creates another physical CPU.

## What the reader should understand without running code

1. L0 = physical host in this lab; L1 = guest that itself runs a hypervisor; L2 = guest running inside L1. These are layers, not three physical servers.
2. QEMU can emulate a machine in software; KVM acceleration within L1 depends on hardware/host/guest capabilities and configuration. The existence of L2 does not alone prove **nested KVM**.
3. **Hypervisor** is the name for the virtualization role the reader has already seen in #01. Introduce it gently in 2–4 sentences when needed, then return to the nested question. Avoid diverting into an entire Type 1 / Type 2 taxonomy.
4. The physical CPU and resources are still shared. Guest virtual CPUs and host CPU extensions must not be conflated.
5. A short, reproducible lab can test the explanation; Terraform is the method of reproduction, not the episode's protagonist.

## Suggested plot turns — not mandatory published headings

1. **Return to the scene:** A seemingly ordinary Ubuntu VM from #01. The reader now tries to create another VM *inside it*.
2. **The contradiction:** There is no new physical CPU or separate computer. How can this guest become the place another guest runs?
3. **The first clue:** Introduce hypervisor in plain language and separate creating a virtual computer from receiving the host's ability to accelerate execution.
4. **The layered reveal:** Explain L0 → L1 → L2 visually and trace CPU execution back toward physical hardware.
5. **The missing ingredient:** Why L1 does not always have KVM, how exposing CPU virtualization features matters, and why QEMU software emulation is a different possibility.
6. **The proof near the end:** A safe preflight, reproducible L1 and L2 creation, clear checks and observation. The user suggested roughly **80% conceptual storytelling / 20% proof** as an editorial balance for this episode only.
7. **The reframe:** Return to the original question; the machine did not gain new silicon, it was given a capability. A possible bridge to #03: what happens when a VM boots?

## Lab architecture and scope

```text
L0 — one existing physical Linux node from the author's homelab
  QEMU/KVM/libvirt (host capabilities checked, no disruptive auto-tuning)
  └── L1 — Ubuntu guest provisioned by Terraform + cloud-init
        CPU virtualization extensions exposed if supported/configured
        QEMU/KVM/libvirt installed and validated
        └── L2 — small Ubuntu guest provisioned by Terraform/libvirt in L1
              Booted Linux, inspected and verified
```

OpenStack may exist elsewhere on the homelab or on this physical machine, but **OpenStack is deliberately out of the story and out of the provisioning stack**. Do not imply L0 runs no other workloads, and do not alter OpenStack networking, Nova, or storage to make the demo work.

## What an evidence section must actually verify

| Checkpoint | Minimum meaningful evidence | What it does **not** prove alone |
| --- | --- | --- |
| L0 preflight | CPU/KVM nested support, host config, free resources, absence of operational conflict | That L1 has the right features exposed |
| L1 created | QEMU/libvirt configuration and guest startup | That `/dev/kvm` works inside L1 |
| L1 hypervisor ready | L1 virtualization CPU flags, `/dev/kvm` access, correct runtime permissions, functioning KVM-capable hypervisor | That the L2 guest specifically ran with KVM acceleration |
| L2 created | Guest boot, OS reachable, hypervisor mode/configuration and runtime evidence in L1 | That nested virtualization is efficient, secure for all workloads, or faster than emulation |

Do **not** write that the lab “proved nested KVM” based on a boot screenshot alone. Identify how the runtime backend was selected and used. Keep logs or evidence if available; label expected output as **expected**, not **observed**.

## IaC source layout — a proposal, not a required implementation

```text
under-the-hood-02/
  terraform/l1/          # Terraform root module on L0
  terraform/l2/          # Terraform root module executed within L1
  cloud-init/l1.yaml
  cloud-init/l2.yaml
  scripts/preflight-l0.sh
  scripts/preflight-l1.sh
  scripts/verify-l2.sh
  Makefile
  README.md
```

Keep state/secrets separate for L1 and L2, configure SSH identities safely, and check actual libvirt provider support/version instead of assuming the proposed layout automatically works. If host/guest networking or credentials are unresolved, mark the plan incomplete rather than assert a one-command success.

## Homelab safety gates

- L0 preflight must be **read-only** by default. Never silently reload/unload KVM modules, rewrite GRUB, reboot, alter libvirt/Nova configuration, or change production bridges.
- Nested support cannot be “turned on” solely from inside L1 if L0 has not exposed the prerequisite capabilities. If missing, stop and document the requirement.
- Keep ownership/state/storage/network boundaries clear so the lab does not collide with existing instances.
- Before `terraform destroy`, make clear which resources it will remove, and never destroy unmanaged resources.
- The author must approve disruptive infra changes separately; approval to write an article or lab code does **not** approve running it on real servers.

## What *not* to turn the article into

- A comparison of Terraform providers.
- An OpenStack tutorial.
- A long deep dive on hypervisor classifications.
- A speculative claim about benchmark performance.
- A success story with fabricated `/dev/kvm` output or invented screenshots.

The published article must remain meaningful if a reader never opens the GitHub repo. The code is a reproducible appendix to the intellectual discovery.
