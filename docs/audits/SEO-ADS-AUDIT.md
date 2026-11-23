# SEO and Google Ads landing-page audit

- Site: https://www.aurora-electricals.com
- Source: `main` at the time of this audit, built with `npm run build`. Evidence comes from the source files and the built HTML in `.next/server/app/*.html`.
- This audit is read-only. It changes no site file.
- The pages are audited from their code. No browser was opened, and Ahmed does the visual checks.

## Top 5 fixes (ranked by impact)

1. **High (ranking).** The home `<title>` and meta description do not contain "London" (`app/layout.tsx:44`, `app/layout.tsx:35`). Add it, for example `Aurora Electrical | Domestic & Commercial Electrician London` (60 chars).
2. **High (Quality Score, CTR).** The ads landing-page titles are 94 and 91 chars, and the emergency description is 175 chars (`app/emergency-electrician/page.tsx:14-17`, `app/eicr-landlords/page.tsx:20`). Google truncates them. Use `title.absolute`, for example `Emergency Electrician South-West London | Aurora Electrical` (59) and `Landlord EICR South-West London | Aurora Electrical` (51).
3. **High (Quality Score, landing-page experience).** `/emergency-electrician` shows no price or call-out fee (built HTML has no `£`). A searcher who wants an emergency fix wants to know the cost. This needs a business fact from Mohamed.
4. **Medium (local ranking).** The JSON-LD has no `areaServed`, and `sameAs` has no Google Business Profile (`app/layout.tsx:84-85`). `areaServed` is empty because `Service area` is a PLACEHOLDER (`content/site.md:14`).
5. **Medium (CTR from shares, ad previews).** Every sub-page inherits the home `openGraph` and `twitter` tags, and `og:url` is the home URL on every page (`app/layout.tsx:48-68`). Add `openGraph: { title, description, url }` to each page's `metadata`.

## Site-wide

| Check | Result | Evidence | Fix |
| --- | --- | --- | --- |
| 4. JSON-LD block is `Electrician` with name "Aurora Electrical" | PASS | `app/layout.tsx:75-76`; built `index.html` `"@type":"Electrician","name":"Aurora Electrical"` | None |
| 4. `telephone` | PASS | `app/layout.tsx:82` gives `+447304150154` | None |
| 4. `url` | PASS | `app/layout.tsx:79` gives `https://www.aurora-electricals.com` | None |
| 4. `areaServed` | FAIL | `app/layout.tsx:84` is conditional on `contact.serviceArea`, which is a PLACEHOLDER at `content/site.md:14`, so the field is missing | Confirm the service area (see "Needs Ahmed or Mohamed") |
| 4. `sameAs`: MyBuilder | PASS | `app/layout.tsx:85` gives `https://www.mybuilder.com/profile/ae-electrical-1` (`content/site.md:76`) | None |
| 4. `sameAs`: Google Business Profile | FAIL | `app/layout.tsx:85` has only the MyBuilder URL | Add the GBP URL when it is known |
| 4. Street address shown that GBP hides | PASS | The JSON-LD has no `address`, and no page text has a street address or postcode (grep of `app`, `components`, `content`) | None. Keep the address out while GBP is a service-area business |
| 4. JSON-LD `logo` | WARN | `app/layout.tsx:81` points to `aurora-logo.png` (789 KB) | Use a smaller logo file, at least 112×112 px |
| 5. robots.txt exists and blocks nothing important | PASS | `app/robots.ts:6` gives `Allow: /`, `Disallow: /api/`, and sitemap is listed | None |
| 5. sitemap.xml lists every route | PASS | `app/sitemap.ts:5-11` has `/`, `/emergency-electrician`, `/eicr-landlords`, `/contact`, `/privacy`. This matches the build route list | Optional: drop `/privacy` because it is `noindex` (`app/privacy/page.tsx:13`) |
| 6. Images over 300 KB in `public/` | FAIL | All 19 `public/work/work-*.jpg` files are between 331 KB and 2.99 MB (largest `work-09.jpg` 2,985,728 B). Also `aurora-logo.png` 788,729 B and `aurora-share.png` 537,043 B | The work photos go through `next/image`, so visitors get resized files (Low). Compress `aurora-share.png` below 300 KB for WhatsApp previews. Compress the originals to cut build and repo size |
| 7. Name, phone and email are the same on every page | PASS | All 5 built pages have only `tel:+447304150154`, `https://wa.me/447304150154`, `mailto:aurora.electrical@outlook.com` and text `07304 150154`. Source: `content/site.md:9-12` | None. See the MyBuilder trading-name note below |
| 8. "+VAT" wording | PASS | No page has "VAT" (grep of the built HTML gives 0). `content/site.md:13` says the business is not VAT registered | None |

