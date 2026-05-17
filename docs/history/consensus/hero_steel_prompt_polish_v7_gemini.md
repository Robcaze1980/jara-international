# Polish v7 — Fix panel-to-joist relationship per Plycem datasheet + switch to sunny lighting

**You are Gemini 3.1 Pro Preview.** v6 fixed the parallel-joists issue and the panel thickness improved. But Robert (JARA founder, real product expert) flagged that **the relationship between the subfloor panel and the steel framing still violates Plycem installation instructions**, AND he wants the lighting changed from overcast to sunny for a more vibrant photo.

Two fixes for v7.

---

## What v6 produced (latest image)

- ✅ All bar joists perfectly parallel, single direction (railroad-ties analogy worked)
- ✅ Open-web K-series bar joists structurally substantial, ~12" deep
- ✅ Open void below joists, city visible
- ✅ Curtain wall + cityscape gorgeous
- ✅ No people, no debris, no tools
- ✅ Panel thickness much improved (closer to plywood-thin)
- ⚠️ Lighting: overcast (per our previous instruction)
- ❌ Panel-to-joist relationship: violates Plycem installation rules

---

## Fix 1: Panel-to-steel relationship per Plycem datasheet

The Plycem **Entrepiso (Subfloor) installation datasheet** is explicit:

| Rule | Implication for the image |
|---|---|
| "Las láminas se colocan siempre con su dimensión larga en dirección PERPENDICULAR a la posición de las viguetas" | Panel long dimension (8 ft) MUST cross perpendicular to joist direction |
| "Nunca colocar la lámina en el mismo sentido de las vigas" | NEVER lay the panel parallel to joist direction |
| "Asegurarse que toda sección de lámina se fije en 3 apoyos, MÍNIMO" | Each panel rests on a MINIMUM of 3 joists. For a 4×8 ft panel with long-dimension perpendicular to joists @ 24" o.c., this means the 8 ft side crosses 4 joists |
| "Estas láminas se colocan en ubicación TRABADA para no tener juntas transversales continuas" | Panels in STAGGERED pattern — like brick courses, half-offset between rows. Never aligned in a continuous transverse-joint grid |

**The v6 image likely shows ONE of these failures:**
- The visible panel mid-install may be oriented with its long dimension parallel to joists (rotated 90° from correct) — only spans 1-2 joists instead of 4
- OR the completed floor in the background shows panels in an aligned grid (continuous transverse joints) instead of staggered courses
- OR the panel is bridging between W-beams instead of crossing joists

Diagnose which it most likely is from the description and fix in v7. The image showed: one panel placed at center between two visible bays, with most of the foreground showing bare joists running away from camera. The completed floor area in the background showed a clean rectangular grid pattern (which suggests NON-staggered, continuous joints).

The TWO most likely failures:
1. **Aligned grid (not staggered):** the background floor shows continuous transverse joints between panel courses. Real installation = staggered like brick laying.
2. **Single panel mid-install with unclear orientation:** the foreground panel doesn't clearly show its 8-ft long edge crossing 4 joists. Could be ambiguous or wrong-rotated.

**v7 needs:**
- Explicit STAGGERED PATTERN language for the background completed area (half-offset between courses, brick-bond pattern)
- Explicit CAMERA-RELATIVE direction for the mid-install panel: joists run AWAY from camera into depth; panel's long 8-ft dimension runs LEFT-TO-RIGHT across the frame, crossing 4 visible joists below it
- Reinforcement that the panel never runs parallel to joists

---

## Fix 2: Change lighting from overcast to sunny

Robert wants a more vibrant photo. Switch to **sunny day, clear bright sky, strong directional daylight**. Maintain cool color palette (no warm sunset tones — JARA brand still forbids warm/orange/red).

**Specifically:**
- Clear bright blue sky outside the curtain wall (replacing "overcast city skyline")
- Strong directional sunlight from one side (mid-morning or late afternoon, NOT high noon)
- Defined shadows on the structural framing (adds drama and depth, but not extreme)
- Sun position relative to camera: lateral side-lighting that picks up the texture of the bar joist trusses and the panel surface
- White color balance, NOT warm/yellow — feels like a crisp clear day, not golden hour

**Maintain:**
- Cool gray palette (no orange/yellow ground tones)
- No warm sunset/sunrise feel
- Architectural realism, not stylized

---

## v6 prompt (the one to update)

**Positive:**
> Vertical 3:4 photoreal construction documentary scene of a Type I/II steel office tower floor mid-installation of ultra-thin fiber-cement sheet-good subfloor panels. Camera at 1.5 meters height, looking forward toward a curtain-wall facade with an overcast city skyline beyond. In the foreground, exposed open-web steel K-series bar joists run in a single uniform direction, perfectly parallel to one another like railroad ties, spaced tightly apart. The joists bear on the top flange of a deeper wide-flange W-beam via steel joist seats. Below the parallel joists is an open void showing the city far down through the framing. In the mid-ground, a rectangular fiber-cement panel is partially seated perpendicular to the joists. The exposed leading edge of this panel reveals a paper-thin profile, visually matching the slim thickness of standard plywood rather than a thick concrete paver, featuring a distinct protruding interlocking tongue. Panel edges align precisely over joist centerlines with two parallel rows of screws. The background features a completed panel floor stretching to the windows. Cool, neutral diffused daylight. Architectural Digest style, documentary realism, completely unpopulated site.

**Negative:**
> NO people, NO workers, NO humans, NO figures, NO silhouettes. NO tools, NO debris, NO rubble, NO loose equipment. NO intersecting joists, NO diagonal joists, NO framing grid. NO concrete topping, NO poured slab, NO corrugated metal decking. NO thick panels, NO paver thickness, NO stone block profiles, NO slab edges. NO warm sunset light, NO dramatic shadows.

---

## What I need from you

1. **v7 primary prompt** (single dense paragraph + separate negative). Both fixes integrated surgically. Preserve every v6 win (parallel joists railroad-ties, paper-thin panel, joist seats on W-beam, completely unpopulated, etc.).
2. **Nano-parsing technique** for each fix (≤ 50 words each): how do we force Nano to (a) render a staggered/brick-bond panel pattern instead of aligned grid, and (b) render bright clear sunny daylight without slipping into warm golden-hour cast?
3. **Verification checklist** (5-6 items) for v7.

Begin.
