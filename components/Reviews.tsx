import { Quote } from "lucide-react";
import type { Review } from "@/app/content";

type Props = { reviews: Review[]; aggregateRating: string | null };

/**
 * Renders only reviews confirmed in site.md. When none are confirmed the
 * section is omitted entirely rather than filled with sample testimonials —
 * invented reviews for a real trades business are a misrepresentation, not
 * a placeholder.
 */
export function Reviews({ reviews, aggregateRating }: Props) {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          What customers say
        </h2>
        {aggregateRating && (
          <p className="mt-3 text-sm font-medium text-slate-700">{aggregateRating}</p>
        )}

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li
              key={`${review.name}-${review.area}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-6"
            >
              <Quote aria-hidden="true" className="h-6 w-6 text-blue-800" />
              <blockquote className="mt-3 text-slate-700">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <footer className="mt-4 text-sm font-semibold text-slate-900">
                {review.name}
                <span className="font-normal text-slate-500"> — {review.area}</span>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
