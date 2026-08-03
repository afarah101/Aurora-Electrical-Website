# AI-Slop Audit v3 — Aurora Electricals

Audited: 2026-07-22 · Read-only · Scope: `app/`, `components/`, `globals.css`
Benchmarks: `ui-ux-pro-max` ("home services electrician") + `frontend-design`
three-looks calibration. Prior audits: v1 (pre-video), v2 (post-video).
State audited: `3d3341d` — includes the committed video hero, the consistency
pass, and the TrustBar content-sourcing.

---

## Verdict

**The top third is now genuinely distinctive** — real footage with measured-contrast
overlay, a dark spine that runs hero → TrustBar, a designed seam, and one CTA blue
throughout. What still reads AI-generated is structural, not cosmetic: five sections
share one identical skeleton, the type never answers the hero's boldness, and the
gallery still shows placeholder tiles a scroll below footage of the real thing.
The page has stopped looking like a template with a good hero bolted on; it now looks
like a designed site whose middle third is waiting for its redesign.

---

## STEP 0

**Components (12):** Nav · Hero · HeroBackground · TrustBar · Services · WorkGallery ·
Reviews · TrustedBy · ContactForm · StickyCall · Footer · ui/button (orphaned).

**Skill AVOID:** `Hidden contact info + No certifications` — contact info: prominent
everywhere (pass). Certifications: still absent, still correctly withheld per
`site.md` (client action; unchanged through all three audits).

**Skill checklist:** all seven items pass in code (verified across the a11y pass —
44px targets, focus-visible rings that actually paint, reduced-motion honoured in
`HeroBackground.tsx:24-28`).

**frontend-design calibration:** matches none of the three AI default looks. The
below-fold white-card grid remains the unlisted fourth default, now confined to the
middle third.

---

## Findings

| # | Item | file:line | Issue | Sev | Fix |
|---|---|---|---|---|---|
| 1 | Placeholder gallery under real footage | `WorkGallery.tsx:100`, `public/work/` empty | Third audit, same finding, worse each time the hero improves: dashed "Completed work" tiles one scroll beneath the proof. The redesign is pending — flagged as the page's single most damaging element until it lands | **Critical** | Pull stills from `aurora-video.mp4` into `public/work/`; wire `photos` prop in `page.tsx:47` |
| 2 | Template heartbeat ×5 | `Services.tsx:43`, `WorkGallery.tsx:61`, `Reviews.tsx:18`, `TrustedBy.tsx:19`, `ContactForm.tsx:80` | Identical `text-3xl font-semibold tracking-tight` h2 on every section; 5/6 share `py-16 sm:py-20`. The strongest remaining "generated" signal | **Warning** | Vary band treatment by content role (one dark band mid-page would break it) |
| 3 | Boldness unspent in type | `layout.tsx:10` | Max weight loaded is 600; census: 19× semibold, 15× medium, zero bold. The hero's video is the page's one bold thing — headings below have no answer to it. Size-only hierarchy | **Warning** | Load Plex 700 for h2s, or set them in a display treatment |
| 4 | White card grid | `Services.tsx:51-57` | Six identical icon-plus-title cards, `p-5 rounded-lg border shadow-sm` — the default card answer. Hover shadow still implies a click that goes nowhere (v2 F5, unfixed) | **Warning** | Remove hover, or make cards link to `#contact` pre-selecting the service |
| 5 | Blue-800 residue | `WorkGallery.tsx:122,126`, `Reviews.tsx:31` | 3 stragglers from the old blue: active dot + its focus ring, and the (currently invisible) Reviews quote icon. Every other blue on the page is unified 700/600 | **Warning** | One-line swaps when those files next open |
| 6 | sr-only strategy leak | `TrustBar.tsx:66-72` | site.md positioning prose — "show range, not just one client type", an instruction to the designer — read aloud to screen-reader users, invisible to everyone else. Third audit carrying it | **Warning** | Delete the block |
| 7 | Gallery copy soft | `WorkGallery.tsx:65` | "A selection of completed jobs across…" — brochure filler beneath footage more specific than the sentence | Info | "Rewires, fuse boards and installs, photographed on site" |
| 8 | "All rights reserved." | `Footer.tsx:51` | Boilerplate (v1 F25, unfixed) | Info | Drop |
| 9 | Orphaned shadcn scaffold | `components/ui/button.tsx`, `globals.css:7-49` | Nothing imports ui/button — verified — yet 43 lines of `@theme` mappings + the token block exist to serve it. Harmless, but it is the last of the scaffold fiction | Info | Delete component + prune tokens, or leave until shadcn is actually used |
| 10 | Mono font slot | `layout.tsx:13-16`, `globals.css:11` | IBM Plex Mono loaded, bound to `--font-geist-mono`, used nowhere | Info | Drop the font (saves a font request) or use it for data (phone numbers would suit it) |
| 11 | 2.7 MB clip + audio track | `public/aurora-video.mp4` | Audio bytes ship despite `muted`; no `saveData` check | Info | `ffmpeg -an` re-mux (~15% smaller), optional saveData → poster |

