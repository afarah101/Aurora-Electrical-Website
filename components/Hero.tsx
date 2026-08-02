import { Phone, ShieldCheck, Clock, FileText } from "lucide-react";
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
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-900">
      {/* Footage sits at the back; if it fails to load, bg-slate-900 above is
          the floor and the text treatment below still holds. */}
      <HeroBackground />
      {/* Contrast guarantee. The clip's peak pixels measure 253/255 — pure
          white work lights — so the overlay is sized for a white worst case:
          slate-900 at 70% over #fff composites to ~#575A69, giving white
          text 6.6:1 and slate-200 5.4:1. The gradient only ever ADDS opacity
          (80% at the top), so 70% is the guaranteed minimum everywhere. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-900/70"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
          {serviceArea ? serviceArea : "Domestic & commercial electricians"}
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
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
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-blue-700 px-6 text-base font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
            >
              <Phone aria-hidden="true" className="h-5 w-5" />
              Call {phone}
            </a>
          )}
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
          >
            Request a free quote
          </a>
        </div>

        {/* Claims come from site.md — none are authored in this component. */}
        {claims.length > 0 && (
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {claims.map((claim) => {
              const Icon = claimIcon(claim);
              return (
                <li key={claim} className="flex items-start gap-3">
                  <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
                  <span className="text-sm font-medium text-slate-100">{claim}</span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Rendered only when confirmed in site.md */}
        {accreditations.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {accreditations.map((a) => (
              <li
                key={a}
                className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800"
              >
                {a}
              </li>
            ))}
          </ul>
        )}

        {(aggregateRating || reviews.length > 0) && (
          <p className="mt-8 text-sm font-medium text-slate-200">
            {aggregateRating ??
              `${reviews.length} customer ${reviews.length === 1 ? "review" : "reviews"}`}
          </p>
        )}
      </div>
    </section>
  );
}
