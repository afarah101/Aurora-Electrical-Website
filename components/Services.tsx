import { Zap } from "lucide-react";

type Props = { services: string[]; certificates: string[] };

/** Services come only from the CONFIRMED list in site.md. */
export function Services({ services, certificates }: Props) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          What we do
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          The same standard of work whether it&apos;s a single socket or a full
          commercial installation.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li
              key={service}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <Zap aria-hidden="true" className="h-6 w-6 text-blue-800" />
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                {service}
              </h3>
            </li>
          ))}
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
