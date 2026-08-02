# AI-Slop Audit v2 — Aurora Electricals, post-video-hero

Audited: 2026-07-22 · Read-only · Scope: `app/`, `components/`, `globals.css`
Benchmarks: `ui-ux-pro-max` design-system output ("home services electrician") + the
`frontend-design` skill's three-looks calibration.
Author's note: I built both the hero and the sections below it. The job here is to say
which of my own choices the new hero has made obsolete.

---

## Verdict

**No — the page does not yet live up to its hero.** The first screen is now specific,
cinematic, and unmistakably about this trade; from the moment the dark TrustBar ends,
the page reverts to the same white default-card template the v1 audit described — and
its most damaging moment is showing empty "Completed work" placeholder tiles directly
beneath footage that proves real completed work exists.

---

## STEP 0 — benchmarks applied

**Skill AVOID list:** `Hidden contact info + No certifications`
- Hidden contact — **absent** (phone in nav, hero, sticky bar, form, footer; all `tel:`).
- No certifications — **still present**, still a client action: `site.md` forbids
  displaying an unconfirmed mark. Unchanged since v1.

**Skill checklist:** all seven items now pass in code (emoji ✓, cursor ✓, transitions ✓,
contrast ✓, focus ✓ — added since v1 — reduced-motion ✓, breakpoints ✓).

**frontend-design three-looks calibration:** the page matches none of the three AI
default looks (cream+serif+terracotta / near-black+acid-accent / broadsheet). The hero
is a genuine subject-grounded choice — the skill's "open with the most characteristic
thing in the subject's world" is exactly what the footage does. The below-fold instead
matches the *unlisted* fourth default: white shadcn card-grid.

**Components (12):** Nav · Hero · HeroBackground · TrustBar · Services · WorkGallery ·
Reviews · TrustedBy · ContactForm · StickyCall · Footer · ui/button.

---

## Findings

| # | Item | file:line | Issue | Sev | Fix |
|---|---|---|---|---|---|
| 1 | Placeholder gallery under real footage | `WorkGallery.tsx:100` | Dashed "Completed work" tiles now sit one scroll below a video of the electrician actually working. v1 graded these tiles a good empty state; the hero re-grades them as a broken promise — the page proves real work exists, then shows none | **Critical** | Extract 3–6 stills from the footage into `public/work/` (ffmpeg, zero new assets needed) |
| 2 | Two blue families in one viewport | `Nav.tsx:47` vs `Hero.tsx:82` | Nav CTA `bg-blue-800` floats directly over hero CTA `bg-blue-700` — the same action, two blues, simultaneously visible. StickyCall (`:13`) and ContactForm (`:172`) also stay on 800 | **Critical** | Pick one CTA blue; apply everywhere |
| 3 | Dark-to-white cliff | `TrustBar.tsx:12` → `Services.tsx:35` | Page runs slate-950/900 for two full bands, then snaps to `bg-white` with no transitional treatment. Reads as two sites stitched at the seam | **Warning** | Carry the dark spine further, or design the transition |
| 4 | Identical section skeleton ×5 | `Services.tsx:37`, `WorkGallery.tsx:61`, `Reviews.tsx:18`, `TrustedBy.tsx:19`, `ContactForm.tsx:80` | Same `text-3xl font-semibold tracking-tight` h2 + `mt-3` muted sub + `mt-10` grid, five times; five of six sections share `py-16 sm:py-20`. This is the template heartbeat the frontend-design skill warns about — structure as decoration, encoding nothing | **Warning** | Vary band treatment/rhythm by content role |
| 5 | False affordance on service cards | `Services.tsx:51` | `hover:shadow-md` on `<li>` elements that link nowhere — hover invites a click that does nothing. Classic generated-card-grid tell | **Warning** | Remove hover, or make cards link to a quote pre-filled with that service |
| 6 | Boldness budget unspent in type | `layout.tsx:10`, `globals.css:12` | Max weight loaded is 600; `--font-heading` still aliases the body face. Defensible pre-video; now the hero *is* the one bold thing and headings elsewhere have no answer to it. 17× medium / 19× semibold / zero bold | **Warning** | Load 700 for h2s, or give headings a real display treatment |
| 7 | Dead brand tokens (since v1) | `globals.css:54-57` | `--trust-*` palette still declared under a comment claiming it's "used by the marketing sections"; referenced nowhere. The comment is now false twice over — the hero built its own dark palette without touching these | **Warning** | Wire or delete |
| 8 | Dead dark-mode + scaffold tokens (since v1) | `globals.css:93-125` | 33-line `.dark` block never applied; `--sidebar-*`/`--chart-*` for components that don't exist | **Warning** | Delete |
| 9 | Hardcoded claim beside sourced claims | `TrustBar.tsx:23` | "Quoted before work starts" authored in JSX while the hero, one band up, pulls every claim from `site.md`. The pipeline exists; this line bypasses it | **Warning** | Move into `## Claims` |
| 10 | Unsourced area fallback | `TrustBar.tsx:29` | `serviceArea ?? "London"` — invents a service area when site.md marks it unconfirmed; hero's own fallback (`Hero.tsx:65`) avoids naming one | **Warning** | Fall back to non-geographic copy |
| 11 | Soft gallery copy | `WorkGallery.tsx:65` | "A selection of completed jobs across…" — brochure filler; the footage above is more specific than the sentence describing the work | Info | Name the work: "Rewires, fuse boards and installs, photographed on site" |
| 12 | `sr-only` positioning block (since v1) | `TrustBar.tsx:35` | Screen-reader-only strategy copy sighted users never see — including "show range, not just one client type", an instruction to the designer, read aloud to SR users | Info | Remove |
| 13 | "All rights reserved." (since v1) | `Footer.tsx:51` | Boilerplate filler | Info | Drop |
| 14 | 2.7 MB video on mobile data | `HeroBackground.tsx` | `preload="metadata"` helps, but autoplay still streams the full clip on cellular; `navigator.connection.saveData` unchecked; audio track still in the file | Info | Strip audio (`-an`), consider saveData → poster-only |
| 15 | Mono font slot mislabeled (since v1) | `layout.tsx:13-16` | IBM Plex Mono still bound to `--font-geist-mono`, loaded but unused anywhere | Info | Rename or drop the font |

