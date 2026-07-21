import { Phone, ShieldCheck, Clock, FileText } from "lucide-react";
import type { Review } from "@/app/content";

type Props = {
  businessName: string;
  tagline: string | null;
  serviceArea: string | null;
  phone: string | null;
  telLink: string | null;
  accreditations: string[];
  aggregateRating: string | null;
  reviews: Review[];
};

/**
 * Trust signals in the first screen. Every claim here is either structural
 * (24/7, free quote) or sourced from site.md. Accreditation and rating blocks
 * render only when site.md confirms them — never as placeholders, because an
 * unearned NICEIC/NAPIT mark is a regulated claim, not a styling detail.
 */
export function Hero({
  businessName,
  tagline,
  serviceArea,
  phone,
  telLink,
  accreditations,
  aggregateRating,
  reviews,
}: Props) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-800">
          {serviceArea ? serviceArea : "Domestic & commercial electricians"}
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          {tagline ?? `${businessName} — electrical work for homes and businesses`}
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          Rewiring, fuse boards, fault-finding and installations — carried out for
          homeowners and commercial premises alike, with a clear quote before any
          work begins.
        </p>

        {/* Primary actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {telLink && (
            <a
              href={`tel:${telLink}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-blue-800 px-6 text-base font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              <Phone aria-hidden="true" className="h-5 w-5" />
              Call {phone}
            </a>
          )}
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
          >
            Request a free quote
          </a>
        </div>

        {/* Structural guarantees — true regardless of pending confirmations */}
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          <li className="flex items-start gap-3">
            <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" />
            <span className="text-sm font-medium text-slate-700">
              Free, no-obligation quote
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Clock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" />
            <span className="text-sm font-medium text-slate-700">
              24/7 emergency call-out
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" />
            <span className="text-sm font-medium text-slate-700">
              Domestic &amp; commercial work
            </span>
          </li>
        </ul>

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
          <p className="mt-8 text-sm font-medium text-slate-700">
            {aggregateRating ??
              `${reviews.length} customer ${reviews.length === 1 ? "review" : "reviews"}`}
          </p>
        )}
      </div>
    </section>
  );
}
