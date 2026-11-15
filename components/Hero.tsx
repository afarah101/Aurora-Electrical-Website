import { ArrowUpRight, Phone } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { Review } from "@/app/content";

type Props = {
  businessName: string;
  tagline: string | null;
  phone: string | null;
  telLink: string | null;
  whatsapp: string | null;
  /** From the Claims section of site.md. */
  claims: string[];
  accreditations: string[];
  /** Real reviews from site.md; they fill the job book. */
  reviews: Review[];
  /** From the "## MyBuilder" section of site.md (lib/mybuilder.ts). */
  rating: string | null;
  ratingOutOf: string | null;
  reviewCount: string | null;
  verified: boolean;
  /** MyBuilder trading name, shown so the reviews match the profile. */
  mybuilderName: string | null;
  mybuilderUrl: string | null;
};

/*
 * Adapted from 21st.dev "Ledger Hero C" (Quillmoth Studio). The invoice
 * sheet becomes a job book of real reviewed jobs, the "Handled" stamp
 * becomes the MyBuilder "Verified" stamp, the timeline shows what happens
 * after a call, and the stat strip carries the rating and NICEIC.
 * Every fact is read from content/site.md; a missing value renders nothing.
 */

const SERIF = "var(--font-heading)";
const MONO = "var(--font-mono)";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-action-soft";

/** site.md stores "Clapham, London — Job: New pendant light installation". */
function splitArea(area: string): { place: string; job: string | null } {
  const [place, job] = area.split(/\s*—\s*Job:\s*/);
  return { place: place.replace(/,\s*London$/, ""), job: job ?? null };
}

