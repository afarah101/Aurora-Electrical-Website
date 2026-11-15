import { ArrowUpRight, Phone } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";

type Props = {
  businessName: string;
  tagline: string | null;
  phone: string | null;
  telLink: string | null;
  whatsapp: string | null;
  accreditations: string[];
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
 * Adapted from 21st.dev "Ledger Hero C" (Quillmoth Studio): serif
 * headline, warm ink floor, one call to action and one proof line.
 * Every fact is read from content/site.md; a missing value renders nothing.
 */

const SERIF = "var(--font-heading)";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-action-soft";

export function Hero({
  businessName,
  tagline,
  phone,
  telLink,
  whatsapp,
  accreditations,
  rating,
  reviewCount,
  verified,
  mybuilderName,
  mybuilderUrl,
}: Props) {
  const niceic = accreditations.find((a) => /niceic/i.test(a));

  return (
    <section
      aria-labelledby="hero-headline"
      className="relative isolate w-full overflow-hidden bg-[#0c0b09] pt-nav text-left text-[#f3eee6]"
    >
      {/* Ledger paper: margin rule, ruled lines, warm glows, vignette, grain. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
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

      <div className="relative z-10 mx-auto flex min-h-[calc(78svh-var(--spacing-nav))] w-full max-w-6xl flex-col justify-center px-5 py-12 sm:px-8 lg:py-16">
        <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
          <div className="grid items-end gap-6 md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] md:gap-x-12 lg:gap-x-16">
            <div className="min-w-0">
              <p
                className="ledger-rise m-0 flex items-start gap-3 text-[11px] uppercase tracking-[0.22em] text-[#e4b56a]"
                style={{ animationDelay: "0.06s" }}
              >
                <span className="mt-[0.45em] h-px w-6 shrink-0 bg-[#e4b56a]" aria-hidden="true" />
                <span className="min-w-0">Electrician · London{niceic ? " · NICEIC registered" : ""}</span>
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
                <p className="m-0 mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-[#f3eee6]">
                  <span className="tracking-[0.1em] text-[#e4b56a]" aria-hidden="true">★★★★★</span>
                  <span>
                    {rating} from {reviewCount} {verified ? "verified " : ""}reviews
                    {mybuilderName && mybuilderUrl ? (
                      <>
                        {" "}on{" "}
                        <a
                          href={mybuilderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`rounded-sm underline decoration-[#6f675e] underline-offset-4 hover-fine:decoration-[#e4b56a] ${FOCUS}`}
                        >
                          MyBuilder
                        </a>{" "}
                        <span className="text-[#a39888]">(as {mybuilderName})</span>
                      </>
                    ) : (
                      " on MyBuilder"
                    )}
                  </span>
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
