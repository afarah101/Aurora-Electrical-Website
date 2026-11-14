import { HeroBackground } from "@/components/HeroBackground";
import { Actions, Headline, Proof, RISE, type HeroProps } from "@/components/prototype/HeroA";

/**
 * Variant B. Editorial split: copy on a solid surface at left, the footage
 * framed at right. Text never sits on video, so contrast is fixed.
 */
export function HeroB(props: HeroProps) {
  return (
    <section className="bg-slate-950">
      <div className="mx-auto grid min-h-svh max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
        <div>
          <Headline text={props.headline} className={`${RISE} text-[2.5rem] sm:text-6xl`} />
          <Actions
            phone={props.phone}
            telLink={props.telLink}
            className={`${RISE} mt-8 [animation-delay:120ms]`}
          />
          <Proof {...props} className={`${RISE} mt-10 [animation-delay:240ms]`} />
        </div>
        <div
          className={`${RISE} relative aspect-[4/3] overflow-hidden rounded-[20px] border border-slate-800 bg-slate-900 [animation-delay:180ms] lg:aspect-[4/5]`}
        >
          <HeroBackground />
        </div>
      </div>
    </section>
  );
}
