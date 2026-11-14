# Final report: redesign phases 2–5

Branch `redesign/phase-1-prototypes`. Checked on 14 Nov 2026 against a production build (`npm run build && npm run start`). `main` is untouched at `51e43b6`.

## Verdict

**Do not ship yet.** Every quality check passes, but the new headline and the services photo still need Mohamed's approval. The revert tag also does not exist yet.

## Pages

Impeccable = `impeccable detect` at 1280×800. Lighthouse 13.6.0 scores are Performance / Accessibility / Best practices / SEO. Console errors were counted across all 4 screenshot widths.

| Page | Impeccable findings | Lighthouse mobile | Lighthouse desktop | Console errors |
| --- | --- | --- | --- | --- |
| `/` | 1 advisory: straggler ("recommend!" alone on a line, review quote) | 87 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |
| `/contact` | 0 | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |
| `/eicr-landlords` | 1 warning: line length ~101 chars | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |
| `/emergency-electrician` | 0 | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |
| `/privacy` | 1 advisory: straggler; 1 warning: line length ~103 chars | 100 / 100 / 100 / **69** | 100 / 100 / 100 / **69** | 0 |

- No page has `hero-eyebrow-chip`, `overused-font`, `oversized-h1` or `low-contrast`.
- `/` mobile performance 87: LCP is 4.1s and the LCP element is the hero video poster (`aurora-poster.jpg`). See fix 15.
- `/privacy` SEO 69: the only failure is "Page is blocked from indexing". This is deliberate: the page is `noindex` until Mohamed approves the wording (`app/privacy/page.tsx:12`).
- Horizontal scroll: none. `scrollWidth` equals the viewport width on all 20 page/width pairs.
- Screenshots: `review/final/<page>-<width>.png`, 5 pages × 375, 768, 1024, 1440 (first screen, after the hero entrance).

## Site-wide checks

**review-animations: APPROVE.** There is no `ease-in`, no `scale(0)`, no layout-property animation and no keyframe on a frequent action. Every moving element has a reduced-motion path. Hero rise: 900ms, transform only, reason written in `app/globals.css`. Slideshows: 300ms or less. Menu panel: 200ms. Presses: 160ms down, 100ms up. Notes that do not block:

- Untouched components still use Tailwind's default `transition-colors` with `hover:` gated by `(hover: hover)` only, not `(pointer: fine)`: `MyBuilderBadge.tsx`, `WhatsAppButton.tsx`, `Footer.tsx`, and the CTAs in `app/eicr-landlords/page.tsx` and `app/emergency-electrician/page.tsx`. These are colour-only changes, but they don't match the new buttons.
- `components/ui/button.tsx` has `transition-all`. Nothing imports it (dead shadcn code), so it never renders.

**ui-ux-pro-max Pre-Delivery Checklist (web):**

| Item | Result |
| --- | --- |
| Tested at 375px | ✓ |
| Reduced motion | ✓ Measured: hero video starts paused, h1 static, other hero parts fade in 200ms, no slide change in 15s |
| Touch targets ≥ 44px | ✓ All new controls are 44px (pause buttons, prev/next, menu, pill call button) |
| No emoji icons, one icon family | ✓ Lucide |
| Pressed state does not shift layout | ✓ `scale` transform only |
| Semantic colour tokens | Partial: phase 2–4 files have no `slate-*`; 10 untouched files still do (see fix 6) |
| Icon controls have names and state | ✓ `aria-label` plus `aria-pressed` / `aria-expanded` |
| Auto-rotating content can be stopped | ✓ Hero video, gallery and reviews: pause button; slideshows also stop on hover and focus |
| Colour is not the only indicator | ✓ |
| Sticky UI does not hide focus | ✓ Anchor targets get 80px scroll margin; the nav takes 68px |
| Form labels and inline errors | ✓ Unchanged |
| Landscape, Dynamic Type / text zoom | Not run |

## Phase 1 fixes

| # | Fix | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Pause control on hero video | DONE | `components/HeroBackground.tsx`. In Chrome, a click and the keyboard (Tab ×11, Space) both set `video.paused = true`. 44×44px, `aria-pressed` |
| 2 | C: call button below fold in landscape | N/A | C was not chosen; prototypes deleted |
| 3 | Hero height minus header | DONE | `pt-nav` + `min-h-[calc(100svh-var(--spacing-nav))]`; nav band measured at 68px = `--spacing-nav`. At 375×812 the CTA ends at 322px and the proof list at 506px |
| 4 | Lucide stroke 1.5, no 1px grey borders | DONE for hero, nav, services, slideshows, sticky call | Untouched components (Footer, TrustBar, MyBuilderBadge, EicrPricing, TrustedBy) still use default stroke and `slate-800` borders |
| 5 | CTA hover colour transition | DONE | 160ms on the ease-out token, every button in phases 2–4 |
| 6 | `slate-*` → semantic tokens | PARTIAL | Tokens added in `app/globals.css` (surface, ink, hairline). Removed from all phase 2–4 files; still present in 10 untouched files (4 page files, 6 components) |
| 7 | h1 never at opacity 0 | DONE | `hero-rise` moves only; computed h1 opacity is 1 at load |
| 8 | Picker to PICKER.md spec | N/A | Prototype page deleted |
| 9 | Stagger 30–80ms | DONE | Hero 0 / 60 / 120 / 180ms |
| 10 | Hover gate `(pointer: fine)` | DONE in phase 2–4 files | `hover-fine` variant in `app/globals.css`; not in untouched files |
| 11 | Press 160ms, release 100ms | DONE | Hero, nav, slideshows, sticky call, form submit |
| 12 | Reduced motion = 200ms fade | DONE | Computed `hero-fade 0.2s` with reduced motion emulated |
| 13 | B headline at 1024px | DONE | `lg:text-5xl xl:text-6xl`: 48px and 3 lines at 1024 (was 4) |
| 14 | Pill buttons | DONE in phase 2–4 files | Still `rounded-md` in MyBuilderBadge, WhatsAppButton and the service-page CTAs |
| 15 | Poster JPG → WebP/AVIF | NOT DONE | Never in a phase's scope. It is the mobile LCP element on `/` (4.1s) |
| 16 | Headline approved by Mohamed | NOT DONE | "Safe, certified electrics for London homes." is now the site.md Tagline and the live h1 |

## Open items

**For Mohamed**

1. Approve the headline "Safe, certified electrics for London homes." (it makes "certified" and "London homes" claims).
2. Confirm `work-01.jpg` (a distribution board with cable trays) may illustrate "Fuse board / consumer unit upgrades & replacements". It looks like commercial work, not a home consumer unit.

**For Ahmed**

1. Sign-off: the visual changes and the new section order need your review before merge. Label the PR `needs-ahmed`.
2. The revert tag `pre-redesign-2026-11-14` does not exist (no tags in the repo). The live site is `main` at `51e43b6`, which this branch never touched. To create the tag:
   `git tag pre-redesign-2026-11-14 51e43b6 && git push origin pre-redesign-2026-11-14`
   Reverting after a merge then means resetting or deploying `main` from that tag.
3. Follow-ups outside every phase's scope: poster to WebP/AVIF (fix 15); tokens, pill buttons and the hover gate in the untouched components (fixes 4, 6, 10, 14); delete the unused `components/ui/button.tsx`.
4. The phase 4 form test did not send an email. There is no `.env.local`, so `TO_EMAIL` falls back to the client's inbox. Only the honeypot (200 `{"ok":true}`, returns before sending) and invalid-data (400) paths were exercised.
