# AI-Slop Audit — Aurora Electricals

Audited: 2026-07-21 · Scope: `app/`, `components/`, `app/globals.css` (1,265 lines)
Benchmark: `ui-ux-pro-max` → "home services electrician" → Trust & Authority
Author's note: this audits code I wrote earlier in the same session. I have tried to
grade it against the skill's checklist rather than my own taste.

---

## Verdict

**Visually it does not read as AI-generated** — the font is not Inter, there are no purple
gradients, no emoji icons, and the copy sounds like a tradesperson rather than a SaaS
landing page. **Structurally it does.** Underneath the surface sit a full set of unused
"brand" design tokens, an untouched greyscale shadcn palette, a dead dark-mode block, a
content parser whose outputs are half-wired, and three invented business claims in the
first screen. The tell is not how it looks; it is that several things which *appear*
implemented are not connected to anything.

---

## STEP 0 — Skill anti-patterns applied

**AVOID list:** `Hidden contact info + No certifications`

- *Hidden contact info* — **not present.** Phone appears in nav, hero, sticky mobile bar,
  contact section and footer, all as `tel:` links.
- *No certifications* — **present, and deliberate.** `site.md:30` forbids displaying an
  unconfirmed NICEIC/NAPIT/Part P mark. The code is right to withhold; the *site* still
  launches missing the strongest trust signal in this trade. This is a client action, not
  a code fix. See Finding 24.

**Pre-delivery checklist:**

| Checklist item | Result |
|---|---|
| No emojis as icons | **PASS** — all lucide SVG |
| `cursor-pointer` on clickables | **FAIL** — zero `cursor-*` classes in the codebase |
| Hover transitions 150–300ms | **PASS** — `transition-colors`/`transition-shadow` throughout |
| Light-mode contrast ≥ 4.5:1 | **PASS** on sampled pairs (slate-900/600/500 on white; slate-100 on slate-900) |
| Focus states visible | **FAIL** — explicit focus styles only in `Hero.tsx` |
| `prefers-reduced-motion` respected | **PASS** — `WorkGallery.tsx:42` |
| Responsive 375/768/1024/1440 | **PARTIAL** — breakpoints present; touch targets fail at 375 |

---

## Findings

| # | Item | file:line | Issue | Sev | Fix |
|---|---|---|---|---|---|
| 1 | Invented availability claim | `components/Hero.tsx:78` | "24/7 emergency call-out" appears nowhere in `site.md`. An operational promise invented on the client's behalf — same class as the accreditation badges the build correctly refused to fabricate | **Critical** | Confirm with client or delete |
| 2 | Invented quote promise | `components/Hero.tsx:72`, `TrustBar.tsx:23` | "Free, no-obligation quote" / "Quoted before work starts" — not in `site.md` | **Critical** | Confirm or delete |
| 3 | Parser breaks on heading rename | `app/content.ts:86,98` | Looks up the literal heading `"Reviews (PLACEHOLDER — replace with real ones)"`. The heading *instructs* the user to replace it; renaming to `## Reviews` silently yields `[]`. Verified: real reviews present, parser returns `[]` | **Critical** | Match on `^## Reviews` prefix |
| 4 | Same coupling, services & clients | `app/content.ts:75,106` | Same literal-heading fragility for `Services (CONFIRMED — build only these)` and `Trusted By / Past Clients (logo strip)` | **Critical** | As above |
| 5 | Logo pipeline is dead | `app/content.ts:113` → `TrustedBy.tsx:33` | `logo` path parsed from `site.md`, never consumed; a hardcoded `Building2` icon always renders. Dropping real logos into `public/clients/` changes nothing | **Critical** | Render `<Image src={client.logo}>` when present |
| 6 | Brand tokens never used | `app/globals.css:54-57` | `--trust-blue`, `--trust-verified`, `--trust-slate` defined under a comment claiming the skill palette is applied — referenced **nowhere**. Components hardcode `blue-800`/`slate-900` | **Warning** | Wire tokens or delete the block |
| 7 | Palette never left greyscale | `app/globals.css:65-91` | `--primary: oklch(0.205 0 0)` — chroma 0. The default shadcn neutral scale is untouched; brand colour never entered the token system | **Warning** | Map `--primary` to the trust blue |
| 8 | Dead dark mode | `app/globals.css:93-125` | 33 lines of `.dark` tokens; nothing ever applies `.dark` and there is no toggle | **Warning** | Delete or implement |
| 9 | Scaffold token dump | `app/globals.css:13-25,77-81` | 8 `--sidebar-*` and 5 `--chart-*` variables inherited from the starter; no sidebar or chart exists | **Warning** | Delete |
| 10 | No `cursor-pointer` | codebase-wide | Explicit skill checklist item; Tailwind v4 does not restore pointer cursor on buttons | **Warning** | Add to buttons/dots |
| 11 | Focus states near-absent | `Nav.tsx:52`, `WorkGallery.tsx:110`, `ContactForm.tsx:161`, `StickyCall.tsx:11` | Only `Hero.tsx` sets `focus-visible`. `globals.css:129` sets `outline-ring/50` (colour only, no width) so keyboard users fall back to browser defaults | **Warning** | Add `focus-visible:outline-2` |
| 12 | Touch targets too small | `components/WorkGallery.tsx:117` | Carousel dots are `h-2 w-2` = 8px; ~44px recommended | **Warning** | Pad to 44px hit area |
| 13 | Incorrect carousel ARIA | `components/WorkGallery.tsx:108-115` | `role="tablist"`/`role="tab"` with no `tabpanel` and no `aria-controls` — announces a tab UI that doesn't exist | **Warning** | Use plain buttons + `aria-label` |
| 14 | Client/server schema drift | `ContactForm.tsx:16` vs `route.ts:15` | Client keeps `.max(0)`, server uses `.optional()`. **Both files carry comments claiming they mirror each other** — both now false | **Warning** | Align and fix comments |
| 15 | One icon for six services | `components/Services.tsx:26` | Identical `Zap` on every card — the classic generated-grid tell | **Warning** | Distinct icon per service |
| 16 | Flat type hierarchy | `globals.css:12`; weights across build | `--font-heading` aliases `--font-sans`; only `font-medium`×19 and `font-semibold`×19, no bold. Size alone carries hierarchy | **Warning** | Load 700; differentiate headings |
| 17 | Grid over-provisioned | `components/TrustedBy.tsx:25` | `lg:grid-cols-4` with 2 clients — two cards stranded in a 4-col grid | **Warning** | `sm:grid-cols-2 lg:grid-cols-3` or centre |
| 18 | Mobile nav ergonomics | `components/Nav.tsx:52-65,75` | Menu button has no padding beyond its 24px icon; drawer links `py-2` ≈ 32px | **Warning** | Pad to 44px |
| 19 | Sandbox email sender | `app/api/contact/route.ts:73` | Falls back to `onboarding@resend.dev`; unverified sender hurts deliverability | **Warning** | Set `FROM_EMAIL` to a verified domain |
| 20 | Rate-limit map never evicted | `app/api/contact/route.ts:26` | `hits` grows unbounded per unique IP | **Info** | Sweep expired keys |
| 21 | Invisible positioning text | `components/TrustBar.tsx:34-40` | Positioning copy rendered `sr-only` — screen-reader users get content sighted users don't | **Info** | Show it or drop it |
| 22 | Dead parser exports | `content.ts:64,70,112,119` | `business.logo`, `contact.whatsapp`, `client.url`, `workPhotoDir` all parsed, none consumed | **Info** | Wire or remove |
| 23 | Stale scaffold naming | `layout.tsx:14`, `globals.css:11` | IBM Plex Mono bound to `--font-geist-mono` | **Info** | Rename |
| 24 | No certifications displayed | (absence) | Correct per `site.md:30`, but the skill names this an explicit AVOID for this industry — the site ships without its strongest trust signal | **Info** | Client to confirm accreditation |
| 25 | Boilerplate footer line | `components/Footer.tsx:51` | "All rights reserved." — filler | **Info** | Drop or replace |

