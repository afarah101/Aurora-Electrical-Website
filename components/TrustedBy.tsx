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
    <section id="clients" className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Trusted by
        </h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Commercial and community premises we&apos;ve carried out work for.
        </p>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <li
              key={client.name}
              className="flex flex-col items-center justify-center gap-3 rounded-xl bg-white p-8"
            >
              {/*
                content.ts only supplies `logo` when the file exists under
                public/, so the icon below is a true fallback rather than a
                guess. Both marks are dark-on-transparent (Malieu measures
                pure black), so the tiles stay white on the dark section.

                Sizing is by format, not one shared cap. The DUS mark is a
                real SVG served raw (`unoptimized` bypasses the optimizer),
                so the browser renders it as vector — height-driven at h-8 it
                draws crisp at ~213px wide. The Maliéu mark is a 1600px
                square JPG whose measured artwork band is 81% wide x 24%
                tall, dead-centred on its own white canvas: rendered at up
                to 240px wide inside this centred 80px overflow window, the
                visible wordmark lands ~194x58 — optically level with the
                DUS wordmark — and the crop edge is invisible because the
                JPG's white meets the tile's white.
              */}
              <div className="flex h-20 w-full items-center justify-center overflow-hidden">
                {client.logo ? (
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={240}
                    height={80}
                    unoptimized
                    className={
                      client.logo.endsWith(".svg")
                        ? "h-8 w-auto max-w-full object-contain"
                        : "h-auto w-full max-w-60"
                    }
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
