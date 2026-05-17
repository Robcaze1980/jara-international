# Polish v2 — Refine ChatGPT image-gen prompt to fix 4 specific technical errors

**You are GPT-5.1 / Codex.** Robert (JARA International founder) generated a very good hero image with your previous prompt — but a real construction professional spotted 4 specific technical inaccuracies. We need to fix them in the next generation.

This is iteration v2. Don't redesign the prompt — surgically address the 4 corrections while keeping everything that worked.

---

## The previous prompt that already worked well

```
Vertical 3:4 photoreal construction scene, camera at 1.5 m, showing 
a Type I/II steel office tower floor during installation of JARA 
High Performance Subfloor. Foreground: exposed flat-top steel joists 
running horizontally, NO corrugated metal deck, workers absent. 
Mid-ground: light-gray 4×8 ft fiber-cement panels being screwed 
perpendicular onto the joists, seams and fasteners clearly visible, 
a few panels still lifted or partially seated. Background: finished 
area of the same panels forming a crisp rectangular grid of 
tongue-and-groove joints extending to curtain-wall glass with an 
overcast city skyline. Dry assembly only — no wet concrete, no 
topping slab — cool daylight, documentary architectural style.
```

It produced an image with: ✅ exposed flat-top steel joists, ✅ panels mid-install, ✅ visible seams and screws, ✅ curtain-wall + skyline, ✅ overcast light, ✅ no people, ✅ no concrete topping.

But 4 errors remain. Fix them.

---

## The 4 corrections needed

### Error #1: There is material attached UNDER the steel joists

In the previous image, something dark (looks like concrete substrate or another deck) is visible beneath the joists. **The joists must be cleanly exposed with nothing under them** — pure structural framing, looking through to the floor below (or showing empty open space below the joist tops). This is what construction-in-progress actually looks like at the upper-floor decking stage: the joists span between the structural beams and there's open void below them, not another surface.

**Add to prompt:** explicit instruction that nothing is fastened or attached beneath the joists; the underside of the floor framing is open, no concrete pan, no decking, no continuous surface below the joists.

### Error #2: Panels rendered as SQUARES; Plycem panels are RECTANGULAR

Plycem fiber-cement subfloor panels are **1220 mm × 2440 mm** (4 ft × 8 ft) — a **1:2 ratio**. The previous image rendered them as roughly square, which is wrong for the product. Real panels are visibly elongated — twice as long as they are wide.

**Add to prompt:** explicit "1:2 aspect ratio rectangles, twice as long as wide, 4 ft × 8 ft, distinctly elongated NOT square."

### Error #3: Panel alignment vs joist centerline

In real installation, **each panel edge lands on the centerline of a joist** so two adjacent panels share fastening into the same joist below. The previous image showed panels placed somewhat randomly relative to joists.

**Add to prompt:** "Panel edges align precisely along the centerline of the steel joists beneath. Adjacent panels share the same supporting joist at their joining edge. Two parallel rows of screws visible along each joint, one from each adjacent panel."

### Error #4: Steel framing looks AI-fantasy, not real engineering

In a real Type I/II commercial floor system, steel joists are not just floating parallel bars. They:
- Rest on **structural beams** (deeper W-shape or HSS beams running perpendicular to joists at the ends)
- Joists are at consistent **on-center spacing** — for Plycem subfloor on 22 mm panels with 3 supports per 8-ft panel, that's roughly **24 inches (610 mm) on center**
- Joists have **realistic depth-to-span proportions** — for a 24" o.c. typical span, joists would be ~10-12" deep C-channel or open-web bar joists
- At joist ends or splices, you'd see **clip angles, bolted connections, or weld marks** — not just bars sitting on nothing

**Add to prompt:** "Steel framing engineered correctly: parallel C-channel or open-web bar joists at 24 inches on center, supported by a deeper W-shape or HSS structural beam running perpendicular across the back of the visible joist span. Joist connections to beams show realistic clip angles or bolted plates. Joist depth proportional to span. The system must read as built by a real structural engineer, not an AI guess."

---

## Constraints on your output

- **One updated primary prompt**, paste-ready for ChatGPT.
- **Keep what worked** in the previous version (composition, lighting, palette, camera position, no people, no logos, dry-assembly emphasis, curtain wall + city skyline).
- **Surgically integrate the 4 corrections** above. Make the additions tight, not verbose.
- **1 fallback prompt** that re-emphasizes the most-likely-to-be-missed corrections (probably #2 panel rectangles and #4 realistic framing).
- **Brief rationale (≤ 80 words)** for how you integrated each correction so I can iterate later.

Begin.
