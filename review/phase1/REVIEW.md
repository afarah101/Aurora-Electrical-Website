# Phase 1 review: hero prototypes A, B, C

Branch `redesign/phase-1-prototypes`, reviewed at `1b53156`. Review only. No prototype code changed.

## Recommendation

**Use B (Editorial split).** Text never sits on video. The call button and all proof lines are above the fold at 375, 768, 1024 and 1440px and in phone landscape. B is the only variant with no variant-specific FAIL.

- A is a close second. It fails Apple (full-viewport moving video) and it puts the proof row at the fold (`A-375.png`, `A-1440.png`).
- C is out. Impeccable bans its nested card. Its call button falls below the fold in phone landscape.

## How to read the table

- **PASS** = no ban and no must-have item in that skill's checklist is broken. Warnings go in "Fixes".
- **FAIL** = a ban or must-have item is broken. Each FAIL names `file:line` or a screenshot.
- "soft-skill" = `high-end-visual-design` (no folder named soft-skill exists; this is the "soft contrast" style skill).
- A, B and C share `Headline`, `Actions`, `Proof` and `RISE` from `components/prototype/HeroA.tsx`. A finding in that code applies to all three.
- Harness artefacts in every screenshot: the variant nav (69px tall at ≥768px, 121px at 375px) and the Next.js dev badge ("N", bottom-left).

## Skills × variants

| Skill | A — Lower third | B — Editorial split | C — Proof card |
| --- | --- | --- | --- |
| prototype | FAIL — picker is not the PICKER.md spec: top bar in project tokens, no keys, no replay (`app/prototype/hero/page.tsx:89-114`). It takes layout space and pushes the hero down (`A-375.png`). | FAIL — same picker (`app/prototype/hero/page.tsx:89-114`). Variant itself works, 0 console errors. | FAIL — same picker (`app/prototype/hero/page.tsx:89-114`). Also weak divergence from A: same section and scrim (`HeroC.tsx:12-17` = `HeroA.tsx:128-133`). |
| emil-design-eng | PASS — custom ease-out (`HeroA.tsx:22`), press scale 0.97 at 160ms (`HeroA.tsx:23`), no scale(0), no ease-in. Warn: hover colour change has no transition (`HeroA.tsx:49,64`). | PASS — same shared motion. | PASS — same shared motion. |
| review-animations | PASS — **APPROVE**. See verdicts below. | PASS — **APPROVE**. | PASS — **APPROVE**. |
| find-animation-opportunities | PASS — 1 opportunity: colour transition on CTA hover (`HeroA.tsx:49,64`). | PASS — same 1 opportunity. | PASS — same 1 opportunity. |
| apple-design | FAIL — full-viewport moving video behind the headline (§14 "avoid full-viewport moving backgrounds"), `HeroA.tsx:129`, `A-1440.png`. | PASS — video is framed, not full-viewport (`HeroB.tsx:21-25`, `B-1440.png`). Press feedback on pointer-down, tight display leading. | FAIL — same full-viewport moving video (`HeroC.tsx:13`, `C-1440.png`). |
| frontend-design | PASS — real footage as thesis, deliberate pair (Archivo wide + IBM Plex Sans, `page.tsx:16-20`), no fake numbering. | PASS — same. Info: 4-line headline with "electrics" alone at 1024px (`B-1024.png`). | PASS — same as A. |
| impeccable | PASS — detector: 0 findings. Contrast: white headline 10.68:1 worst sampled pixel (375px). No eyebrow, no gradient text, no glass. | PASS — detector: 0 findings. Text on solid slate-950 (18.40:1). | FAIL — nested card is a ban ("nested cards are always wrong"), `HeroC.tsx:28-31`. Card radius 20px > 12–16px floor (`HeroC.tsx:29`). Detector: 0 findings. |
| high-end-visual-design (soft-skill) | FAIL — banned standard Lucide icons at default stroke (`HeroA.tsx:1,56,97,107,113`). Banned 1px grey border (`HeroA.tsx:146`). Instant hover state (`HeroA.tsx:49,64`). | FAIL — same icons and hover. Banned 1px grey border on media frame (`HeroB.tsx:22`). | FAIL — same icons and hover. 1px grey border on card (`HeroC.tsx:29`). Only variant with the Double-Bezel. |
| ui-ux-pro-max | FAIL — autoplay loop > 5s with no pause control (WCAG 2.2.2), `components/HeroBackground.tsx:56-61`. Targets OK: CTAs 48px tall. No horizontal scroll at all widths. | FAIL — same autoplay loop, no pause (`components/HeroBackground.tsx:56-61`). All else passes, landscape included. | FAIL — same autoplay loop. Also call button below fold in phone landscape: bottom at 397px on a 375px-tall viewport (`HeroC.tsx:18`). |

