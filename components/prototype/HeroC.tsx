import { HeroBackground } from "@/components/HeroBackground";
import { Actions, Headline, Proof, RISE, type HeroProps } from "@/components/prototype/HeroA";

/**
 * Variant C. Footage full-bleed, headline and actions bottom-left, proof in
 * a two-layer card bottom-right: an outer shell and an inset core, both
 * solid. No blur, no shadow.
 */
export function HeroC(props: HeroProps) {
  const hasProof = Boolean((props.rating && props.reviewCount) || props.accreditation || props.sameDay);
  return (
    <section className="relative isolate overflow-hidden bg-slate-950">
      <HeroBackground />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950"
      />
      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-end gap-10 px-5 pb-12 pt-32 sm:pb-16 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Headline text={props.headline} className={`${RISE} text-[2.5rem] sm:text-6xl`} />
          <Actions
            phone={props.phone}
            telLink={props.telLink}
            className={`${RISE} mt-8 [animation-delay:120ms]`}
          />
        </div>
        {hasProof && (
          <div
            className={`${RISE} w-full shrink-0 rounded-[20px] border border-slate-700 bg-slate-950 p-1.5 [animation-delay:240ms] sm:max-w-sm`}
          >
            <div className="rounded-[14px] bg-slate-900 p-5">
              <Proof {...props} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
