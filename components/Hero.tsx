import { ArrowRight, Clock, ShieldCheck, Star } from "lucide-react";
import { HeroBackground } from "@/components/HeroBackground";

type Props = {
  businessName: string;
  tagline: string | null;
  phone: string | null;
  telLink: string | null;
  /** From the Claims section of site.md; the proof row shows a same-day one. */
  claims: string[];
  accreditations: string[];
  /** From the "## MyBuilder" section of site.md (lib/mybuilder.ts). */
  rating: string | null;
  ratingOutOf: string | null;
  reviewCount: string | null;
};

/*
 * Motion vocabulary. Press is deliberate (160ms), release snaps (100ms),
 * hover colour eases over 160ms. Hover only on a real mouse (hover-fine).
 */
const PRESS =
  "[transition:transform_100ms_var(--ease-out),background-color_160ms_var(--ease-out)] active:scale-[0.97] active:[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)] motion-reduce:active:scale-100";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft";
const ICON = { strokeWidth: 1.5, "aria-hidden": true } as const;

/**
 * Editorial split: copy on a solid surface at left, the footage framed at
 * right. Text never sits on video, so contrast is fixed. Every fact is a
 * prop read from site.md; a missing value renders nothing.
 */
export function Hero({
  businessName,
  tagline,
  phone,
  telLink,
  claims,
  accreditations,
  rating,
  ratingOutOf,
  reviewCount,
}: Props) {
  const outOf = Number(ratingOutOf) || 5;
  const sameDay = claims.find((c) => /same[- ]day/i.test(c));

  return (
    <section className="bg-surface pt-nav">
      <div className="mx-auto grid min-h-[calc(100svh-var(--spacing-nav))] max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-16">
        <div>
          <h1 className="animate-hero-rise font-heading text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance text-ink [font-stretch:108%] sm:text-6xl lg:text-5xl xl:text-6xl">
            {tagline ?? businessName}
          </h1>

          <div className="animate-hero-rise mt-8 flex flex-col gap-3 [animation-delay:60ms] sm:flex-row">
            {telLink && phone && (
              <a
                href={`tel:${telLink}`}
                className={`group inline-flex h-12 items-center justify-between gap-4 rounded-full bg-action pl-6 pr-2 text-base font-semibold text-ink hover-fine:bg-action-hover sm:justify-start ${PRESS} ${FOCUS}`}
              >
                Call {phone}
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center rounded-full bg-ink/15"
                >
                  <ArrowRight
                    {...ICON}
                    className="size-4 transition-transform duration-[160ms] ease-out [@media(pointer:fine)]:group-hover:[transform:translateX(2px)] motion-reduce:transition-none"
                  />
                </span>
              </a>
            )}
            <a
              href="#contact"
              className={`inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-base font-semibold text-surface hover-fine:bg-ink-soft ${PRESS} ${FOCUS}`}
            >
              Get a free quote
            </a>
          </div>

          <ul className="animate-hero-rise mt-10 flex flex-col gap-3 text-sm font-medium text-ink-soft [animation-delay:120ms]">
            {rating && reviewCount && (
              <li className="flex items-center gap-3">
                <span
                  role="img"
                  aria-label={`${rating} out of ${outOf} stars`}
                  className="flex shrink-0 items-center gap-0.5"
                >
                  {Array.from({ length: outOf }).map((_, i) => (
                    <Star key={i} {...ICON} className="size-4 fill-trust-bright text-trust-bright" />
                  ))}
                </span>
                <span>
                  MyBuilder {rating} from {reviewCount} reviews
                </span>
              </li>
            )}
            {accreditations.map((a) => (
              <li key={a} className="flex items-center gap-3">
                <ShieldCheck {...ICON} className="size-5 shrink-0 text-trust-bright" />
                <span>{a}</span>
              </li>
            ))}
            {sameDay && (
              <li className="flex items-center gap-3">
                <Clock {...ICON} className="size-5 shrink-0 text-ink-muted" />
                <span>{sameDay}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="animate-hero-rise relative aspect-[4/3] overflow-hidden rounded-[16px] bg-surface-raised ring-1 ring-hairline [animation-delay:180ms] lg:aspect-[4/5]">
          <HeroBackground />
        </div>
      </div>
    </section>
  );
}
