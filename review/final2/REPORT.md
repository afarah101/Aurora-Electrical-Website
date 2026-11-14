# Final report 2: evaluator fixes, restyle, WebP poster

Branch `redesign/phase-1-prototypes`. Checked on 14 Nov 2026 against a production build (`npm run build && npm run start`). Baseline for comparisons: `ec4ac4e`. `main` is untouched at `51e43b6`.

## Verdict

**Do not ship yet.** Three things block it:

1. **The revert tag does not exist on GitHub.** This session's git proxy refuses tag pushes (HTTP 403). Branch pushes work. Ahmed must run the two commands in "Open items".
2. **`/` mobile Lighthouse performance is 86 (median of 5), not ≥ 90.** With real (devtools) throttling it is 95–97 and LCP is 1.9s. The default simulated score counts all JavaScript requested before first paint. That includes the zod chunk from the contact form, and fixing it needs `app/page.tsx`, which is out of scope.
3. Mohamed must still approve the headline and the services photo.

Every other check passes.

## Commits

| Commit | What |
| --- | --- |
| `fb93805` fix: evaluator findings | Fixes 1–7 below |
| `5345843` style: old components to new system | Footer, TrustBar, MyBuilderBadge, EicrPricing, TrustedBy, WhatsAppButton, both service pages; `components/ui/button.tsx` deleted |
| `7f2eb79` perf: webp poster | `public/aurora-poster.webp` (29 KB, was 56 KB JPG, 1280×720, q80). JPG kept |
| `8d0b1cc` perf: hero poster as a high-priority img | Poster is an `<img fetchpriority=high>` under the video |
| `707cf5f` fix: independent audit findings | Audit round 1 defects 2, 3, 5, 6, 7 (see Audit) |

## Checks

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Tag on GitHub = `51e43b6` | **FAIL (blocked)** | Local tag `pre-redesign-2026-11-14` → `51e43b6`. `git push origin refs/tags/…` returns `HTTP 403` from the session proxy (3 tries). `git ls-remote` shows no tag. No GitHub tool here can create a tag. |
| 2 | Changed paths ⊂ SCOPE; no diff in content/, app/api/, form logic | PASS | `git diff --name-only ec4ac4e HEAD`: 19 paths, all in scope. `content/`, `app/api/`, `lib/`, `app/page.tsx`, `app/layout.tsx`, `app/contact/`: 0 lines. `ContactForm.tsx`: classNames and one comment only (no handler, schema or field change). |
| 3 | Play resumes in 7s, pointer and focus inside | PASS | Pause, then play with the pointer on the button: #work 01→02 in 6.1s, #reviews in 6.1s (`:hover` true). Same with keyboard focus on the button: 6.1s, 6.1s. After that, moving the pointer out and back, or focus to Previous, pauses again (no change in 7s). |
| 4 | Every nav link at 375 and 1440: section below nav | PASS | Nav bottom 68px. #services, #work, #clients, #contact, #reviews, #eicr-pricing land at top = 80px, by URL hash and by clicking the nav/menu link, at both widths. One token: `--spacing-anchor: calc(var(--spacing-nav) + 0.75rem)` on `[id]`; ContactForm's own `scroll-mt-[69px]` removed. |
| 5 | Service order = site.md at 375, 800, 1024, 1440 | PASS | Cards sorted by top, then left: the site.md order at all 4 widths, EICRs last. One column below 1024px, so no reordering and no empty card. |
| 6 | grep `slate-\|transition-all\|rounded-md` = 0 | PASS | 0 lines. No exceptions needed. |
| 7 | Copy unchanged except B5 hero | PASS | `innerText` of 5 pages at 375 and 1440 vs `ec4ac4e`: only `/` differs: "Get a free quote" → "Request a free quote", and the new claim line "Free, no-obligation quote". |
| 8 | build, type-check, lint | PASS | `npm run build` exit 0, no warnings; `tsc --noEmit` clean; `npm run lint` clean. |
| 9 | Impeccable: 0 of the 5 named rules | PASS | `impeccable detect --cdp` at 1280×800 and 390×844, 5 pages: 0 hero-eyebrow-chip, overused-font, oversized-h1, low-contrast, cramped-padding. Other findings match the baseline exactly (line-length on /eicr-landlords and /privacy; advisories). |
| 10 | Lighthouse a11y 100; `/` mobile perf ≥ 90 | **FAIL (perf)** | Accessibility 100 on all 10 page/preset runs. `/` mobile perf on the final build: 81, 85, 86, 86, 87 (median 86); LCP element = hero poster img. Baseline `ec4ac4e`: 86–87. Devtools throttling: 97 and 95, LCP 1.9s. Table below. |
| 11 | review-animations site-wide | PASS: **APPROVE** | No `ease-in`, `scale(0)`, `transition-all` or layout-property animation. Every hover uses `hover-fine` `(hover:hover) and (pointer:fine)`. Presses 160ms down / 100ms up. UI motion ≤ 300ms; hero rise 900ms has a written reason. Reduced motion: fades kept, movement dropped. |
| 12 | 0 console errors; no horizontal scroll | PASS | 20 page × width pairs (375/768/1024/1440): 0 console errors, `scrollWidth` = viewport each time. |
| 13 | Independent audit | AUDIT_RESULT | AUDIT_DETAIL |
| 14 | Push; remote = local; main = `51e43b6` | PASS | See "Push" below. |