## `/` (home)

| Check | Result | Evidence | Fix |
| --- | --- | --- | --- |
| 1. Title 50–60 chars | PASS | "Aurora Electrical - Domestic & Commercial Electricians" is 54 chars (`app/layout.tsx:44`) | None |
| 1. Title has the service and "London" | FAIL | No "London" (`app/layout.tsx:44`) | `Aurora Electrical \| Domestic & Commercial Electrician London` (60) |
| 1. Description 140–160 chars | PASS | 154 chars (`app/layout.tsx:35`) | None |
| 1. Description has "London" | FAIL | No "London" (`app/layout.tsx:35`) | Add "in London" and keep it at 160 chars or fewer |
| 1. Title and description unique | PASS | No other page uses them (built HTML) | None |
| 2. Exactly one `<h1>` | PASS | `components/Hero.tsx:59` is "Safe, certified electrics for London homes." | None |
| 2. Heading order has no gaps | PASS | Built order is h1 → h2 → h3 → h2 (`index.html`) | None |
| 3. Canonical | PASS | `app/layout.tsx:42` gives `https://www.aurora-electricals.com` | None |
| 3. OG title, description, image | PASS | `app/layout.tsx:48-61`, image `aurora-share.png` 1200×630 | None |
| 6. Every `<img>` has alt | PASS | `components/Hero.tsx:124,135`, `components/Services.tsx:50`, `components/TrustedBy.tsx:53`, `components/WorkGallery.tsx:109`. `alt=""` appears only on the decorative poster (`components/HeroBackground.tsx:68`) and on the hidden gallery slides | None |
| 6. Every `<img>` has width and height | FAIL | `fill` images have no `width` and `height`: `components/Hero.tsx:125,136`, `components/Services.tsx:51`, `components/WorkGallery.tsx:111`. The plain `<img>` at `components/HeroBackground.tsx:68` has none either. Only `components/TrustedBy.tsx:54-55` sets them | Low: `fill` sits in a sized parent, so the layout does not shift. Add `width` and `height` to the poster `<img>` |

## `/emergency-electrician` (Ads landing page)

| Check | Result | Evidence | Fix |
| --- | --- | --- | --- |
| 1. Title 50–60 chars | FAIL | 94 chars, "Emergency Electrician in Wandsworth, Battersea, Chelsea, Fulham and Putney \| Aurora Electrical" (`app/emergency-electrician/page.tsx:14`) | `title: { absolute: "Emergency Electrician South-West London \| Aurora Electrical" }` (59) |
| 1. Title has "London" | FAIL | It lists boroughs only (`app/emergency-electrician/page.tsx:14`) | As above |
| 1. Description 140–160 chars | FAIL | 175 chars (`app/emergency-electrician/page.tsx:15-17`) | Shorten it, for example drop "a burning smell or sparking sockets" |
| 1. Description has "London" | FAIL | It lists boroughs only | Add "South-West London" |
| 2. Exactly one `<h1>`; no heading gaps | PASS | `app/emergency-electrician/page.tsx:30`, then h2 at `:58` and `:70` | None |
| 3. Canonical | PASS | `app/emergency-electrician/page.tsx:18` | None |
| 3. OG title, description, URL | FAIL | The page inherits the home OG. `og:url` is the home URL (`app/layout.tsx:48-61`; no `openGraph` in the page `metadata`) | Add `openGraph` to the page `metadata` |
| 8. Headline matches "emergency electrician London" | PASS | H1 "Emergency Electrician in South-West London" (`app/emergency-electrician/page.tsx:30-32`) | None |
| 8. Call above the fold | PASS | The Call button comes right after the H1 and one paragraph (`app/emergency-electrician/page.tsx:43-50`). There is also a nav Call (`components/Nav.tsx:129`) and `StickyCall` (`:95`) | None |
| 8. Prices clear | FAIL | The built HTML has no `£` and no call-out fee | Mohamed gives the call-out fee (see below) |
| 9. Links to `/contact` | PASS | `app/emergency-electrician/page.tsx:87` | None |
| 9. Links back home | PASS | Footer wordmark `href="/"` (`components/Footer.tsx:34`) and nav `/#…` links (`components/Nav.tsx:12-18`) | Low: the nav wordmark goes to `#top`, not `/`, on sub-pages (`components/Nav.tsx:109`). Use `/` on sub-pages |

