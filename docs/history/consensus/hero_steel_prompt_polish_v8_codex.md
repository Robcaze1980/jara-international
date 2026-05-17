# Polish v8 — Surgical fix: single panel layer, edge terminates at W-beam centerline

**You are GPT-5.1 / Codex.** v7 produced a near-perfect image but Nano introduced a new failure: it rendered **two panels stacked on top of each other** at the visible edge near the W-beam, when it should be ONE single panel terminating precisely AT the centerline of the W-beam below.

This is the 8th iteration. Surgical fix only.

---

## What's working in v7 (do NOT change)

- ✅ Bar joists parallel, single direction, K-series with diagonal web members
- ✅ Joist seats on W-beam top flange (no clip-angles on web)
- ✅ Panel thickness paper-thin (plywood-like, not paver)
- ✅ Staggered brick-bond pattern in the background floor
- ✅ Sunny but cool-white lighting (no warm tones)
- ✅ No people, no debris
- ✅ Cool blue sky + cityscape through curtain wall

## The new v8 failure to fix

The image shows what looks like **two fiber-cement panels stacked vertically** (one on top of another) at the visible edge where the panel meets the W-beam. Plycem subfloor is **always installed as a single layer** — never doubled, never stacked, never overlapped.

Additionally, the panel edge does not appear to terminate AT the W-beam centerline. Per Plycem and standard structural practice:
- Panel short edges land precisely on the CENTERLINE of the supporting member (joist or W-beam)
- The supporting member is wider than the panel edge, so HALF of the member's top flange supports this panel, and the OTHER HALF would support the adjacent panel in the next bay
- Two adjacent panels meet AT the centerline, sharing the same support, never overlapping

In the v7 render, the panel appears to either:
- Cantilever past the W-beam (overhanging into open space), OR
- Have a second panel layered on top, creating a visual "double thickness"

Either failure is structurally wrong and breaks Plycem installation rules.

---

## v8 fix requirements

1. **Single layer only:** explicit language that the subfloor is exactly ONE panel deep at any given point — never stacked, never doubled, never two-layered. The total floor assembly is a single continuous sheet of panels, each panel being one slim board thick.

2. **Edge terminates at structural centerline:** the visible panel edge where it meets the W-beam must show the edge landing precisely on the centerline of the W-beam's top flange. Half of the W-beam top should be visible on the panel side; the other half is empty (where the adjacent-bay panel would go). NOT overhanging past the beam, NOT stopping short of the beam, NOT doubled with a second panel above.

3. **Reinforce in negative prompt:** explicit ban on "stacked panels", "double-layer panels", "panels overlapping", "doubled subfloor", "two-layer floor system".

## v7 prompt (the one to update)

**Positive:**
> Vertical 3:4 photoreal construction documentary scene of a Type I/II steel office tower floor mid-installation of ultra-thin fiber-cement sheet-good subfloor panels. Camera at 1.5 meters height, looking forward toward a curtain-wall facade with a clear bright blue sky and city skyline beyond. In the foreground, exposed open-web steel K-series bar joists run away from the camera in a single uniform direction, perfectly parallel to one another like railroad ties. The joists bear on the top flange of a deeper wide-flange W-beam via steel joist seats. Below the parallel joists is an open void showing the city far down through the framing. In the mid-ground, a rectangular 4x8 foot fiber-cement panel is partially seated; its long 8-foot dimension runs left-to-right across the frame, strictly perpendicular to the joists, visibly bridging across four parallel joists. The exposed leading edge of this panel reveals a paper-thin profile, visually matching the slim thickness of standard plywood, featuring a distinct protruding interlocking tongue. The background features a completed panel floor stretching to the windows, laid in a staggered half-offset brick-bond pattern to prevent continuous transverse joints. Crisp, bright sunny daylight with a cool-white color balance. Strong lateral side-lighting casts defined shadows across the steel trusses, strictly maintaining a cool neutral-gray palette without any warm or yellow tones. Architectural Digest style, completely unpopulated site.

**Negative:**
> NO people, NO workers, NO humans, NO figures, NO silhouettes. NO tools, NO debris, NO rubble. NO intersecting joists, NO diagonal joists, NO framing grid. NO concrete topping, NO poured slab, NO corrugated metal decking. NO thick panels, NO paver thickness, NO stone block profiles. NO aligned grid joints, NO continuous transverse joints, NO panels parallel to joists. NO warm light, NO yellow light, NO orange tones, NO golden hour, NO sunset, NO overcast sky.

---

## What I need from you

1. **v8 primary prompt** (positive + negative). Surgical addition of single-layer + centerline-termination instructions, preserving everything that worked.
2. **3-line rationale** explaining how you forced the single-layer constraint visually (the hardest one — Nano keeps stacking).
3. **One visual analogy** Nano will understand for the single-layer concept (similar to "railroad ties" working for parallel joists).

Begin.
