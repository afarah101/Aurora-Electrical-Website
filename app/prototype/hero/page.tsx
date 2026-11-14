import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { Archivo } from "next/font/google";
import { accreditations, claims, contact } from "@/app/content";
import { HeroA, type HeroProps } from "@/components/prototype/HeroA";
import { HeroB } from "@/components/prototype/HeroB";
import { HeroC } from "@/components/prototype/HeroC";

/**
 * Prototype-only heading face. Loaded here, not in layout.tsx, so the live
 * site never downloads it. The wdth axis needs the variable weight range,
 * which covers the 700 and 800 weights the headings use.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "Hero prototypes",
  robots: { index: false, follow: false },
};

/**
 * Same reader as components/MyBuilderBadge.tsx. That file does not export
 * it and is out of scope, so the logic is mirrored line for line.
 */
function mybuilderField(key: string): string | null {
  try {
    const lines = readFileSync(
      join(process.cwd(), "content", "site.md"),
      "utf8",
    ).split("\n");
    const start = lines.findIndex(
      (l) => l.trim().toLowerCase() === "## mybuilder",
    );
    if (start === -1) return null;
    for (const line of lines.slice(start + 1)) {
      if (line.startsWith("## ")) break;
      const t = line.trim();
      if (t.toLowerCase().startsWith(`- ${key.toLowerCase()}:`)) {
        const value = t.slice(t.indexOf(":") + 1).trim();
        return value && !/\[(PLACEHOLDER|TBC)/i.test(value) ? value : null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/** Draft h1. Mohamed must approve before any of this ships. */
const HEADLINE = "Safe, certified electrics for London homes.";

const VARIANTS = {
  A: { label: "Lower third", Hero: HeroA },
  B: { label: "Editorial split", Hero: HeroB },
  C: { label: "Proof card", Hero: HeroC },
} as const;

type Key = keyof typeof VARIANTS;

export default async function HeroPrototypePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = (await searchParams).v;
  const v = (typeof raw === "string" ? raw.toUpperCase() : "A") as Key;
  const active: Key = v in VARIANTS ? v : "A";
  const { Hero } = VARIANTS[active];

  const props: HeroProps = {
    headline: HEADLINE,
    phone: contact.phone,
    telLink: contact.telLink,
    sameDay: claims.find((c) => /same[- ]day/i.test(c)) ?? null,
    accreditation: accreditations[0] ?? null,
    rating: mybuilderField("Rating"),
    ratingOutOf: mybuilderField("Rating out of"),
    reviewCount: mybuilderField("Reviews"),
  };

  return (
    <main className={`${archivo.variable} bg-slate-950`}>
      <nav
        aria-label="Hero variant"
        className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950 px-5 py-3"
      >
        <span className="mr-2 text-sm text-slate-300">Variant</span>
        {(Object.keys(VARIANTS) as Key[]).map((k) => {
          const on = k === active;
          return (
            <Link
              key={k}
              href={`/prototype/hero?v=${k}`}
              aria-current={on ? "page" : undefined}
              className={`inline-flex h-11 items-center gap-2 rounded-[12px] border px-4 text-sm font-semibold transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft motion-reduce:transition-none motion-reduce:active:scale-100 ${
                on
                  ? "border-white bg-white text-slate-950"
                  : "border-slate-700 text-slate-100 hover:border-slate-500"
              }`}
            >
              {k}
              <span className={on ? "text-slate-700" : "text-slate-300"}>
                {VARIANTS[k].label}
              </span>
            </Link>
          );
        })}
      </nav>
      <Hero {...props} />
    </main>
  );
}