### review-animations verdicts

All three use the same motion code, so the verdict is the same. No block trigger is present: no `ease-in`, no `scale(0)`, no layout-property animation, no animation on a keyboard or high-frequency action.

- **A — APPROVE.** Note: the full-bleed loop runs behind the headline (`HeroA.tsx:129`).
- **B — APPROVE.** Cleanest: moving video is kept away from text (`HeroB.tsx:21-25`).
- **C — APPROVE.** Same note as A (`HeroC.tsx:13`).

| Before | After | Why |
| --- | --- | --- |
| `hover:bg-action-hover` with `transition-transform` only (`HeroA.tsx:49,64`) | `transition-[transform,background-color] duration-[160ms]` | Colour snaps today; hover colour should ease |
| `[animation-delay:120ms]`, `240ms` (`HeroA.tsx:142,146`) | 60ms steps: `0 / 60 / 120ms` | Group stagger belongs in 30–80ms |
| Same 160ms on press and release (`HeroA.tsx:23`) | Press 160ms, release ~100ms | Deliberate press slower, response snaps |
| `motion-reduce:animate-none` (`HeroA.tsx:27`) | Keep a 200ms opacity fade, drop the 16px rise | Reduced motion = gentler, not zero |
| Group-hover arrow nudge gated by `(hover: hover)` only (`HeroA.tsx:57`) | Gate with `(hover: hover) and (pointer: fine)` | Tailwind v4 adds only `(hover: hover)` (checked in compiled CSS) |

The 900ms hero rise is above the 300ms UI budget. The reason is written down (`app/globals.css:32-38`: marketing moment), so it is allowed.

### ui-ux-pro-max Pre-Delivery Checklist (web, applied per variant)

Search run: `"hero video background contrast" --domain ux` (3 results: contrast 4.5:1, readability, auto-play video).

| Item | A | B | C |
| --- | --- | --- | --- |
| Tested at 375px | ✓ `A-375.png` | ✓ `B-375.png` | ✓ `C-375.png` |
| Landscape (812×375) — call button visible | ✓ bottom 334px* | ✓ bottom 270px* | ✗ bottom 397px* (`HeroC.tsx:18`) |
| Reduced motion | ✓ animation `none`, video paused (measured) | ✓ | ✓ |
| Dark-mode contrast | ✓ 10.68:1 worst | ✓ 18.40:1 | ✓ 11.05:1 worst, card 16.28:1 |
| Touch targets ≥ 44px | ✓ 48px | ✓ 48px | ✓ 48px |
| No emoji icons, one icon family | ✓ Lucide | ✓ | ✓ |
| Press state does not shift layout | ✓ `scale` transform | ✓ | ✓ |
| Semantic colour tokens only | ✗ raw `slate-*` (`HeroA.tsx:64,88,113,128,132`) | ✗ (`HeroB.tsx:10,22`) | ✗ (`HeroC.tsx:16,29,31`) |
| Focus order = visual order | ✓ | ✓ copy before media | ✓ actions before card |
| Disabled states / gestures | n/a | n/a | n/a |
| Dynamic Type / text zoom | not run | not run | not run |

\* Measured at 812×375 with the 69px variant nav removed from the number, so it matches production.

## Impeccable detector

`npx impeccable detect` v4.9.1 returned `[]` (0 findings) for `?v=A`, `?v=B` and `?v=C`, and for `components/prototype` + `app/prototype/hero`. A control file with gradient text and a side-tab border did trigger findings, so the detector runs.

## Fixes before phase 2