## `/eicr-landlords` (Ads landing page)

| Check | Result | Evidence | Fix |
| --- | --- | --- | --- |
| 1. Title 50–60 chars | FAIL | 91 chars (`app/eicr-landlords/page.tsx:20`) | `title: { absolute: "Landlord EICR South-West London \| Aurora Electrical" }` (51) |
| 1. Title has "London" | FAIL | It lists boroughs only | As above |
| 1. Description 140–160 chars | PASS | 141 chars (`app/eicr-landlords/page.tsx:21-23`) | None |
| 1. Description has "London" | FAIL | It lists boroughs only | Add "South-West London" and keep it at 160 chars or fewer |
| 2. Exactly one `<h1>`; no heading gaps | PASS | `app/eicr-landlords/page.tsx:35`, then h2 at `:49` and `components/EicrPricing.tsx:19` | None |
| 3. Canonical | PASS | `app/eicr-landlords/page.tsx:24` | None |
| 3. OG title, description, URL | FAIL | The page inherits the home OG (`app/layout.tsx:48-61`) | Add `openGraph` to the page `metadata` |
| 8. Headline matches "landlord EICR London" | PASS | H1 "EICR for Landlords in South-West London" (`app/eicr-landlords/page.tsx:35-37`) | Optional: put "Landlord EICR" first so the headline matches the search word for word |
| 8. Call above the fold | PASS | `app/eicr-landlords/page.tsx:56-62`, plus nav Call and `StickyCall` (`:79`) | None |
| 8. Prices clear | PASS | £160 / £220 / £260 / £300 and "call for quote" for 6+ bedrooms (`components/EicrPricing.tsx:8-12`), rendered at `app/eicr-landlords/page.tsx:76` | None |
| 9. Links to `/contact` | PASS | `app/eicr-landlords/page.tsx:68` | None |
| 9. Links back home | PASS | `components/Footer.tsx:34`, `components/Nav.tsx:12-18` | The same nav wordmark note as above |

## `/contact`

| Check | Result | Evidence | Fix |
| --- | --- | --- | --- |
| 1. Title 50–60 chars | FAIL | "Contact \| Aurora Electrical" is 27 chars (`app/contact/page.tsx:9`) | For example `Contact an Electrician in South-West London \| Aurora Electrical`, cut to 60 chars or fewer |
| 1. Description 140–160 chars | FAIL | 93 chars (`app/contact/page.tsx:10`) | Lengthen it with the phone, WhatsApp and free quote |
| 1. Has "London" | PASS (description) / FAIL (title) | `app/contact/page.tsx:9-10` | As above |
| 2. Exactly one `<h1>` | FAIL | There is no `<h1>`. The page starts at h2 "Request a free quote" (`components/ContactForm.tsx:113`) | Add a page `<h1>`, or let `ContactForm` take a heading level |
| 3. Canonical | PASS | `app/contact/page.tsx:11` | None |
| 3. OG title, description, URL | FAIL | The page inherits the home OG | Add `openGraph` to the page `metadata` |

## `/privacy`

| Check | Result | Evidence | Fix |
| --- | --- | --- | --- |
| 1. Title and description length | N/A | 34 and 51 chars (`app/privacy/page.tsx:9-10`). The page is `noindex` (`:13`), so it does not rank | None |
| 2. Exactly one `<h1>` | PASS | `app/privacy/page.tsx:24` | None |
| 3. Canonical | PASS | `app/privacy/page.tsx:11` | None |
| 3. OG | N/A | It inherits the home OG. This is not important for a `noindex` page | None |

## Other routes

- `/api/contact` is blocked in robots and is not a page.
- `/icon.png`, `/robots.txt` and `/sitemap.xml` are metadata files. They need no SEO checks.

## Needs Ahmed or Mohamed

- **Service area** (`content/site.md:14`, PLACEHOLDER). Confirm the boroughs or postcodes. The answer fills JSON-LD `areaServed` and the home and footer text.
- **Google Business Profile URL.** Give the URL to add to `sameAs`. Also confirm that the GBP hides the street address. The site shows no address now, which is correct if it does.
- **Emergency call-out price.** Give the fee, or the words to use, for `/emergency-electrician`. Without a price, the ad landing page scores lower.
- **Trading name.** MyBuilder lists "AE Electrical" (`content/site.md` MyBuilder section). The site and JSON-LD say "Aurora Electrical". Different names across listings weaken local ranking. Confirm the name to use everywhere.
- **Logo file** (`content/site.md:6`, PLACEHOLDER). Confirm the final logo for JSON-LD `logo`.
