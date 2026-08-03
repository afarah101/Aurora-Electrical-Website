import Image from "next/image";
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
              {/*
                content.ts only supplies `logo` when the file exists under
                public/, so the icon below is a true fallback rather than a
                guess. Logos vary wildly in aspect ratio — a 6.7:1 wordmark
                next to a 1:1 badge — so both are contained in a fixed-height
                box on white, which the supplied dark/gold marks need.
              */}
              <div className="flex h-14 w-full items-center justify-center">
                {client.logo ? (
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={200}
                    height={56}
                    unoptimized
                    className="max-h-14 w-auto max-w-[150px] object-contain"
                  />
                ) : (
                  <Building2 aria-hidden="true" className="h-8 w-8 text-slate-400" />
                )}
              </div>
              <span className="text-center text-sm font-semibold text-slate-900">
                {client.name}
              </span>
              {/* Category label in the mono face; trust gold marks this
                  section as proof territory. amber-700 holds 4.5:1 on white. */}
              {client.descriptor && (
                <span className="text-center font-mono text-xs uppercase tracking-wide text-trust">
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