function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
      <rect x="1.25" y="1.25" width="19.5" height="19.5" rx="2" fill="none" stroke="#e4b56a" strokeWidth="1.25" />
      <path d="M5.5 7.25h11M5.5 11h11M5.5 14.75h6.5" stroke="#f3eee6" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function JobBook({
  businessName,
  reviews,
  rating,
  reviewCount,
}: {
  businessName: string;
  reviews: Review[];
  rating: string | null;
  reviewCount: string | null;
}) {
  const rows = reviews.slice(0, 4).map((r) => ({ ...splitArea(r.area), name: r.name }));
  if (rows.length === 0) return null;

  return (
    <div className="ledger-rise relative min-w-0 self-start pt-2" style={{ animationDelay: "0.22s" }}>
      <div aria-hidden="true" className="absolute inset-x-5 bottom-3 top-0 rounded-sm bg-[#e4ddd0]" />
      <article
        aria-label={`${businessName} recent jobs`}
        className="relative z-10 rounded-sm bg-[#f7f3ec] px-4 py-4 text-[#1b1714] ring-1 ring-[#e6dfd2] sm:px-6 sm:py-5"
        style={{ boxShadow: "inset 0 4px 0 #e4b56a, 0 24px 50px -28px rgba(0,0,0,0.8)" }}
      >
        <div className="flex items-baseline justify-between gap-3 border-b border-[#e7e0d4] pb-3">
          <div className="min-w-0">
            <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[#655d54]">Job book</p>
            <p className="m-0 mt-1 truncate text-[17px] leading-none" style={{ fontFamily: SERIF }}>
              Recent jobs
            </p>
          </div>
          <p className="m-0 shrink-0 text-[11px] uppercase tracking-[0.16em] text-[#655d54]">South-west London</p>
        </div>

        <ul className="m-0 mt-1 list-none divide-y divide-[#e7e0d4] p-0">
          {rows.map((row, i) => (
            <li key={`${row.place}-${i}`} className="flex items-center gap-2 py-3 sm:gap-3">
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[13px] font-medium sm:text-sm">{row.job ?? "Electrical work"}</p>
                <p className="m-0 truncate text-[11px] text-[#655d54]">{row.place}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[#e5f4ec] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[#176b45]">
                Done
              </span>
              <span
                className="w-[4.8rem] shrink-0 text-right text-[13px] tracking-[0.1em] text-[#7a5520]"
                aria-label="5 out of 5 stars"
              >
                ★★★★★
              </span>
            </li>
          ))}
        </ul>

        {rating && reviewCount && (
          <div className="mt-1 flex items-end justify-between gap-3 border-t border-[#e7e0d4] pt-3">
            <div className="min-w-0">
              <p className="m-0 text-[11px] uppercase tracking-[0.18em] text-[#655d54]">MyBuilder rating</p>
              <p className="m-0 mt-1 text-[1.65rem] leading-none tracking-tight sm:text-[2.4rem]" style={{ fontFamily: SERIF }}>
                {rating}★ <span className="text-[0.55em] text-[#554e46]">from {reviewCount} reviews</span>
              </p>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

function ReviewCard({ review, verified }: { review: Review | undefined; verified: boolean }) {
  if (!review) return null;
  const { place } = splitArea(review.area);
  return (
    <div className="min-w-0 lg:-rotate-1">
      <figure
        className="ledger-rise relative m-0 rounded-sm bg-[linear-gradient(180deg,#f4e7d4,#eadcc6)] px-4 py-4 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)] ring-1 ring-[#e0d3bf] sm:px-5 sm:py-5"
        style={{ animationDelay: "0.32s" }}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="m-0 min-w-0 pt-1 text-[11px] uppercase tracking-[0.18em] text-[#5c4a3e]">From a customer</p>
          {verified && (
            <span
              className="ledger-stamp inline-flex size-16 shrink-0 select-none items-center justify-center rounded-full border-2 border-[#1f6b4a] text-[#1f6b4a]"
              style={{ transform: "rotate(-8deg)", animationDelay: "1.18s" }}
            >
              <span className="text-center text-[8px] font-semibold uppercase leading-tight tracking-[0.12em]">
                MyBuilder
                <br />
                verified
              </span>
            </span>
          )}
        </div>
        <blockquote
          className="m-0 mt-3 text-[1.15rem] italic leading-snug text-[#3a3128] sm:text-[1.28rem]"
          style={{ fontFamily: SERIF }}
        >
          “{review.quote}”
        </blockquote>
        <figcaption className="m-0 mt-3 text-[11px] uppercase tracking-[0.14em] text-[#5c4a3e]" style={{ fontFamily: MONO }}>
          {review.name}, {place}
        </figcaption>
      </figure>
    </div>
  );
}

function CallSteps({ phone, claims }: { phone: string | null; claims: string[] }) {
  const quote = claims.find((c) => /quote/i.test(c));
  const sameDay = claims.find((c) => /same[- ]day/i.test(c));
  const steps = [
    { k: "01", title: "Call or WhatsApp", detail: phone ?? "Send us a message" },
    quote ? { k: "02", title: "Get a quote", detail: quote } : null,
    sameDay ? { k: "03", title: "Job booked", detail: sameDay } : null,
  ].filter((s): s is { k: string; title: string; detail: string } => s !== null);

  return (
    <div
      className="ledger-rise flex h-full min-h-0 flex-1 flex-col rounded-sm border border-[#2a261f] bg-[#12110f] p-4 sm:p-5"
      style={{ animationDelay: "0.42s" }}
    >
      <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[#a39888]">What happens when you call</p>
      <div className="relative mt-4">
        <span className="absolute bottom-3 left-[11px] top-3 w-px bg-[#34302a]" aria-hidden="true" />
        <ol className="relative m-0 list-none space-y-4 p-0">
          {steps.map((step, index) => {
            const last = index === steps.length - 1;
            return (
              <li key={step.k} className="flex items-start gap-3">
                <span
                  className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                    last ? "border-[#e4b56a] bg-[#e4b56a] text-[#1b1714]" : "border-[#e4b56a]/60 bg-[#12110f] text-[#e4b56a]"
                  }`}
                  style={{ fontFamily: MONO }}
                  aria-hidden="true"
                >
                  {step.k}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="m-0 text-sm text-[#f3eee6]">{step.title}</p>
                  <p className={`m-0 text-[13px] leading-snug ${last ? "text-[#e4b56a]" : "text-[#b7aea2]"}`}>{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col-reverse">
      <dt className="m-0 mt-2 text-[11px] uppercase leading-snug tracking-[0.14em] text-[#a39888]">{label}</dt>
      <dd
        className={`m-0 min-w-0 truncate font-normal leading-none ${accent ? "text-[#e4b56a]" : "text-[#f3eee6]"}`}
        style={{ fontFamily: SERIF, fontSize: "clamp(1.6rem, 3vw, 2.75rem)" }}
      >
        {value}
      </dd>
    </div>
  );
}

export function Hero({
  businessName,
  tagline,
  phone,
  telLink,
  whatsapp,
  claims,
  accreditations,
  reviews,
  rating,
  reviewCount,
  verified,
  mybuilderName,
  mybuilderUrl,
}: Props) {
  const featured = reviews.find((r) => /same day/i.test(r.quote)) ?? reviews[0];
  const niceic = accreditations.find((a) => /niceic/i.test(a));

  return (
    <section
      aria-labelledby="hero-headline"
      className="relative isolate w-full overflow-hidden bg-[#0c0b09] pt-nav text-left text-[#f3eee6]"
    >
      {/* Ledger paper: margin rule, ruled lines, warm glows, vignette, grain. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, transparent 15px, rgba(176,78,68,0.4) 15px, rgba(176,78,68,0.4) 16px, transparent 16px), repeating-linear-gradient(to bottom, transparent 0px, transparent 27px, rgba(243,238,230,0.045) 28px)",
            maskImage: "linear-gradient(90deg, #000 0%, #000 38%, transparent 72%)",
            WebkitMaskImage: "linear-gradient(90deg, #000 0%, #000 38%, transparent 72%)",
          }}
        />
        <div className="absolute -right-24 top-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(228,181,106,0.14),transparent_62%)]" />
        <div className="absolute -bottom-32 -left-16 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(80,110,90,0.12),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(0,0,0,0.32)_100%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.16]">
          <filter id="aurora-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#aurora-grain)" />
        </svg>
      </div>
      <div className="absolute inset-x-0 top-nav z-20 h-px bg-[#e4b56a]" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:py-12">
        <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
          <div className="grid items-end gap-6 md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] md:gap-x-12 lg:gap-x-16">
            <div className="min-w-0">
              <p
                className="ledger-rise m-0 flex items-start gap-3 text-[11px] uppercase tracking-[0.22em] text-[#e4b56a]"
                style={{ animationDelay: "0.06s" }}
              >
                <span className="mt-[0.45em] h-px w-6 shrink-0 bg-[#e4b56a]" aria-hidden="true" />
                <span className="flex min-w-0 items-center gap-2">
                  <Mark />
                  Electrician · South-west London{niceic ? " · NICEIC registered" : ""}
                </span>
              </p>
              <h1
                id="hero-headline"
                className="ledger-rise m-0 mt-4 max-w-[11em] text-balance text-[clamp(2.6rem,5.4vw,5.6rem)] leading-[0.95] text-[#f3eee6]"
                style={{ fontFamily: SERIF, animationDelay: "0.12s" }}
              >
                {tagline ?? businessName}
              </h1>
              <div className="ledger-draw mt-6 h-px w-16 bg-[#e4b56a]" style={{ animationDelay: "0.3s" }} aria-hidden="true" />
            </div>

            <div className="min-w-0 lg:pb-1">
              <p
                className="ledger-rise m-0 max-w-md text-pretty text-[15px] leading-relaxed text-[#d4ccc0] sm:text-base lg:text-[17px]"
                style={{ animationDelay: "0.18s" }}
              >
                Rewiring, fuse boards, fault-finding, lighting and EICRs for homes, landlords and businesses.
              </p>
              <div
                className="ledger-rise mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
                style={{ animationDelay: "0.26s" }}
              >
                {telLink && phone && (
                  <a
                    href={`tel:${telLink}`}
                    className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-[#f3eee6] bg-[#f3eee6] px-5 text-[15px] font-medium text-[#1b1714] transition-colors duration-200 hover-fine:border-[#e4b56a] hover-fine:bg-[#e4b56a] motion-reduce:transition-none ${FOCUS}`}
                  >
                    <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
                    Call {phone}
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="transition-transform duration-200 hover-fine:group-hover:-translate-y-0.5 hover-fine:group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </a>
                )}
                <WhatsAppButton whatsapp={whatsapp} className="min-h-12 text-[15px]" />
              </div>
              {rating && reviewCount && (
                <p className="m-0 mt-4 flex items-center gap-2 text-[14px] text-[#f3eee6]">
                  <span className="tracking-[0.1em] text-[#e4b56a]" aria-hidden="true">★★★★★</span>
                  {rating} from {reviewCount} {verified ? "verified " : ""}reviews on MyBuilder
                </p>
              )}
              {claims.length > 0 && (
                <p className="m-0 mt-1 text-[13px] leading-snug text-[#b7aea2]">{claims.join(" · ")}</p>
              )}
            </div>
          </div>

          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-[minmax(0,1.32fr)_minmax(0,0.68fr)] lg:gap-5">
            <JobBook businessName={businessName} reviews={reviews} rating={rating} reviewCount={reviewCount} />
            <div className="flex h-full min-w-0 flex-col gap-4">
              <ReviewCard review={featured} verified={verified} />
              <CallSteps phone={phone} claims={claims} />
            </div>
          </div>
        </div>

        <dl
          className="ledger-rise m-0 mt-10 grid grid-cols-3 divide-x divide-[#2a261f] border-t border-[#2a261f]"
          style={{ animationDelay: "0.48s" }}
        >
          {rating && (
            <div className="min-w-0 py-4 pr-3 sm:py-5 sm:pr-6">
              <Stat value={`${rating}★`} label="MyBuilder rating" accent />
            </div>
          )}
          {reviewCount && (
            <div className="min-w-0 px-3 py-4 sm:px-6 sm:py-5">
              <Stat value={reviewCount} label={verified ? "Verified reviews" : "Reviews"} />
            </div>
          )}
          {niceic && (
            <div className="min-w-0 py-4 pl-3 sm:py-5 sm:pl-6">
              <Stat value="NICEIC" label="Registered" />
            </div>
          )}
        </dl>
        {mybuilderName && mybuilderUrl && (
          <p className="m-0 mt-2 text-[12px] text-[#a39888]">
            Our reviews are on MyBuilder, where we trade as{" "}
            <a
              href={mybuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-sm text-[#d4ccc0] underline decoration-[#6f675e] underline-offset-4 hover-fine:decoration-[#e4b56a] ${FOCUS}`}
            >
              {mybuilderName}
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