## Genuinely good — earned, not padded

- **The hero is the thesis** (`Hero.tsx`, `HeroBackground.tsx`): real footage of the actual
  trade, overlay sized against measured peak luma, reduced-motion honoured, poster
  fallback, observer-driven playback. This is the frontend-design skill's advice
  executed almost literally — the most characteristic thing in the subject's world,
  opening the page.
- **TrustBar belongs to the hero now** (`TrustBar.tsx:12`): its slate-900 + blue-300
  palette reads as the hero's caption bar. It was generic in v1; the hero adopted it.
- **TrustedBy is real** (`TrustedBy.tsx`): two genuine client logos, existence-checked at
  build, balanced for optical weight. No longer a placeholder strip.
- **CTA language is coherent**: "Request a free quote" is the same words in the hero
  button, the section h2, and the form — the skill's "an action keeps its name through
  the whole flow", already true.
- **Claims pipeline** (`Hero.tsx` + `content.ts`): every hero promise traces to site.md;
  none are authored in markup. (TrustBar's one stray line is finding 9.)
- **Honest omissions hold**: no invented reviews, no invented certifications, empty
  sections self-omit.

## Top 5 fixes, by visible impact

1. **Fill the gallery from the footage** (F1). `ffmpeg` can pull 4–6 real stills from
   `aurora-video.mp4` today; the strongest trust element on the page is currently
   feeding the weakest.
2. **Unify the CTA blue** (F2). One-line change in three files; ends the two-blues
   collision visible in the very first screen.
3. **Design the dark→light seam** (F3) — decide where the hero's world ends on purpose,
   instead of where the template happened to resume.
4. **Break the ×5 section skeleton** (F4) — one dark band (WorkGallery is the natural
   candidate: photos read better on slate-900) would re-anchor the page's rhythm.
5. **Settle the token layer** (F7/F8) — the hero now proves the palette lives fine as
   utilities; either promote its dark family into the tokens or delete the fiction.

## Scope

Read-only. No source modified; `AUDIT-v2.md` is the only new file.
