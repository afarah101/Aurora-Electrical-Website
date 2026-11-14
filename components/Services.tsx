import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Props = { services: string[]; certificates: string[] };

/**
 * The one service shown with a photo: work-01, an open distribution board.
 * Mohamed still has to confirm it may illustrate this service. No other
 * service gets an image, because a photo captioned with the wrong service
 * would be a misrepresentation, not a design.
 */
const FEATURE = { match: /fuse board|consumer unit/i, src: "/work/work-01.jpg" };

/**
 * Bento grid. Names and order come only from the CONFIRMED list in site.md;
 * the fuse board card is the large one. Cards are single-layer and carry no
 * hover state: they are not links, so motion would invite a click that goes
 * nowhere. The EICR row is the one link and the only element that moves.
 */
export function Services({ services, certificates }: Props) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="border-t border-hairline bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">What we do</h2>
        <p className="mt-5 max-w-md text-ink-muted">
          The same standard of work whether it&apos;s a single socket or a full
          commercial installation.
        </p>

        {/* Visual order = site.md order at every width: 1 column below
            1024px; 3 at lg with the photo card spanning 2x2 in its own slot. */}
        <ul className="mt-12 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {services.map((service) => {
            const featured = FEATURE.match.test(service);
            return (
              <li
                key={service}
                className={`flex flex-col overflow-hidden rounded-[16px] bg-surface-raised ring-1 ring-hairline ${
                  featured
                    ? "lg:col-span-2 lg:row-span-2"
                    : "min-h-36 justify-end"
                }`}
              >
                {featured && (
                  <div className="relative min-h-64 flex-1">
                    <Image
                      src={FEATURE.src}
                      alt="Open distribution board with labelled circuit breakers"
                      fill
                      sizes="(min-width: 1024px) 740px, calc(100vw - 40px)"
                      className="object-cover"
                    />
                  </div>
                )}
                <h3
                  className={`p-6 font-heading font-semibold tracking-tight text-ink ${
                    featured ? "text-2xl sm:text-3xl" : "text-xl"
                  }`}
                >
                  {service}
                </h3>
              </li>
            );
          })}

          {/* Authored here, not in site.md: it needs an anchor the parser's
              plain service strings can't express. */}
          <li className="lg:col-span-3">
            <a
              href="#eicr-pricing"
              className="group flex h-full min-h-20 items-center justify-between gap-6 rounded-[16px] bg-surface-raised p-6 ring-1 ring-hairline transition-colors duration-[160ms] ease-out hover-fine:bg-surface-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft motion-reduce:transition-none"
            >
              <h3 className="font-heading text-xl font-semibold tracking-tight text-ink">
                EICRs (Electrical Installation Condition Reports)
              </h3>
              <ArrowRight
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-5 shrink-0 text-ink-muted transition-transform duration-[160ms] ease-out [@media(pointer:fine)]:group-hover:[transform:translateX(2px)] motion-reduce:transition-none"
              />
            </a>
          </li>
        </ul>

        {certificates.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {certificates.map((c) => (
              <li key={c} className="rounded-full bg-surface-high px-3 py-1.5 text-sm text-ink-body">
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
