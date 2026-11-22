import { Star } from "lucide-react";

type Props = { rating: number; outOf?: number; className?: string };

/**
 * Stars drawn from the number, never a fixed row of five: 4.9 is four full
 * stars and a fifth filled to 90%. Each star is an outline with a clipped,
 * filled copy on top. The group is one image to assistive tech.
 */
export function RatingStars({ rating, outOf = 5, className = "size-4" }: Props) {
  const value = Math.max(0, Math.min(rating, outOf));
  return (
    <span role="img" aria-label={`${rating} out of ${outOf} stars`} className="flex shrink-0 items-center gap-0.5">
      {Array.from({ length: outOf }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} aria-hidden="true" className="relative inline-flex">
            <Star strokeWidth={1.5} className={`${className} text-trust-bright`} />
            {fill > 0 && (
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star strokeWidth={1.5} className={`${className} max-w-none fill-trust-bright text-trust-bright`} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
