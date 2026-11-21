# Under the Hood #02 — Máy ảo bên trong máy ảo

Status: **Editorial brief / technical proposal, not a claim that the lab has succeeded.**

Working Vietnamese title: **Máy ảo bên trong máy ảo**
Working English title: **A Virtual Machine Inside Another Virtual Machine**
Series: **Under the Hood #02**

## Reader-facing story promise

**Core question:** “If an Ubuntu computer is already virtual, where does it get the ability to run another virtual computer?”

**Aha:** A machine can be a guest of one hypervisor and run another hypervisor of its own. The engineer gains a separate place to make changes. Hardware acceleration still depends on what L0 exposes, and both guests draw on the same physical resources.

## The engineer's reason to nest

Picture an engineer on a shared Linux host with other workloads already running. They need to install QEMU/KVM, change a hypervisor setting, and observe what happens to a guest they control. Two Ubuntu guests directly on L0 would work if the goal were simply to run two Ubuntu systems. That arrangement would leave L0's shared hypervisor as the system under test.

Give the engineer an Ubuntu guest (L1) in which they control the virtualization stack. They can edit that stack's configuration and boot or restart its disposable guest (L2) without applying those changes to L0's hypervisor. L0 still supplies CPU, memory, storage, and network capacity. Resource contention and host-level configuration or failures remain possible. Establish this boundary in the story before presenting the lab.

## What the reader should understand without running code

1. L0 = physical host in this lab; L1 = guest that itself runs a hypervisor; L2 = guest running inside L1. These are layers, not three physical servers.
2. QEMU can emulate a machine in software; KVM acceleration within L1 depends on hardware/host/guest capabilities and configuration. The existence of L2 does not alone prove **nested KVM**.
3. **Hypervisor** names the role the engineer wants to control. Introduce it in 2–4 sentences when the choice of which layer to change becomes relevant. Skip Type 1 / Type 2 taxonomy.
4. The physical CPU and resources are still shared. Guest virtual CPUs and host CPU extensions must not be conflated.
5. A short, reproducible lab can test the explanation; Terraform is the method of reproduction, not the episode's protagonist.

## Suggested plot turns — not mandatory published headings

1. **Return to #01:** The Ubuntu guest is already running. Starting the next machine inside it seems like an unnecessary detour.
2. **Let the engineer's choice reveal the need:** Another guest on L0 is the simple answer for another workload. The engineer wants to change the virtualization stack that runs the guest, and L0 is shared.
3. **Find the place to make the change:** L1 can run a stack the engineer controls and give it a guest to manage. Name the hypervisor role and the L0 → L1 → L2 relationship here.
4. **Follow the work to the CPU:** QEMU can emulate a machine in L1. KVM acceleration requires nested support in L0 and the relevant CPU capabilities exposed to L1. Explain why L1's own hardware-accelerated boot does not establish that capability.
5. **Test the explanation near the end:** Describe the proposed lab and the runtime evidence that would distinguish KVM from emulation. Keep roughly **80% story and mechanism / 20% evidence** for this episode.
6. **Return to the opening choice:** The reader can now predict which hypervisor settings the engineer can change in L1, which guest they affect, and why L0 still matters.

## Lab architecture and scope

```text
L0 — one existing physical Linux node from the author's homelab
  QEMU/KVM/libvirt (host capabilities checked, no disruptive auto-tuning)
  └── L1 — Ubuntu guest provisioned by Terraform + cloud-init
        CPU virtualization extensions exposed if supported/configured
        QEMU/KVM/libvirt installed and validated
        └── L2 — small Ubuntu guest provisioned by Terraform/libvirt in L1
              Guest boot and active accelerator to be verified
```

OpenStack may exist elsewhere on the homelab or on this physical machine, but **OpenStack is deliberately out of the story and out of the provisioning stack**. Do not imply L0 runs no other workloads, and do not alter OpenStack networking, Nova, or storage to make the demo work.

## What an evidence section must actually verify

| Checkpoint | Minimum meaningful evidence | What it does **not** prove alone |
| --- | --- | --- |
| L0 preflight | CPU/KVM nested support, host config, free resources, absence of operational conflict | That L1 has the right features exposed |
| L1 created | QEMU/libvirt configuration and guest startup | That `/dev/kvm` works inside L1 |
| L1 hypervisor ready | L1 virtualization CPU flags, `/dev/kvm` access, correct runtime permissions, functioning KVM-capable hypervisor | That the L2 guest specifically ran with KVM acceleration |
| L2 running | Guest boot plus the active KVM accelerator reported by the QEMU instance running L2 inside L1 | That nested virtualization is efficient, secure for all workloads, or faster than emulation |

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
