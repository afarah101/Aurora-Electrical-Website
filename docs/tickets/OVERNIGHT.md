# Overnight polish — tickets T1–T3

Branch `feat/overnight-polish` from `feat/pull-cord` (`1cba136`). One commit per ticket. One PR, base `feat/pull-cord`, label `needs-ahmed`, auto-merge off.

Do not touch: any href, `tel:` or `wa.me` link, gads code, headline and subcopy wording, photos, `.env` files, `.claude/`, `CLAUDE.md`. No merge, no deploy, no push to `main`.

## T1 Hero + pull cord

- [x] `Hero.tsx`: remove `"use client"`. New `components/HeroPullCord.tsx` (`"use client"`) holds the cord, the `#reviews` link and the scroll logic.
- [x] `pull-cord.tsx`: the first pull turns the lamp on, and it stays on. Every pull scrolls to `#reviews`.
- [x] The label "Pull the cord to see reviews" sits on one line (`whitespace-nowrap`) beside the lamp. The lamp top aligns with the rating block.
- [x] Cut the top padding above the eyebrow by about 40%.
- [x] Rating: stars use the gold trust token. Text: "4.9 from 82 verified reviews on MyBuilder". Remove "(as AE Electrical)".
- [x] Trust strip under the hero: replace "Homeowners & businesses" and "London" with 3–4 claims that already appear elsewhere on the site. Add no new claim.
- [x] Find the round element cut off at the right viewport edge. Keep it fully on screen with a 16px gap.

Checks: no `"use client"` in `Hero.tsx`, and the home route builds static (○). Claim → file:line for each strip claim. "(as AE Electrical)" is absent from the built HTML.

Evidence:
- `grep -c 'use client' components/Hero.tsx` → `0`. Build route table: `┌ ○ /` (static).
- Pull cord: new `latch` prop in `pull-cord.tsx`; `toggle()` uses `const next = latch ? true : requested`. `onPull` still fires on every pull, tap, Enter and Space, and `HeroPullCord` scrolls to `#reviews` each time.
- Label: built HTML has `class="whitespace-nowrap rounded-sm text-[14px] …"`. Negative margins (`-ml-8 -mr-10`) trim the drawing's empty sides, so lamp + label take about 270px and fit on one line at 320px. Desktop row is `lg:items-start`, so the lamp top lines up with the rating block (both `mt-6`).
- Padding: `py-12` → `pt-7 pb-12` (48px → 28px, −42%); `lg:py-16` → `lg:pt-10 lg:pb-16` (64px → 40px, −38%).
- Rating: stars keep `text-trust` (the gold trust token). Built text: `4.9 from 82 verified reviews on MyBuilder`, still read from `site.md`. `grep -o 'as AE Electrical'` over every built HTML file → `0`.
- Trust strip (built `index.html`; "Homeowners &amp; businesses" → 0 matches):
  - NICEIC registered → `content/site.md:33`; also `components/Hero.tsx:57` (eyebrow).
  - Same-day callouts → `content/site.md:55`.
  - Free, no-obligation quote → `content/site.md:56`; also `components/ContactForm.tsx:118`.
  - Offers warranty → `content/site.md:74`; also `components/MyBuilderBadge.tsx:57`.
  - "24/7" appears nowhere on the site, so it is not used.
- Cut-off round element: the only round elements anchored to the right viewport edge are the nav pill (`rounded-full`) and its round menu button. `HeroBackground`'s round button is not rendered. The header gutter goes `px-3` → `px-4` (12px → 16px) and the right button group gets `shrink-0`, so the pill and button keep a 16px gap. No browser was allowed, so this was found from the code, not a screenshot.
- Links: `tel:`, `wa.me` and gads lines diffed against `feat/pull-cord` → identical.

## T2 Wordmark logo

- [x] New `components/Wordmark.tsx`: live text, not an image. Lucide `Zap` in the gold trust token, then "Aurora" in the heading font (600, tracking -0.02em, ink), then "ELECTRICAL" in the mono font (uppercase, wide tracking, ink-subtle, smaller).
- [x] Use it in `Nav.tsx` and the footer in place of the logo image. Keep the link and add `aria-label="Aurora Electrical home"`.
- [x] Keep `public/aurora-logo*.png`. Delete no file.

Checks: the nav and footer render no `aurora-logo` image. The Wordmark has an accessible name. The header height does not grow.

Evidence:
- Wordmark classes: `Zap` → `fill-trust text-trust`; "Aurora" → `font-heading text-lg font-semibold tracking-[-0.02em] text-ink`; "Electrical" → `font-mono text-[10px] uppercase tracking-[0.18em] text-ink-subtle`.
- Built `index.html`, inside `<nav aria-label="Main">`: 0 `<img>`, 0 `aurora-logo`, 1 wordmark link (`href="#top"`). Inside `<footer>`: 0 `<img>`, 0 `aurora-logo`, 1 wordmark link (`href="/"`).
- Accessible name: `aria-label="Aurora Electrical home"` on the link, on every page (2 per page: nav + footer). The visible spans are `aria-hidden`.
- Header height: the nav pill is `h-[60px]` before (`feat/pull-cord`) and after. The wordmark is 18px tall inside it.
- Files kept: `public/aurora-logo.png` and `public/aurora-logo-nav.png` still exist. The only remaining `aurora-logo` reference is the JSON-LD `logo` URL from `app/layout.tsx`, which is not a rendered image and is unchanged.
- Choices: the nav link stays `href="#top"`, because the brief forbids changing any href; the footer had no link, so its wordmark links to `/`. Below 360px the "ELECTRICAL" line is hidden so the nav still fits beside its buttons; the accessible name is unchanged. The footer's text business name is replaced by the wordmark; the © line still shows the name.

## T3 Pill buttons (all Call and WhatsApp buttons)

- [ ] Fully rounded pills (`rounded-full`), icon left, 48px high, same padding on both.
- [ ] Call: ink fill, cream text. WhatsApp: white fill, ink-subtle 1px border, green glyph only.
- [ ] Hover (fine pointer only): lift 1px, soft shadow. Press: scale 0.98. No motion under reduced motion.

Checks: text-to-fill contrast ≥4.5:1 for both, normal and hover.

Evidence: _pending_
