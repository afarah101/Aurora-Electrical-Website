# Phone hero layout: headline first, video below

Branch `redesign/phase-1-prototypes`, from `fbb6a0b`. Checked on 14 Nov 2026 against a production build (`npm run build && npm run start`). One try was needed (limit 6).

## Change

`components/Hero.tsx`, one element: the copy column gets `max-md:flex max-md:min-h-[calc(100svh-var(--spacing-nav)-3rem)] max-md:flex-col max-md:justify-center`, plus a comment.

- Below 768px, the copy column fills the first screen. The headline, both buttons and the proof list (including "Free, no-obligation quote") sit centred in it. The video frame starts below the first screen.
- The video, its poster `<img>` and the pause control are unchanged and still render.
- At 768px and wider, no class applies (`max-md:` only).
- `app/globals.css` (the hero stylesheet) needed no change.

## Checks

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Lighthouse mobile `/`, median of 5 ≥ 90 | PASS | Lighthouse 13.6.0, mobile preset: 99, 99, 100, 100, 100. Median 100 (was 86). FCP 0.9s, LCP 0.9s, CLS 0, TBT 40–140ms. |
| 2 | Accessibility 100 on all 5 runs | PASS | 100, 100, 100, 100, 100. |
| 3 | LCP element is the headline | PASS | All 5 runs: `section.bg-surface > div.mx-auto > div.max-md:flex > h1.animate-hero-rise` (`<h1 class="animate-hero-rise font-heading text-[2.5rem] …">`). Before: `img.absolute` (hero poster). |
| 4 | Screenshots; 1024 and 1440 match `review/final2/` | PASS | `review/hero-mobile/home-{375,768,1024,1440}.png` (2× scale). Pixel diff against `review/final2/home-*.png`, video frame masked (its frame changes as it plays): 0 differing pixels at 768, 1024 and 1440. Frame top at 412×823: 863px. At 375×812: 852px (before: 581px). |
| 5 | Only the hero files changed | PASS | `git diff --stat`: `components/Hero.tsx | 5 ++++-` (code). The commit also adds this report and the 4 screenshots, which the task requires. |
| 6 | No visible string changed | PASS | The diff adds one `className` and one JSX comment. No text node, label or prop value changed. |
| 7 | Build clean | PASS | `npm run build` exit 0, 0 lines matching "warn" or "error". `tsc --noEmit` clean, `npm run lint` clean. Browser console at 412, 375, 768, 1024, 1440: 0 errors, 0 warnings. |

## Notes

- On phones the first screen now has about 130px of empty space above the headline, from the vertical centring. Ahmed should review this visually (`home-375.png`).
- Real phones show the footage after one scroll; it still plays only while visible.