---

## Genuinely good — not padded

- **Typography** `layout.tsx:2` — IBM Plex Sans, deliberately not Inter, and no Geist default.
- **Colour restraint** `Hero.tsx:32` — one subtle `slate-50 → white` gradient. No purple/pink/blue AI gradient anywhere.
- **Icons** — 100% lucide SVG; zero emoji.
- **Copy** — no "Welcome to", no "Your trusted partner", no benefit-speak. `Services.tsx:16` ("a single socket or a full commercial installation") reads like the trade.
- **Motion** — autoplay only, reduced-motion honoured, pause on hover/focus. Nothing decorative.
- **Sticky-bar collision handled** `Footer.tsx:21` — `pb-20 sm:pb-0` clears the fixed mobile call bar. Easy to miss.
- **Honest empty states** — `Reviews.tsx:13` and the accreditation guard in `Hero.tsx:90` omit rather than fabricate.
- **Honeypot** `route.ts:53` — silent 200, no signal to bots.
- **Contact prominence** — directly counters the skill's primary AVOID.

---

## Top 5 fixes, in order

1. **Remove or confirm the three invented claims** (Findings 1–2, `Hero.tsx:72,78`, `TrustBar.tsx:23`). The build was scrupulous about not inventing accreditations, then invented a 24/7 availability promise. Highest risk on the page.
2. **Decouple the parser from placeholder heading text** (Findings 3–4, `content.ts:75,86,98,106`). The "self-populates when real data lands" promise fails the moment the user does what `site.md` tells them to do. Silent, and would be blamed on the content, not the code.
3. **Wire the logo pipeline** (Finding 5, `content.ts:113` → `TrustedBy.tsx:33`). Logos are already being sourced; today they'd land in `public/clients/` and display nothing.
4. **Resolve the token layer** (Findings 6–9, `globals.css:54-125`). Either drive the components from tokens or delete ~60 lines of decorative CSS. Right now the file claims a design system the components ignore.
5. **Fix focus and touch targets** (Findings 10–13, 18). Keyboard and 375px users are the ones actually failing the skill checklist.

---

## Scope

Read-only audit. No source file modified; `AUDIT-ai-slop.md` is the only new file.
Parser fragility (Finding 3) was verified against a scratchpad copy of `site.md`,
leaving the original untouched.
