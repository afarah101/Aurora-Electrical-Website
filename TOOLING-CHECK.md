# Tooling Pre-Flight — Animated Hero Build

Checked: 2026-07-22 · Read-only. Nothing installed or modified.

## Verdict

**Ready.** Every runtime, skill, and declared dependency is present and installed,
the build is clean, and the working tree carries only two untracked report files.
A vanilla canvas- or SVG-based hero animation needs **no new package** — it uses
React, `requestAnimationFrame`, and the DOM, all already here. A new dependency is
required **only** if you choose a library-based approach (see Check 4).

## 1. Runtimes

| Tool | Version | Status |
|---|---|---|
| Node | v22.22.2 | OK (need 18+) |
| npm | 11.13.0 | OK |
| Python 3 | 3.14.5 | OK (3.x, for the design skill) |

## 2. Skills present

`banner-design` · `brand` · `design` · `design-system` · `slides` · `ui-styling` · `ui-ux-pro-max`

- `ui-ux-pro-max/SKILL.md` — present (46 KB).
- `search.py "hero animation" --design-system` — runs clean (exit 0). Returned the
  "Immersive/Interactive Experience" pattern. **Note:** it recommends *Neumorphism*
  (⚠ low contrast, dark-mode partial) — the opposite of the Trust & Authority
  direction this site was built to. Read its output as a menu, not an instruction;
  a low-contrast embossed hero would regress the WCAG work just committed.

## 3. Dependencies (installed, not just declared)

| Package | Resolved version | Installed? |
|---|---|---|
| next | 16.2.11 | ✓ (16+) |
| react | 19.2.4 | ✓ |
| tailwindcss | 4.3.3 | ✓ (v4) |
| react-hook-form | 7.82.0 | ✓ |
| zod | 4.4.3 | ✓ |
| resend | 6.18.0 | ✓ |
| lucide-react | 1.25.0 | ✓ |
| embla-carousel-react | 8.6.0 | ✓ |
| @vercel/analytics | 2.0.1 | ✓ |

Each version was read from `node_modules/<pkg>/package.json`, not from `package.json`,
so these are the actually-resolved installs.

## 4. Animated-hero readiness

**A vanilla canvas/SVG background animation needs nothing that isn't already installed.**
It runs on React refs + `requestAnimationFrame` (canvas) or CSS/SVG animation — no package.

A new dependency is needed **only** if the intended approach is library-based. If so, the
relevant option and its install command (do **not** run without your say-so):

| Approach | Package | Install (unrun) |
|---|---|---|
| Declarative React animation | `motion` (formerly framer-motion) | `npm i motion` |
| Timeline / scroll-driven | `gsap` | `npm i gsap` |
| 3D / WebGL | `three` + `@react-three/fiber` | `npm i three @react-three/fiber` |

Recommendation: for a Trust & Authority electrician site the brief called *restrained,
non-decorative* motion. A hand-rolled canvas/SVG effect (or CSS) meets that with zero
new dependencies and no bundle cost — reach for a library only if the design genuinely
needs physics, 3D, or complex sequencing.

## 5. Build health

`npm run build` — **clean.** Compiled in ~1.9s, TypeScript passed, 5/5 static pages,
`/api/contact` dynamic. Zero errors, zero warnings. (The workspace-root warning seen
earlier in the project is gone — the stray `~/package-lock.json` that caused it no
longer exists.)

## 6. Git

- `git status` — only `AUDIT-ai-slop.md` and this file untracked; no tracked file modified.
- Recent commits:
  - `9558591` Fix accessibility and touch-target findings from the audit
  - `f56ecd5` Make Trusted By and the content pipeline real
  - `451e50d` Fix client logo paths for Next public serving

## One caveat, not a blocker

Browser **screenshots return blank in this environment** (confirmed across the two
previous build tasks — the accessibility tree and DOM render fine, but captured images
are white). Layout and computed styles can be verified via geometry (`getBoundingClientRect`,
`getComputedStyle`) and the a11y tree, but I **cannot visually confirm** an animation's
appearance or smoothness here. Plan to verify motion in a real browser, or accept that
my sign-off on the hero will be structural (frames advancing, reduced-motion honoured,
no layout shift) rather than visual.
