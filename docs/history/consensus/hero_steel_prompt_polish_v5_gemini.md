# Polish v5 — Engineering accuracy review + prompt refinement for Nano (Gemini Imagen)

**You are Gemini 3.1 Pro Preview.** Robert (JARA International founder) is using Nano (your sibling image-generation model) to generate a hero image for his B2B fiber-cement subfloor distributor website. We've iterated 4 versions of the prompt — Nano is now producing structurally substantial open-web bar joists (which ChatGPT couldn't do), but three new issues need addressing.

I'm consulting you specifically because:
1. You may understand Nano's parsing better than other models.
2. You should have current engineering knowledge to verify whether the structural framing shown is realistic for the application.

---

## The current state — what the latest Nano generation produced

Image shows:
- **Foreground:** Open-web steel bar joists with diagonal web members, taking up the lower 60% of the frame. K-series-style bar joist profile (top chord + bottom chord + diagonal/vertical web members). One central wide-flange (W-shape) beam runs perpendicular across the middle, with the bar joists bearing on top of it via apparent clip-angle / bolted connections.
- **Mid-ground:** Fiber-cement subfloor panels installed in a transition zone. One panel is shown leading-edge-out, in the middle of being placed perpendicular to the bar joists below.
- **Background:** Fully completed panel deck stretching to a curtain-wall corner showing a skyscraper city skyline. Cool overcast light.
- **Below joists:** Open void — city visible far down through the steel structure. No people, no logos, no concrete topping. ✅
- **Panel grid:** Visible rectangular seams, screws at edges, panels appearing roughly 1:2 ratio.

This is the strongest result we've had. But Robert (who has actual product / construction expertise) flagged 3 issues:

---

## The 3 issues to fix in v5

### Issue 1: Panel thickness appears 2-3 inches — too thick

The Plycem High Performance Subfloor panel is actually **20-30 mm thick (0.8 to 1.2 inches)**. In the rendered image, the edge of the panel being placed (visible at the transition zone) appears to show a profile depth of **2-3 inches** — about 2-3× too thick.

This is a visual signature B2B specifiers will notice. A 3-inch-thick subfloor doesn't exist in fiber-cement and would be wildly overweight. The image must show a clearly thin panel — under 1 inch visible at the cut edge.

**Refinement needed in prompt:** explicitly specify panel thickness, with reinforcement that the cut edge visible at the leading panel must show a slim profile, NOT a thick block.

### Issue 2: Add visible tongue-and-groove (T&G) profile at the panel's leading edge

The version of Plycem subfloor being marketed in this hero is the **machihembrado** (tongue-and-groove) variant. The T&G edge profile is the product's visual signature — the panel edge has a precision-milled tongue on one side and a matching groove on the other, allowing panels to interlock without a longitudinal support piece.

The current image shows a flat-edged panel. We need the leading edge (the one mid-installation, visible to the camera) to clearly show the **tongue profile** — a stepped/cut edge revealing the interlocking geometry. This is critical because T&G is the product's premium feature; it's why specifiers choose Plycem over generic flat-edge cement boards.

**Refinement needed:** add explicit language describing the T&G edge profile visible on the panel being placed, including the milled tongue extending out from the panel body.

### Issue 3: Engineering accuracy check — is the steel framing realistic for this application?

The image shows:
- K-series open-web bar joists (looks like ~12" deep)
- Bearing on a wide-flange beam running perpendicular
- The joists in the visible foreground appear at **a fairly wide spacing** — possibly 36-48" o.c., not the 24" o.c. we specified

For Plycem 22 mm fiber-cement subfloor in a Type I/II commercial office floor:
- Plycem datasheet requires panel sections rest on **minimum 3 supports** with panel length **>61 cm**
- Panels are 1220 × 2440 mm (4×8 ft)
- If panels span perpendicular to joists with the 8 ft (2440 mm) dimension crossing joists, joist spacing should be **24 inches o.c.** to give 4 supports per panel
- 36-48" o.c. spacing only gives 2-3 supports across an 8 ft panel — undersupplied per the Plycem spec

**Verify and advise:**
1. Is K-series bar joist + W-shape beam framing realistic for this floor system, or should it be a different framing type (e.g., light-gauge cold-formed C-channel for shorter spans, or LH-series for deeper spans)?
2. Is 24" o.c. joist spacing visible in the image (or does the image show wider spacing)?
3. If wider, how do we re-prompt Nano to render the correct spacing?
4. Are the clip-angle connections at the bearing point depicted correctly for bar joists on a W-beam?

---

## The current Nano prompt (v4 — the one that produced the recent image)

```
Vertical 3:4 photoreal construction documentary scene of a Type I/II 
steel office tower floor mid-installation of fiber-cement structural 
subfloor panels. Camera at 1.5 meters height, looking forward toward 
a curtain-wall facade with an overcast city skyline beyond.

Foreground: a transition zone where exposed open-web steel bar joists 
are visible with diagonal web members between top and bottom chords, 
approximately 12 inches deep, at 24-inch on-center spacing. The joists 
bear on a deeper wide-flange (W-shape) beam at the back, with realistic 
bolted clip-angle connections. NOTHING is attached beneath the joists 
— open void below showing the city far down through the structural 
grid.

Mid-ground: light-gray fiber-cement subfloor panels, distinctly 
rectangular at 1:2 aspect ratio (4 ft × 8 ft), being placed 
perpendicular to the joists. Panel edges align precisely over joist 
centerlines, with two parallel rows of screw heads visible at each 
joint. One or two panels still lifted or partially seated, showing 
the work in progress.

Background: a fully completed area of the same panels stretching to 
the curtain-wall windows — a clean rectangular grid of tongue-and-groove 
joints. Behind the glass, an overcast city skyline.

Lighting: cool, neutral diffused daylight. Architectural Digest style, 
documentary realism.

STRICT EXCLUSIONS:
- NO people, NO workers, NO construction crew, NO hands, NO arms, 
  NO silhouettes of humans anywhere in the frame.
- NO safety vests, NO hard hats, NO tools on the floor, NO power drills, 
  NO measuring tape, NO loose equipment.
- NO concrete topping, NO poured slab, NO corrugated metal decking 
  under the panels.
- NO logos, NO text, NO signage, NO company branding.
- NO warm sunset light, NO dramatic shadows.

Empty, calm, professional construction scene — material and structure 
only.
```

---

## What I need from you

1. **Engineering verification** (≤ 120 words): Is the K-series bar joist + W-beam framing correct for Plycem 22mm subfloor at 24" o.c. spacing in a Type I/II commercial office floor? If yes, confirm and identify which spec details to preserve in v5. If no, name the correct framing system to specify instead.

2. **v5 primary prompt** (single paragraph, paste-ready for Nano): incorporate the three issue fixes (panel thickness, T&G profile visible, framing accuracy) into the v4 prompt. Surgical edits — preserve everything that worked (composition, lighting, no-people, no-concrete, curtain wall, cityscape).

3. **Nano-specific prompting tips** (3-4 bullet points): based on your understanding of Nano's parsing, what specifically helps Nano render dimensional accuracy (e.g., visible thickness of materials)? What confuses it?

4. **Verification checklist** (5-6 items): what should Robert look for in the next render to confirm v5 worked.

Begin.
