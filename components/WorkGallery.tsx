"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ImageIcon } from "lucide-react";

type Props = {
  /** Real photo paths under /public/work/. Empty until the client supplies them. */
  photos?: string[];
};

const AUTOPLAY_MS = 3000;
/** Shown when public/work/ is empty — styled tiles, never a broken <img>. */
const PLACEHOLDER_SLIDES = 4;

export function WorkGallery({ photos = [] }: Props) {
  const hasPhotos = photos.length > 0;
  const slideCount = hasPhotos ? photos.length : PLACEHOLDER_SLIDES;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const paused = useRef(false);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay without the embla autoplay plugin (not a project dependency).
  // Respects reduced-motion and pauses on hover/focus.
  useEffect(() => {
    if (!emblaApi) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      if (!paused.current) emblaApi.scrollNext();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [emblaApi]);

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  return (
    <section id="work" className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          Recent work
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          A selection of completed jobs across domestic and commercial premises.
        </p>

        <div
          className="mt-10 overflow-hidden"
          ref={emblaRef}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocusCapture={pause}
          onBlurCapture={resume}
        >
          <div className="flex gap-4">
            {hasPhotos
              ? photos.map((src) => (
                  <div
                    key={src}
                    className="relative min-w-0 shrink-0 grow-0 basis-full overflow-hidden rounded-lg sm:basis-1/2 lg:basis-1/3"
                  >
                    <Image
                      src={src}
                      alt="Completed electrical work"
                      width={640}
                      height={480}
                      className="h-60 w-full object-cover"
                    />
                  </div>
                ))
              : Array.from({ length: PLACEHOLDER_SLIDES }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <div className="flex h-60 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white">
                      <ImageIcon aria-hidden="true" className="h-8 w-8 text-slate-400" />
                      <span className="text-sm font-medium text-slate-500">
                        Completed work
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Slides">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === selected ? "bg-blue-800" : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
