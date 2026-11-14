import { ArrowRight, Clock, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { HeroBackground } from "@/components/HeroBackground";

/**
 * Every business fact arrives as a prop. page.tsx reads them from
 * app/content.ts and the "## MyBuilder" section of site.md, so a value
 * removed there disappears here. A missing value renders nothing.
 */
export type HeroProps = {
  headline: string;
  phone: string | null;
  telLink: string | null;
  sameDay: string | null;
  accreditation: string | null;
  rating: string | null;
  ratingOutOf: string | null;
  reviewCount: string | null;
};

/** One curve for all motion in the prototypes. */
const EASE = "ease-[cubic-bezier(0.23,1,0.32,1)]";
const PRESS = `transition-transform duration-[160ms] ${EASE} active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100`;
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft";

export const RISE = "animate-hero-rise motion-reduce:animate-none";

export function Headline({ text, className = "" }: { text: string; className?: string }) {
  return (
    <h1
      className={`font-(family-name:--font-archivo) font-extrabold leading-[1.05] tracking-[-0.03em] text-balance text-white [font-stretch:108%] ${className}`}
    >
      {text}
    </h1>
  );
}

export function Actions({
  phone,
  telLink,
  className = "",
}: Pick<HeroProps, "phone" | "telLink"> & { className?: string }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      {telLink && phone && (
        <a
          href={`tel:${telLink}`}
          className={`group inline-flex h-12 items-center justify-between gap-4 rounded-[20px] bg-action pl-6 pr-2 text-base font-semibold text-white hover:bg-action-hover sm:justify-start ${PRESS} ${FOCUS}`}
        >
          Call {phone}
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-[16px] bg-white/15"
          >
            <ArrowRight
              className={`size-4 transition-transform duration-[160ms] ${EASE} group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0`}
            />
          </span>
        </a>
      )}
      <Link
        href="/#contact"
        className={`inline-flex h-12 items-center justify-center rounded-[20px] bg-white px-6 text-base font-semibold text-slate-950 hover:bg-slate-100 ${PRESS} ${FOCUS}`}
      >
        Get a free quote
      </Link>
    </div>
  );
}

/**
 * Proof row. Gold marks trust only: the stars and the accreditation shield.
 * The availability claim is an operational promise, so it stays neutral.
 */
export function Proof({
  rating,
  ratingOutOf,
  reviewCount,
  accreditation,
  sameDay,
  className = "",
}: Pick<HeroProps, "rating" | "ratingOutOf" | "reviewCount" | "accreditation" | "sameDay"> & {
  className?: string;
}) {
  const outOf = Number(ratingOutOf) || 5;
  return (
    <ul className={`flex flex-col gap-3 text-sm font-medium text-slate-100 ${className}`}>
      {rating && reviewCount && (
        <li className="flex items-center gap-3">
          <span
            role="img"
            aria-label={`${rating} out of ${outOf} stars`}
            className="flex shrink-0 items-center gap-0.5"
          >
            {Array.from({ length: outOf }).map((_, i) => (
              <Star key={i} aria-hidden="true" className="size-4 fill-trust-bright text-trust-bright" />
            ))}
          </span>
          <span>
            MyBuilder {rating} from {reviewCount} reviews
          </span>
        </li>
      )}
      {accreditation && (
        <li className="flex items-center gap-3">
          <ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-trust-bright" />
          <span>{accreditation}</span>
        </li>
      )}
      {sameDay && (
        <li className="flex items-center gap-3">
          <Clock aria-hidden="true" className="size-5 shrink-0 text-slate-300" />
          <span>{sameDay}</span>
        </li>
      )}
    </ul>
  );
}

/**
 * Variant A. Footage full-bleed, all copy held in the lower third. The
 * overlay runs to solid slate-950 at the bottom, so text contrast holds
 * even on the clip's white work-light frames.
 */
export function HeroA(props: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950">
      <HeroBackground />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950"
      />
      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-5 pb-12 pt-32 sm:pb-16">
        <Headline
          text={props.headline}
          className={`${RISE} max-w-3xl text-[2.5rem] sm:text-6xl`}
        />
        <Actions
          phone={props.phone}
          telLink={props.telLink}
          className={`${RISE} mt-8 [animation-delay:120ms]`}
        />
        <Proof
          {...props}
          className={`${RISE} mt-10 border-t border-slate-700 pt-6 [animation-delay:240ms] lg:flex-row lg:gap-8`}
        />
      </div>
    </section>
  );
}
