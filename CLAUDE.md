@AGENTS.md

# Project

Marketing site for Aurora Electrical, a domestic and commercial electrician in south-west London. It exists to turn visitors into phone calls, WhatsApp messages and contact-form enquiries.

- Client: Aurora Electrical. Mohamed is the client contact and approves content before it goes live.
- Built and maintained by Ahmed (afarah101).
- Live site: https://www.aurora-electricals.com (the bare domain redirects there). Hosted on Vercel, which deploys from GitHub.
- Business facts and open placeholders live in `content/site.md`. Treat anything marked PLACEHOLDER as unconfirmed and do not invent a value for it.

# External services

- Resend sends the contact-form email (`app/api/contact/route.ts`). It needs `RESEND_API_KEY`. `TO_EMAIL` and `FROM_EMAIL` are optional and fall back to the business email and `onboarding@resend.dev`.
- Vercel Analytics is wired in through `@vercel/analytics` and needs no env var.
- Google Fonts are fetched by `next/font/google` at build time, so the build needs network access to Google.
- The MyBuilder profile and reviews are linked, not fetched through an API.

The build itself needs no secrets. Secret values live in the Vercel dashboard and in `.env.local`, which is never read or committed.

# Needs Ahmed's sign-off

- Any visual design change: layout, colours, type, imagery, motion.
- Any client-facing claim or content: prices, service areas, hours, registrations such as NICEIC, reviews and client logos.
- Anything that changes how enquiries reach the client, such as form fields or the email recipient.
- Any change to `.github/workflows/`, `.claude/` (settings, hooks) or `CLAUDE.md`. The Claude review skips PRs that change its own workflow, so a person must read these.
- Merging anything in the list above. For those PRs, add the label `needs-ahmed` and do not turn on auto-merge.

Code fixes that leave the rendered site unchanged, such as lint, types, accessibility fixes and refactors, can go ahead without asking. Push them on a feature branch, open a PR and turn on auto-merge. GitHub merges the PR once `verify` and `review` pass. Never push to `main`.
