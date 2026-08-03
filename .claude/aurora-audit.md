# Aurora Electricals — Premium-Gap Punch List

Audited: 2026-08-03 · branch `main` @ `7a79329` · read-only, no fixes applied.
Design system held constant: Space Grotesk / IBM Plex Sans / IBM Plex Mono; blue = CTA only; gold = trust only.

## STEP 0 — ground truth

- **Branch:** `main` (only branch).
- **Renderers:** nav `components/Nav.tsx` · hero `components/Hero.tsx` + `components/HeroBackground.tsx` · trust strip `components/TrustBar.tsx` · services `components/Services.tsx`.
- **No `tailwind.config.*` exists** — Tailwind v4 CSS-first; the token file is `app/globals.css`.
- **Tokens defined there:** fonts `--font-heading` (Space Grotesk) / `--font-sans` (Plex Sans) / `--font-mono` (Plex Mono); accents `--color-action #1d4ed8`, `--color-action-hover #2563eb`, `--color-action-soft #93c5fd`, `--color-trust #b45309`, `--color-trust-bright #fcd34d`, `--color-trust-soft #fffbeb`, `--color-trust-deep #92400e`, `--color-trust-line #fde68a`; plus the shadcn greyscale set (`--background`…`--sidebar-*`, radius scale) consumed only by the orphaned `ui/button`. Spacing: Tailwind default 4px scale, no custom spacing tokens.

## Punch list (by visual impact)

| # | file:line | What's wrong | Fix | Sev |
|---|---|---|---|---|
| 1 | `Hero.tsx:49,60` + `TrustBar.tsx:59` | **Hard seam at hero's end.** Exact causes: hero section carries `border-b border-slate-800`; the video overlay ends at `to-slate-900/70` (30% footage still visible) and slams into TrustBar's solid `bg-slate-900`. Footage is cut mid-frame by a 1px rule + 30-point opacity jump | End the overlay near-solid (`via-slate-900/70 to-slate-900` or /95) so footage fades out before the boundary; delete the border-b | **Critical** |
| 2 | `Nav.tsx:19` | **Nav reads as a fixed slab over the video.** Layering: `sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800` — permanent 80% fill + permanent hairline, identical at top and mid-scroll. **No scroll state exists** (no listener, no variant) | At `scrollY≈0` render transparent/borderless (nav sits *in* the hero); past ~24px, the current 80%+blur+border. `transition-colors` 200ms | **Critical** |
| 3 | `Services.tsx:22` | **Empty left column.** `lg:grid-cols-[2fr_3fr] lg:gap-20`; left holds only h2+sub (~120px) beside a ~400px list (6 rows × `py-5` + hairlines) — the lower left quadrant is dead space | Make left column `lg:sticky lg:top-24 self-start`, or move the aggregate-rating / certificates content into it | Warning |
| 4 | `Hero.tsx:125-130` | **"5 customer reviews" is orphaned.** It's a bare `<p>` (`mt-8 text-sm text-trust-bright`) — not a link, no heading level, no stars — floating below the claims `<ul>` | Make it an `<a href="#reviews">` with 5 gold stars inline; proof that navigates to proof | Warning |
| 5 | `Footer.tsx:35,42` | tel/mailto links have `hover:text-white` but **zero focus-visible and zero transition** — the only interactive elements on the page without either | Add `transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft` | Warning |
| 6 | `Services.tsx:43,45` | `transition-colors group-hover:` whitening on **non-interactive rows** — same false affordance class removed from the old card grid; rows invite a click that does nothing | Remove the hover styles, or make rows link to `#contact` | Warning |
| 7 | `TrustBar.tsx:69-73` | `sr-only` block reads site.md positioning strategy ("show range, not just one client type") aloud to screen-reader users — designer notes as content (carried since audit v1) | Delete the block | Warning |
| 8 | `content.ts:… (clients.url)` | `client.url` parsed for both clients, rendered nowhere — Trusted By tiles could link to the real businesses (verifiable proof) but don't | Wrap tiles in `<a href={client.url}>` with focus ring | Info |
| 9 | `Footer.tsx:51` | "All rights reserved." boilerplate (carried since v1) | Drop | Info |
| 10 | `public/aurora-video.mp4` | Audio track still shipped (muted but downloaded); no `saveData` check | `ffmpeg -an` re-mux; poster-only under `saveData` | Info |

