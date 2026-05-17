# Polish v3 — Surgical fix to joist depth and proportions

**You are GPT-5.1 / Codex.** Third iteration on the JARA hero image prompt. v2 fixed the open-void underneath and the clip-angle connections — but the latest generation shows another problem.

This is a tight correction. Do NOT rewrite the whole prompt. Inject a fix targeting joist depth.

---

## What's working from v2 (DO NOT change)

- ✅ Open void beneath joists — sky/glass visible through, no material attached below
- ✅ Clip angles / bolted plate connections where joists meet the perpendicular beam at the back
- ✅ Panels showing visible screws and seams forming a grid pattern
- ✅ Composition: low camera, foreground joists → mid-install transition → finished panel deck → curtain wall

## What's broken in the latest image

The joists look like **flat metal strips / shallow furring bars** — maybe 2-3 inches deep visually. They look decorative, not structural. A real Type I/II office floor system supporting a fiber-cement structural subfloor + finished floor + occupant live load needs joists that are **clearly deep and structurally substantial**.

Specifically:
- For 24-inch on-center spacing supporting Plycem 22 mm panels + finish + 100 psf live load on an office floor, joists would be approximately **10-14 inches deep** (open-web bar joists or C-channel)
- The visual signature of real structural joists includes: substantial depth, web openings (for bar joists) or solid C-shape with clearly visible flanges, much taller-than-wide profile
- In the failed image, the joists look almost flat — like ceiling furring channels, not floor joists

## The v3 correction

Inject into the steel framing description:

**"Joists are visibly DEEP and structurally substantial — approximately 12 inches deep (300 mm), clearly taller than wide, looking like real load-bearing floor joists, NOT shallow furring channels or flat decorative bars. Either open-web bar joists with visible diagonal web members or solid C-channel/I-section joists with prominent flanges. The structural depth is unmistakable in profile."**

Also add to exclusions:
**"NO shallow flat metal strips, NO decorative bar grilles, NO ceiling furring channels mistaken for floor joists."**

## Constraints on your output

- **One v3 primary prompt** integrating the depth fix into the v2 prompt. Surgical edit.
- **No fallback this time** — v2 fallback still valid for general retry.
- **Rationale ≤ 50 words** for how you placed the depth correction without bloating the prompt.

v2 prompt for reference (the one to surgically update):

```
Vertical 3:4 photoreal construction scene, camera at 1.5 m, showing a Type I/II steel office tower floor during installation of JARA High Performance Subfloor. Foreground: exposed flat-top steel joists running horizontally with NOTHING attached beneath them—open void below, no concrete pan or decking. Mid-ground: light-gray 4×8 ft fiber-cement panels, distinctly rectangular with a 1:2 aspect ratio, twice as long as wide, being screwed perpendicular onto the joists; seams and fasteners clearly visible, a few panels still lifted or partially seated. Panel edges align precisely over joist centerlines so adjacent panels share the same joist, with two parallel screw rows at each joint. Steel framing engineered correctly: parallel C-channel or open-web bar joists at 24 in. on center, realistic depth-to-span proportion, bearing on a deeper W-shape or HSS beam running perpendicular across the back; joist connections show clip angles or bolted plates. Background: finished area of the same panels forming a crisp rectangular grid of tongue-and-groove joints extending to curtain-wall glass with an overcast city skyline. Dry assembly only—no wet concrete, no topping slab—cool daylight, documentary architectural style.
```

Begin.
