"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { gadsEnabled, installClickTracking, loadGoogleAds } from "@/lib/gads";

type Choice = "accepted" | "rejected";

const STORAGE_KEY = "aurora-consent";
const listeners = new Set<() => void>();
// Fallback when storage is blocked, so the banner still closes for this page view.
let memoryChoice: Choice | null = null;

function readChoice(): Choice | null {
  if (memoryChoice) return memoryChoice;
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice): void {
  memoryChoice = choice;
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the choice lasts for this page view only.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Both buttons share one style: Accept and Reject carry equal weight.
const BUTTON =
  "inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-sm border border-hairline-strong bg-surface-raised px-6 text-base font-semibold text-ink hover-fine:bg-surface-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft sm:flex-none";

/** UK cookie consent for the Google Ads tag. Renders nothing when no Ads ID is set. */
export function ConsentBanner() {
  // "pending" on the server and first paint, so nothing flashes before storage is read.
  const choice = useSyncExternalStore<Choice | null | "pending">(subscribe, readChoice, () => "pending");

  useEffect(() => installClickTracking(), []);

  // The only place the Ads tag is loaded.
  useEffect(() => {
    if (choice === "accepted") loadGoogleAds();
  }, [choice]);

  if (!gadsEnabled || choice !== null) return null;

  return (
    <section
      aria-label="Cookie choice"
      className="fixed inset-x-0 bottom-[73px] z-[60] border-t border-hairline bg-surface p-4 sm:bottom-0"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-body">
          We would like to use a Google Ads cookie to see which adverts bring enquiries. We set it only
          if you accept.{" "}
          <Link href="/privacy" className="text-action-soft underline underline-offset-2">
            Privacy notice
          </Link>
        </p>
        <div className="flex gap-4">
          <button type="button" className={BUTTON} onClick={() => saveChoice("rejected")}>
            Reject
          </button>
          <button type="button" className={BUTTON} onClick={() => saveChoice("accepted")}>
            Accept
          </button>
        </div>
      </div>
    </section>
  );
}
