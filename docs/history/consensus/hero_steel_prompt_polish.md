# Polish image-generation prompt — ChatGPT image gen targeting fiber-cement subfloor commercial install

**Type:** Single-model prompt-engineering consultation. Robert (JARA International founder) is using **ChatGPT's image generator** (currently DALL-E 3 / GPT-Image-1 / whatever ChatGPT routes to in May 2026) to generate a hero image for his B2B construction website.

**You are GPT-5.1 / Codex.** I'm asking you because you share architecture with the model behind ChatGPT's image generator and you'll write prompts it parses best. Give me a tight, optimized prompt — not a strategy essay.

---

## What we're trying to generate

A vertical (3:4 portrait, ~900×1200) hero image showing **JARA's High Performance Subfloor in a commercial Type I/II construction context**, mid-installation. The image is one panel of a hero triptych:

```
[ Aplicación 1: this image ]  [ Product close-up ]  [ Aplicación 2: wood-frame multifamily ]
```

The narrative this image carries: "Here's a US commercial Type I/II steel-and-concrete office tower, mid-construction, and JARA's fiber-cement subfloor panels are being installed RIGHT NOW on the steel joists — work in progress, telling the story that JARA is part of real US commercial construction."

## The specific PRODUCT being shown

JARA's High Performance Subfloor is a **DRY-ASSEMBLY** structural fiber-cement subfloor. Critical technical specs the image must respect:

- **Panels are screwed directly to steel joists.** The panels ARE the subfloor — no metal decking under them, no concrete topping over them.
- **Panel dimensions:** approximately 1200 mm × 2400 mm × 22 mm (≈ 4ft × 8ft × 7/8"). Discrete rectangular units, not a continuous surface.
- **Visible characteristic:** when fully installed, the deck shows a clean **rectangular grid pattern** of panel seams (T&G joints between adjacent panels).
- **Joists:** bare steel I-beams or C-channel light-gauge joists, **flat top surface**, ready to receive panels. NO corrugated metal deck on top of joists.
- **No poured concrete.** This is a dry assembly — competing systems use composite metal deck + poured concrete topping, and the image MUST NOT depict that competing system.

## What we tried first and what went wrong

**The prompt I gave Robert previously:**

```
Photorealistic architectural construction photography of a large
commercial office floor plate during mid-construction, Type I/II
steel-and-concrete building. The subfloor is being installed RIGHT
NOW — work in progress, not finished.

KEY SCENE COMPOSITION:
- Foreground (lower 30%): EXPOSED steel floor joists visible — parallel
  steel beams running left-to-right across the frame.
- Mid-ground (middle 40%): light-gray fiber-cement subfloor panels in
  mid-installation, two or three already placed across the steel joists.
  CRITICAL: panels must be oriented PERPENDICULAR to the steel joists
  below. Small Plycem screws visible at panel edges.
- Background (upper 30%): fully installed subfloor panel area — clean
  continuous gray floor deck stretching toward the back.
- Overhead: exposed steel I-beam structure, HVAC ducts, NO drop ceiling.
- Walls: floor-to-ceiling curtain wall windows installed, cool overcast
  daylight. City skyline faintly through the glass.

LIGHTING: cool overcast daylight. No warm sun.
STYLE: Architectural Digest meets construction documentary. Low camera
angle (~1.5m height), sharp focus on the transition zone.

STRICT EXCLUSIONS:
- No people, no logos, no signage, no text
- No bright colors, no warm sunset light

COLOR PALETTE: cool gray fiber-cement floor, blue-gray steel joists,
white columns, steel-blue overcast sky outside.
```

**What the AI actually produced (verified visually):**

- ✅ Beautiful composition, perfect light, perfect color palette, perfect cityscape, no people, no logos
- ❌ **Foreground:** corrugated metal decking (composite deck system) — NOT exposed steel joists
- ❌ **Background floor:** continuous monolithic concrete slab with NO visible panel seams — looks like poured concrete topping, NOT fiber-cement panels
- ❌ **Net result:** the image depicts the COMPETING construction system (composite metal deck + poured concrete topping), not JARA's dry-assembly fiber-cement subfloor

A B2B specifier looking at this image immediately sees "concrete-on-steel-deck" instead of "fiber-cement panel subfloor." This is a positioning failure even though the image is visually stunning.

## What I need from you

Rewrite the prompt to maximize the probability that ChatGPT's image generator produces a technically accurate image. Specifically:

1. **Eliminate corrugated metal decking from the result.** The AI defaults to it because composite deck is the most common search-result image for "commercial steel framing floor." Force it away.
2. **Get visible rectangular panel seams on the installed floor surface.** The grid pattern is the visual signature of the product. Without it, the floor looks like concrete.
3. **Keep the composition I already nailed:** exposed joists in foreground → mid-install transition → finished panel deck in background → city through windows.
4. **Stay within ChatGPT image-gen's strengths and limits.** Avoid prompt patterns that the model handles poorly (e.g., overly nested constraints, multi-paragraph technical specs that get truncated). Optimize for the model's actual parsing behavior.
5. **Add 1-2 fallback phrasings** Robert can try if the first generation still produces metal decking or concrete slab.

Constraints on your output:
- **One primary prompt**, ready to paste into ChatGPT verbatim.
- **2 short alternative prompts** for retry if the primary fails.
- **3-line "what to verify in the result"** checklist for Robert to check the image is accurate before accepting.
- **Brief rationale (≤ 100 words)** for the key prompt-engineering moves you made — so I understand and can iterate.

Begin.
