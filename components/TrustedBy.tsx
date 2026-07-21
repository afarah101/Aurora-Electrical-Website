import { Building2 } from "lucide-react";
import type { Client } from "@/app/content";

type Props = { clients: Client[] };

/**
 * Past-client logo strip. Named slots render as styled placeholders until real
 * logo files land in /public/clients/ — a missing file must never become a
 * broken <img>. Note: displaying a client's name or mark is an endorsement
 * claim; site.md records that permission is required first.
 */
export function TrustedBy({ clients }: Props) {
  if (clients.length === 0) return null;

  return (
    <section id="clients" className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          Trusted by
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Commercial and community premises we&apos;ve carried out work for.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clients.map((client) => (
            <li
              key={client.name}
              className="flex flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white p-6"
            >
              {/* Logo files are supplied later; until then show a named slot. */}
              <div className="flex h-12 items-center justify-center">
                <Building2 aria-hidden="true" className="h-8 w-8 text-slate-400" />
              </div>
              <span className="text-center text-sm font-semibold text-slate-900">
                {client.name}
              </span>
              {client.descriptor && (
                <span className="text-center text-xs uppercase tracking-wide text-slate-500">
                  {client.descriptor}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
