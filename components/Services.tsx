import {
  Cable,
  CircuitBoard,
  House,
  Lightbulb,
  Plug,
  SearchCheck,
  Zap,
} from "lucide-react";

type Props = { services: string[]; certificates: string[] };

/**
 * Services are authored in site.md, so icons are matched on wording rather than
 * position — reordering or rewording the list keeps the right icon, and an
 * unrecognised service falls back to the generic mark instead of borrowing a
 * meaning it doesn't have.
 */
function serviceIcon(service: string) {
  const s = service.toLowerCase();
  if (/rewir/.test(s)) return Cable;
  if (/fuse board|consumer unit/.test(s)) return CircuitBoard;
  if (/installation/.test(s)) return House;
  if (/fault|repair/.test(s)) return SearchCheck;
  if (/light/.test(s)) return Lightbulb;
  if (/socket|switch/.test(s)) return Plug;
  return Zap;
}

/** Services come only from the CONFIRMED list in site.md. */
export function Services({ services, certificates }: Props) {
  if (services.length === 0) return null;

  return (
    // The seam out of the dark hero/TrustBar block: a thin neutral rule marks
    // the boundary on purpose (blue is reserved for actions), and the section
    // lands on slate-50 before settling to white instead of snapping straight
    // from slate-900.
    <section
      id="services"
      className="border-t-2 border-slate-800 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          What we do
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          The same standard of work whether it&apos;s a single socket or a full
          commercial installation.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = serviceIcon(service);
            return (
              <li
                key={service}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <Icon aria-hidden="true" className="h-6 w-6 text-slate-500" />
                <h3 className="mt-3 text-base font-semibold text-slate-900">
                  {service}
                </h3>
              </li>
            );
          })}
        </ul>

        {certificates.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {certificates.map((c) => (
              <li
                key={c}
                className="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
              >
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
