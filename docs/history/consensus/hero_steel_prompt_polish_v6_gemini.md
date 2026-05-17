# Polish v6 — Two specific failures in v5 that need surgical fixes

**You are Gemini 3.1 Pro Preview.** v5 produced a richer image but two failures remain that Robert (JARA founder) flagged immediately. Both are common AI failure modes — Nano can't translate the v5 instructions to the actual render.

This is the 6th iteration. Be surgical.

---

## What worked in v5 (do NOT change)

- ✅ Beautiful cityscape through curtain wall, cool overcast light
- ✅ K-series open-web bar joists structurally substantial
- ✅ Panel grid visible on installed floor area
- ✅ Open void below joists (city visible far down)

## What FAILED in v5 — the two issues

### FAILURE 1: Steel framing geometry is structurally impossible

In the latest render, the bar joists appear at **multiple different angles** — some radiating diagonally, some perpendicular, some at random angles. In a real floor system, **ALL joists in a given bay run in the SAME direction, perfectly parallel to each other**, perpendicular to the supporting W-beam at one or both ends. There is no scenario in real engineering where joists radiate or go in multiple directions in a single floor bay.

The v5 prompt said "joists at 24-inch on-center spacing" but didn't enforce parallelism. Nano filled the visual space with structural elements without enforcing geometric alignment.

**v6 needs:** explicit, unambiguous instruction that all joists are perfectly parallel to each other, running in a single direction, like a wood floor sleeper system or like a row of railroad ties.

### FAILURE 2: Panel thickness STILL appears 2-3 inches

v5 said "thin, 1-inch-thick" and Nano still rendered the panel edge at 2-3 inches thick. Your own v5 tip noted that Nano ignores absolute measurements and needs RELATIVE / geometric language — but the v5 prompt still relied on the numerical "1-inch-thick" which Nano ignored.

**v6 needs:** geometric/relative descriptors that force Nano to render a paper-thin profile. Real Plycem subfloor at 22mm = 7/8 inch — about the thickness of:
- A piece of common 3/4-inch plywood
- A small stack of about 6 quarters
- A standard cement board sheet (NOT a paver, NOT a brick, NOT a concrete slab)

The current render makes the panel look like a **concrete paver** or **stone tile** — substantial in profile. We need the opposite: a board so thin it looks almost like a piece of plywood or thin sheet good, where the cut edge is barely visible against the camera angle.

### Bonus check: People / debris still appearing

Earlier negative prompt was strict. Latest render shows a small figure at bottom right + scattered tools/rubble. Either Nano is leaking, or "STRICT EXCLUSIONS" wording needs reinforcement.

---

## v5 prompt (the one being refined)

**Positive:**
> Vertical 3:4 photoreal construction documentary scene of a Type I/II steel office tower floor mid-installation of thin, 1-inch-thick fiber-cement structural subfloor panels. Camera at 1.5 meters height, looking forward toward a curtain-wall facade with an overcast city skyline beyond. In the foreground, a dense structural grid of exposed open-web steel K-series bar joists (12 inches deep) are tightly spaced exactly 24 inches apart. The joists bear on the top flange of a deeper wide-flange W-beam via steel joist seats. Below the joists is an open void showing the city far down through the grid. In the mid-ground, a 4x8 ft rectangular fiber-cement panel is partially seated perpendicular to the joists. The exposed leading edge of this panel clearly shows a slim 1-inch-thick profile with a precision-milled tongue-and-groove (T&G) edge, featuring a distinct protruding interlocking tongue. Panel edges align precisely over joist centerlines with two parallel rows of screws. The background features a completed panel floor stretching to the windows. Cool, neutral diffused daylight. Architectural Digest style, documentary realism.

**Negative:**
> NO people, NO workers, NO construction crew, NO hands, NO silhouettes. NO safety vests, NO hard hats, NO tools, NO loose equipment. NO concrete topping, NO poured slab, NO corrugated metal decking under the panels. NO thick panels, NO flat edges. NO logos, NO text, NO signage. NO warm sunset light, NO dramatic shadows.

---

## What I need from you

1. **v6 primary prompt** (single dense paragraph + separate negative). Surgical fixes for the two failures, no other changes.
2. **Specific Nano-parsing techniques** you used for each fix — explain the technique so we understand WHY it should work this time (≤ 50 words per fix).
3. **One nuclear-option line** to add to the negative prompt if v6 still leaks people/tools — the harshest possible exclusion language Nano respects.

Begin.