Direct checks of the fixes (rendered DOM, 375px):

- Fix 5: hero links are "Call 07304 150154" (`tel:`), "Request a free quote" (`#contact`), "MyBuilder 4.9 from 82 reviews" (`#reviews`). The proof list shows the rating, NICEIC registered, Same-day callouts, and Free, no-obligation quote.
- Fix 6: both star groups (hero, MyBuilder block) read "4.9 out of 5 stars", fills 100/100/100/100/90%. `components/RatingStars.tsx`.
- Fix 7: menu open → `main`, `footer` and the sticky call bar `inert = true` on `/`, `/eicr-landlords`, `/contact`; closed → false. Open at 375, resize to 1280 → menu closes, nothing inert.
- Fix 4: alt is "Open distribution board with labelled circuit breakers" (true at every crop; the cable trays are cropped out at 1440). The comment no longer says "verified".

## Lighthouse 13.6.0

Performance / Accessibility / Best practices / SEO.

| Page | Mobile | Desktop |
| --- | --- | --- |
| `/` | 86* / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/contact` | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/eicr-landlords` | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/emergency-electrician` | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/privacy` | 99 / 100 / 100 / 69† | 100 / 100 / 100 / 69† |

\* Median of 5 simulated runs. Before this work it was 87 with the `<video poster>` as LCP.
† Deliberate `noindex` until Mohamed approves the wording (unchanged).

**Why `/` mobile is below 90.** Lighthouse's simulated LCP has two paths. A text LCP that paints at first paint uses the fast first-paint estimate (the other pages get 0.8s). An image LCP uses a pessimistic estimate: it includes every request that started before first paint, so all page JavaScript, including the 77 KB (gzip) zod chunk the contact form loads. The hero poster is the largest thing in the first screen, so the image path applies. Neither poster size nor priority moves it. Fixes, for Ahmed to choose:

1. Load the contact form's validation code later (change in `app/page.tsx` or the form's imports). Out of this run's scope: it touches form code.
2. Make the hero media smaller than the headline on phones, or move it below the first screen. This is a visual design change.

## Screenshots

`review/final2/<page>-<width>.png`, 5 pages × 375, 768, 1024, 1440, first screen after the hero entrance, 2× scale.

## Decisions taken alone

- **Play wins over hover and focus, once.** Pressing Play resumes at once although pointer and focus are on the button. When the pointer leaves, or focus moves to another control, hover and focus pause it again (WAI-ARIA carousel pattern).
- **Services at 768–1023px:** one column, like phones. A 2-column grid either broke the site.md order (old) or left a near-empty card beside the photo (audit round 1).
- **Hero claims:** every line from site.md "Claims" is shown. "Free, no-obligation quote" uses a neutral check icon; "Same-day callouts" keeps the clock.
- **Rating link** has a faint underline so it reads as a link.
- **Star rendering:** new shared `components/RatingStars.tsx`, also used by the MyBuilder block (it had 5 fixed stars).
- **Contact form:** only classNames changed (`rounded-md` → 12px radius, hover gate, the per-section scroll margin removed for the shared token). No form logic touched.
- **Nav:** `rounded-md` focus shapes → `rounded-sm`; mobile menu items → 10px radius.
- **WhatsApp green** moved to tokens `--color-whatsapp` / `--color-whatsapp-hover` (same values).
- **Credential chips** in the MyBuilder block are pills; their amber border is kept (a tinted trust colour, not grey).
- **Poster as `<img>`:** the video has no poster attribute now; the WebP `<img>` sits under it and shows until the first frame.
- **Did not hide or shrink the hero media** to raise the simulated score: that is a design call for Ahmed.
- **Menu lock** applies to every sibling of the header, so the sticky call bar is covered too.
- `emil-design-eng` skill not used (no new animation work, per Ahmed's preference).

## Out of scope: logged, not fixed

- `app/contact/page.tsx:19`: `pt-[69px] lg:pt-[65px]` is older than the 68px nav. At ≥1024px the `#contact` section starts 3px under the nav (audit round 1). Use `pt-nav`. It also has `bg-slate-950`.
- `app/privacy/page.tsx:22-57`: `slate-*` and ungated `hover:text-white`.
- `components/WorkGallery.tsx:116-128`: on very fast prev/next clicks, a photo that is fading out can unmount mid-fade (audit note, minor).
- Hover colour transitions use the strong ease-out curve; STANDARDS.md prefers plain `ease` for colour (cosmetic).
- `app/globals.css` comment above `:root` still says marketing sections use slate utilities; the shadcn variables there are now unused by any component.
- `lib/utils.ts` and the `@base-ui/react`, `class-variance-authority`, `shadcn` packages were only for the deleted button; check before removing.

## Push

PUSH_EVIDENCE

## Open items

**For Mohamed**

1. Approve the headline "Safe, certified electrics for London homes." (claims "certified" and "London homes").
2. Confirm `work-01.jpg` (an open distribution board beside cable trays; looks commercial) may illustrate "Fuse board / consumer unit upgrades & replacements".

**For Ahmed**

1. Create the revert tag from a machine with push rights:

   ```bash
   git tag pre-redesign-2026-11-14 51e43b6
   ```

   ```bash
   git push origin pre-redesign-2026-11-14
   ```

2. Choose a fix for `/` mobile performance (see Lighthouse section).
3. Review the visual changes; label the PR `needs-ahmed`. No PR was opened.
