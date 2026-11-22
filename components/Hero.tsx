"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowRight, Phone } from "lucide-react";
import PullCord from "@/components/kokonutui/pull-cord";
import { MagnetButton } from "@/components/ui/magnet-button";
import { CTA_ARROW, CTA_CALL, CTA_ICON, WhatsAppButton } from "@/components/WhatsAppButton";

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
 * Light editorial split: headline, call to action and one proof line at
 * left, two framed job photos from /public/work at right. Every fact is
 * read from content/site.md; a missing value renders nothing.
 */

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-action-soft";
const FRAME = "overflow-hidden border-[6px] border-white bg-white shadow-2xl shadow-ink/20";

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

  // A pull lights the lamp; 400ms later the page moves to the reviews.
  const scrollTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(scrollTimer.current), []);
  const showReviews = () => {
    window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById("reviews")
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 400);
  };

  return (
    <section aria-labelledby="hero-headline" className="w-full bg-surface pt-nav text-left text-ink">
      <div className="mx-auto grid min-h-[calc(78svh-var(--spacing-nav))] w-full max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-16">
        <div className="min-w-0">
          <p
            className="ledger-rise m-0 text-[12px] font-medium uppercase tracking-[0.18em] text-ink-muted"
            style={{ animationDelay: "0.06s" }}
          >
            Electrician · London{niceic ? " · NICEIC registered" : ""}
          </p>
          <h1
            id="hero-headline"
            className="m-0 mt-4 max-w-[12em] text-balance text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] text-ink"
          >
            {tagline ?? businessName}
          </h1>
          <p
            className="ledger-rise m-0 mt-6 max-w-md text-pretty text-base leading-relaxed text-ink-body lg:text-[17px]"
            style={{ animationDelay: "0.18s" }}
          >
            Rewiring, fuse boards, fault-finding, lighting and EICRs for homes, landlords and businesses.
          </p>
          <div
            className="ledger-rise mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.26s" }}
          >
            {telLink && phone && (
              <MagnetButton
                href={`tel:${telLink}`}
                className={CTA_CALL}
              >
                <Phone strokeWidth={1.75} aria-hidden="true" className={CTA_ICON} />
                Call {phone}
                <ArrowRight strokeWidth={1.75} aria-hidden="true" className={CTA_ARROW} />
              </MagnetButton>
            )}
            <WhatsAppButton whatsapp={whatsapp} />
          </div>
          {/* Rating line, then the pull cord: under it on phones, beside it on desktop. */}
          <div className="lg:flex lg:items-center lg:gap-8">
          {rating && reviewCount && (
            <p className="m-0 mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-ink">
              <span className="tracking-[0.1em] text-trust" aria-hidden="true">★★★★★</span>
              <span>
                {rating} from {reviewCount} {verified ? "verified " : ""}reviews
                {mybuilderName && mybuilderUrl ? (
                  <>
                    {" "}on{" "}
                    <a
                      href={mybuilderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`rounded-sm underline decoration-ink-faint underline-offset-4 hover-fine:decoration-ink ${FOCUS}`}
                    >
                      MyBuilder
                    </a>{" "}
                    <span className="text-ink-muted">(as {mybuilderName})</span>
                  </>
                ) : (
                  " on MyBuilder"
                )}
              </span>
            </p>
          )}
          <div className="mt-6 flex items-center gap-4">
            <PullCord
              className="h-[140px] shrink-0"
              label="Lamp switch: turn it on to see reviews"
              onPull={showReviews}
            />
            <a
              href="#reviews"
              className={`rounded-sm text-[14px] text-ink underline decoration-ink-faint underline-offset-4 hover-fine:decoration-ink ${FOCUS}`}
            >
              Pull the cord to see reviews
            </a>
          </div>
          </div>
        </div>

        {/* Two framed photos; the second is smaller and sits lower-right. */}
        <div className="relative mx-auto w-full max-w-md pb-16 lg:max-w-none lg:pb-20">
          <div className={`relative aspect-[4/5] w-[78%] ${FRAME}`}>
            <Image
              src="/work/work-06.jpg"
              alt="Retail fit-out with LED strip lighting under a display plinth and track spotlights across the ceiling"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 400px, (min-width: 448px) 350px, 78vw"
              className="object-cover"
            />
          </div>
          <div className={`absolute bottom-0 right-0 aspect-[4/5] w-[50%] ${FRAME}`}>
            <Image
              src="/work/work-01.jpg"
              alt="Commercial distribution boards with neatly dressed cables running up a wire tray"
              fill
              sizes="(min-width: 1024px) 260px, (min-width: 448px) 224px, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
