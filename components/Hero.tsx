import { Phone, ShieldCheck, Clock, FileText, Star } from "lucide-react";
import { claims as siteClaims, type Review } from "@/app/content";
import { HeroBackground } from "@/components/HeroBackground";

type Props = {
  businessName: string;
  tagline: string | null;
  serviceArea: string | null;
  phone: string | null;
  telLink: string | null;
  /** Defaults to the Claims section of site.md; injectable for tests. */
  claims?: string[];
  accreditations: string[];
  aggregateRating: string | null;
  reviews: Review[];
};

/**
 * Claims are authored in site.md, not here, so removing one there removes it
 * from the page. Icon is chosen from the claim's wording; anything unrecognised
 * gets the neutral mark rather than inventing a meaning for it.
 */
function claimIcon(claim: string) {
  const c = claim.toLowerCase();
  if (/emergency|24\/7|24-7|out of hours/.test(c)) return Clock;
  if (/quote|estimate|pricing/.test(c)) return FileText;
  return ShieldCheck;
}

/**
 * Trust signals in the first screen. No claim is authored here — every one is
 * read from the Claims section of site.md, so a promise the client has not made
 * cannot appear on the page. Accreditation and rating blocks likewise render
 * only when site.md confirms them, because an unearned NICEIC/NAPIT mark is a
 * regulated claim, not a styling detail.
 */
export function Hero({
  businessName,
  tagline,
  serviceArea,
  phone,
  telLink,
  claims = siteClaims,
  accreditations,
  aggregateRating,
  reviews,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      {/* Footage sits at the back; if it fails to load, bg-slate-900 above is
          the floor and the text treatment below still holds. */}
      <HeroBackground />
      {/* Contrast guarantee. The clip's peak pixels measure 253/255 — pure
          white work lights — so the overlay is sized for a white worst case:
          slate-900 at 70% over #fff composites to ~#575A69, giving white
          text 6.6:1 and slate-200 5.4:1. The lightest stop is the /70 middle;
          the bottom runs to SOLID slate-900 so the footage fades out into the
          TrustBar's surface with no opacity jump and no border seam. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-900"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <p className="font-mono text-sm font-medium uppercase tracking-widest text-slate-300">
          {serviceArea ? serviceArea : "Domestic & commercial electricians"}
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {tagline ?? `${businessName} — electrical work for homes and businesses`}
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-200">
          Rewiring, fuse boards, fault-finding and installations — carried out for
          homeowners and commercial premises alike.
        </p>

        {/* Primary actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {telLink && (
            <a
              href={`tel:${telLink}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-action px-6 text-base font-semibold text-white transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
            >
              <Phone aria-hidden="true" className="h-5 w-5" />
              Call {phone}
            </a>
          )}
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
          >
            Request a free quote
          </a>
        </div>

        {/* Claims come from site.md — none are authored in this component.
            The review proof sits inline with them: same row, same trust
            voice, but it links to the evidence. Stars are justified by
            site.md's own "All are 5 stars" line. */}
        {claims.length > 0 && (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {claims.map((claim) => {
              const Icon = claimIcon(claim);
              return (
                <li key={claim} className="flex items-start gap-3">
                  <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-trust-bright" />
                  <span className="text-sm font-medium text-slate-100">{claim}</span>
                </li>
              );
            })}
            {(aggregateRating || reviews.length > 0) && (
              <li>
                <a
                  href="#reviews"
                  className="flex items-start gap-3 rounded-md hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
                >
                  <span
                    role="img"
                    aria-label="5 out of 5 stars"
                    className="mt-0.5 flex shrink-0 items-center gap-0.5"
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        className="h-3.5 w-3.5 fill-trust-bright text-trust-bright"
                      />
                    ))}
                  </span>
                  <span className="text-sm font-medium text-trust-bright">
                    {aggregateRating ??
                      `${reviews.length} customer ${reviews.length === 1 ? "review" : "reviews"}`}
                  </span>
                </a>
              </li>
            )}
          </ul>
        )}

        {/* Rendered only when confirmed in site.md */}
        {accreditations.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {accreditations.map((a) => (
              <li
                key={a}
                className="rounded-md border border-trust-line bg-trust-soft px-3 py-1.5 text-sm font-semibold text-trust-deep"
              >
                {a}
              </li>
            ))}
          </ul>
        )}

      </div>
    </section>
  );
}
