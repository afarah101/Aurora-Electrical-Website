"use client";

import { useEffect, useRef } from "react";
import PullCord from "@/components/kokonutui/pull-cord";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-action-soft";

/*
 * The hero's lamp and its link. The first pull lights the lamp and it stays
 * lit; every pull, tap or key press then scrolls to the reviews. This is the
 * only client code in the hero, so Hero itself stays a server component.
 */
export function HeroPullCord() {
  // A pull lights the lamp; 400ms later the page moves to the reviews.
  const scrollTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(scrollTimer.current), []);
  const showReviews = () => {
    window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById("reviews")
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 400);
  };

  return (
    <div className="mt-6 flex items-center gap-3">
      {/*
        The drawing has about 46px of empty space each side of the lamp at
        this height. The negative margins pull the label in so it fits on one
        line at 320px, while the lamp stays inside the page gutter.
      */}
      <PullCord
        className="-ml-8 -mr-10 h-[140px] shrink-0"
        label="Lamp switch: turn it on to see reviews"
        latch
        onPull={showReviews}
      />
      <a
        href="#reviews"
        className={`whitespace-nowrap rounded-sm text-[14px] text-ink underline decoration-ink-faint underline-offset-4 hover-fine:decoration-ink ${FOCUS}`}
      >
        Pull the cord to see reviews
      </a>
    </div>
  );
}