## Genuinely good — and better than v2

- **The dark spine is real now**: hero (`Hero.tsx:49`) → TrustBar (`TrustBar.tsx:59`) share
  slate-900; the seam out of it (`Services.tsx:38-41`) is a 2px CTA-blue rule onto a
  slate-50 landing — the v2 "two sites stitched" cliff is designed away.
- **One blue**: 16× blue-700 + 4× blue-600 hovers, unified in the consistency pass.
  The v2 Nav-over-Hero collision is gone.
- **Contrast is engineered, not asserted** (`Hero.tsx:53-57`): overlay sized against the
  clip's measured peak (253/255), with the maths in a comment where it can be re-checked.
- **Playback respects people** (`HeroBackground.tsx`): reduced-motion users never see a
  frame move; offscreen pauses; the stale-IntersectionObserver-entry bug is handled and
  documented.
- **Content honesty held through three audits**: no invented reviews, certifications,
  or claims; TrustBar's last two hardcoded values now route through content or render
  nothing.
- **Copy voice**: "The same standard of work whether it's a single socket or a full
  commercial installation" (`Services.tsx:45`) still the best line on the page.

## Mobile (dimension 8)

Genuinely designed, not shrunk: mobile-first stacking, 44×44 measured targets (nav
toggle, drawer links, carousel dots), sticky call bar with footer clearance
(`Footer.tsx:21` `pb-20 sm:pb-0`), `playsInline` + poster fallback for the video.
No new findings. Residual: the 2.7 MB clip on cellular (finding 11).

---

## THEME CHANGE — what moving off blue/slate would take

**Where colour actually lives (no hex anywhere in components — all Tailwind classes):**

| Touchpoint | Files | Refs |
|---|---|---|
| Accent (CTAs, seam, icons, focus) `blue-700/600` | Nav, Hero, StickyCall, ContactForm, Services (seam + icons), WorkGallery (dots) | ~20 |
| Dark-surface accents `blue-300/200` | Hero (eyebrow, claim icons, focus), TrustBar (icons) | 5 |
| Residue `blue-800` | WorkGallery ×2, Reviews ×1 | 3 |
| Dark bands `slate-900/950/800` | Hero, TrustBar, Footer + hero overlay | ~8 |
| Light bands `white / slate-50` | Services, WorkGallery, Reviews, TrustedBy, ContactForm | ~6 |
| Secondary accent `emerald` | Hero accreditation badges (hidden), form success text | 2 |
| shadcn tokens | `globals.css:53+` | greyscale; consumed only by orphaned ui/button — **irrelevant to theme** |

**Assessment: the palette is concentrated, not scattered** — a strength. Swapping the
accent is a class-family substitution across 8 component files (~28 refs), entirely
sed-able because no raw hex exists outside globals' greyscale tokens.

**Risk: LOW for an accent swap, MEDIUM for a dark-surface change.**
- Accent swap (blue → e.g. amber keyed to the footage's work-lights): mechanical, but
  4 contrast pairs must be re-verified — eyebrow `blue-200` and icons `blue-300` on the
  dark overlay (4.5:1 small-text), white-on-accent CTA fill, and the seam rule (3:1
  non-text). Amber families typically FAIL white-text fills — the CTA would need dark
  text on amber, a real design decision, not a sed.
- Dark-surface change (slate → warmer charcoal): touches the hero overlay maths in
  `Hero.tsx:53-57` — the 70%-over-white guarantee must be recomputed for the new
  overlay colour, and `aurora-poster.jpg` re-checked against it.
- Is blue/slate "default"? It is the *skill's own recommendation* for this industry
  (Trust & Authority: "professional colors (blue/grey)"), chosen deliberately in the
  first build — a defensible choice, not a drifted-into one. The footage, however,
  skews warm (work lights, copper, timber): a warm accent would key the page to its
  own hero. That is the one theme move with a subject-grounded argument behind it.

## Top 5 fixes, by visible impact

1. **Real photos in the gallery** (F1) — third consecutive audit; everything else is
   polish next to it, and the stills already exist inside the video file.
2. **Break the ×5 skeleton** (F2) — one dark mid-page band (WorkGallery: photos on
   slate-900) restores the rhythm the hero started.
3. **Give headings weight** (F3) — load 700; the type finally answers the video.
4. **Service cards: remove the false affordance or make it true** (F4) — linking each
   card to the quote form pre-filled turns a template grid into a conversion path.
5. **Sweep the residue** (F5, F6, F8) — three blue-800s, the sr-only leak, the footer
   boilerplate: fifteen minutes, three audits old.

## Scope

Read-only. No source modified; `AUDIT-v3.md` is the only new file.