### Critical

1. **Add a pause control to the hero video** (all variants and the live site). It loops > 5s with no pause, which fails WCAG 2.2.2. `components/HeroBackground.tsx:56-61`. Reduced motion alone does not satisfy 2.2.2.
2. **C only:** call button below the fold in phone landscape (`HeroC.tsx:18`). Not needed if B is chosen.

### Warning

3. Hero height ignores any header above it. `min-h-svh` pushes the proof row or CTA to or past the fold (`HeroA.tsx:134`, `HeroC.tsx:18`; see `A-375.png`, `A-1440.png`, `C-1440.png`). Subtract the real header height in phase 2.
4. soft-skill bans: set Lucide `strokeWidth={1.5}` (or Phosphor Light) at `HeroA.tsx:56,97,107,113`. Replace 1px grey borders at `HeroA.tsx:146`, `HeroB.tsx:22`, `HeroC.tsx:29` with a tinted hairline or none.
5. Add a colour transition to CTA hover (`HeroA.tsx:49,64`).
6. Map `slate-*` utilities to semantic tokens (`HeroA.tsx:64,88,113,128,132`; `HeroB.tsx:10,22`; `HeroC.tsx:16,29,31`).
7. The h1 starts at opacity 0 for up to 900ms (`HeroA.tsx:27`, `app/globals.css:38-41`). This can delay LCP. Animate only the rise on the h1, or keep it static and animate actions and proof.
8. Replace the harness picker with the PICKER.md spec, if more rounds run (`app/prototype/hero/page.tsx:89-114`).

### Info

9. Stagger steps of 120ms are above 30–80ms (`HeroA.tsx:142,146`; `HeroB.tsx:17,19,22`).
10. Hover arrow gated by `(hover: hover)` only, not `(pointer: fine)` (`HeroA.tsx:57`).
11. Press and release use the same 160ms (`HeroA.tsx:23`).
12. Reduced motion drops the fade too (`HeroA.tsx:27`).
13. B at 1024px: headline wraps to 4 lines with "electrics" alone (`B-1024.png`). Use `lg:text-5xl xl:text-6xl` at `HeroB.tsx:13`.
14. Button radius 20px is neither a pill nor 12–16px (`HeroA.tsx:49,64`).
15. Poster is JPG; WebP/AVIF is smaller (`components/HeroBackground.tsx:62`).
16. Headline copy is a draft. Mohamed must approve it (`app/prototype/hero/page.tsx:55`).

## Where two skills disagree

Rule used: soft-skill sets the style. Impeccable filters it. Motion skills own timing. Accessibility rules are not style, so they are kept.

| Topic | Skill 1 says | Skill 2 says | Winner |
| --- | --- | --- | --- |
| Nested card | soft-skill: every major container is a Double-Bezel (shell + core) | Impeccable: nested cards are always wrong | **Impeccable** (filter). C's card goes. |
| Eyebrow above H1 | soft-skill: pill eyebrow tag above headings | Impeccable: eyebrow is a ban, no brief earns it back | **Impeccable**. All variants already omit it. |
| Icons | soft-skill: no standard Lucide, ultra-light lines only | Impeccable / ui-ux-pro-max: any one consistent library is fine | **soft-skill** (style; Impeccable does not filter it). Use 1.5 stroke. |
| Entrance duration | soft-skill: 800ms+ fade-up on entry | emil / review-animations: UI under 300ms, marketing may be longer | **Motion skills**. 900ms is kept only for the one hero moment; press stays 160ms. |
| Display face | apple-design: default to the system font | soft-skill / frontend-design: characterful display face | **soft-skill**. Archivo stays. |
| Full-bleed moving video | soft-skill: cinematic depth is welcome | apple-design: avoid full-viewport moving backgrounds | **apple-design** (accessibility, not style). Favours B. |

## Evidence files

- Screenshots: `A-375.png` … `C-1440.png` in this folder (12 files, 375×812, 768×1024, 1024×900, 1440×900, after the 900ms entrance).
- Console: 0 errors and 0 warnings across all 12 page loads.
- Horizontal scroll: none (`scrollWidth` = viewport width at all 12 sizes).