## Check 5 — code hygiene greps (clean)

- **Hardcoded hex in components:** 0 in class attributes. Only occurrences: `Hero.tsx:55` (contrast-math comment) and the token definitions in `globals.css` (by design).
- **Arbitrary values:** 5 legitimate — `aspect-[4/3]`, `aspect-[16/10]` (WorkGallery ratios), `grid-cols-[2fr_3fr]` (Services), `min-h-[16rem]`/`[13rem]` (Reviews anti-jump). No off-scale spacing; all paddings/margins sit on the 4px scale.
- **Font sizes under 12px:** none — smallest is `text-xs` (12px), no arbitrary px sizes.
- **Container nesting > 2:** none — every section is `section > div.mx-auto.max-w-6xl > content`.

## Check 6 — interaction-state inventory

| Component | hover | focus | transition | Gaps |
|---|---|---|---|---|
| Nav | 2 | 5 | 2 | — |
| Hero | 2 | 2 | 2 | — |
| Reviews / WorkGallery | 2 | 3 | 3 | — |
| ContactForm | 2 | 2 | 2 | mailto link: no focus-visible |
| StickyCall | 1 | 1 | 1 | — |
| **Footer** | 2 | **0** | **0** | both links naked (row 5) |
| TrustBar / TrustedBy / HeroBackground | 0 | 0 | 0 | no interactive elements (TrustedBy *should* have — row 8) |

## Check 7 — contrast (computed, WCAG relative luminance)

| Pair | Ratio | Verdict |
|---|---|---|
| trust-bright `#fcd34d` on slate-950 | 12.38:1+ | PASS |
| trust-bright on hero worst-case overlay composite `#575a69` | 4.74:1 | PASS |
| white on overlay worst-case (70% slate-900 over pure-white frame) | 6.60:1 | PASS |
| trust `#b45309` on white tiles | 5.02:1 | PASS |

**Nothing under 4.5:1.** (History: amber-400 was rejected at 4.10:1 during the token pass; the shipped amber-300 is the fix.)

## Check 8 — find-animation-opportunities (read-only; none implemented)

**Opportunities (survived the 4-question gate):**

| # | Location | Today | Purpose | Frequency | Recipe |
|---|---|---|---|---|---|
| 1 | `Nav.tsx:71` mobile drawer | `{open && <ul>}` teleports in/out | Preventing a jarring change | Occasional | Enter `opacity 0 → 1` + `translateY(-4px) → 0`, 200ms ease-out via `@starting-style`; exit symmetric; reduced-motion: opacity only |
| 2 | `Nav.tsx:19` scroll state | Bar identical at top and scrolled | State indication | Constant but state-driven, not time-based | Transparent at top → `bg-slate-950/80` + border past ~24px, `transition-colors` 200ms ease-out (this is also punch-list row 2) |
| 3 | `Nav.tsx:47`, `Hero.tsx:82` CTAs | No press feedback | Feedback | Low per-visitor (called once) | `:active { transform: scale(0.98) }`, `transition: transform 120ms ease-out` — near-imperceptible tier |

**Rejections (the point of the skill):**

- `Hero.tsx:63-108` — staggered entrance for eyebrow/h1/claims. **Rejected: the footage IS the hero's motion; layered text animation is decoration on an information surface, and the brief says none.**
- `Services.tsx:34-51` — scroll-into-view stagger for the list. **Rejected: nothing changes state; content merely scrolls into view. Purpose test fails — no jarring change to prevent.**
- `Services.tsx:43-45` — row hover motion. **Rejected inverted: motion should be *removed*, not added — rows aren't interactive (punch-list row 6).**
- `WorkGallery`/`Reviews` slide transitions (out of the three named files, noted in passing). **Rejected: existing hard swaps are within brief; crossfade would add decode cost for decorative benefit.**

**Verdict:** the interface needs almost no new motion — it's already close to right. The single highest-leverage item is the drawer entrance (#1); the scroll-state nav (#2) doubles as the fix for punch-list row 2.

## REVIEW

- STEP 0 tree and tokens reported? **YES** (above; tailwind.config absence explained — v4 CSS-first).
- All 8 checks run with file:line evidence? **YES** (checks 1–4 rows 1–4; check 5–8 sections above).
- Zero files modified? **YES** — `git status`: no tracked file changed; this report is the only new artifact.
