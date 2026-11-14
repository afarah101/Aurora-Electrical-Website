"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";

type Props = { businessName: string; phone: string | null; telLink: string | null };

// "/#…" so the home-page anchors also work from the other pages. `page` is the
// route this link counts as current on; on that route it points at `pageHref`.
const LINKS: Array<{ href: string; label: string; page?: string; pageHref?: string }> = [
  { href: "/#services", label: "Services" },
  { href: "/emergency-electrician", label: "Emergency", page: "/emergency-electrician" },
  { href: "/eicr-landlords", label: "Landlord EICR", page: "/eicr-landlords" },
  { href: "/#work", label: "Work" },
  { href: "/#clients", label: "Clients" },
  // /contact has its own form, so stay on the page there.
  { href: "/#contact", label: "Contact", page: "/contact", pageHref: "#contact" },
];

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft";
// Press is deliberate (160ms), release snaps (100ms), hover colour eases 160ms.
const PRESS =
  "[transition:transform_100ms_var(--ease-out),background-color_160ms_var(--ease-out)] active:scale-[0.97] active:[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)] motion-reduce:active:scale-100";

/**
 * Floating pill, detached from the top edge. It always carries its own
 * translucent surface, so it reads over the hero and over every section
 * below it with no scroll-driven state. Blur is allowed here only because the
 * element is fixed. The band it occupies (8px gap + 60px pill) is the
 * --spacing-nav token the hero subtracts.
 *
 * Mobile menu: a panel under the pill. Escape closes it and returns focus to
 * the toggle; while open, Tab and Shift+Tab cycle inside the header.
 */
export function Nav({ businessName, phone, telLink }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // While the menu is open the page behind it is out of reach: everything
  // beside the header (main, footer, the sticky call bar) goes inert, so
  // pointer, Tab and screen readers stay in the header. The menu exists only
  // below lg, so widening past lg closes it and lifts the lock.
  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    const behind = Array.from(header?.parentElement?.children ?? []).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== header,
    );
    behind.forEach((el) => (el.inert = true));
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && setOpen(false);
    wide.addEventListener("change", onWide);
    return () => {
      wide.removeEventListener("change", onWide);
      behind.forEach((el) => (el.inert = false));
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    if (!header) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(header.querySelectorAll<HTMLElement>("a[href], button")).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!header.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const links = LINKS.map((link) => {
    const current = link.page === pathname;
    return { ...link, href: current && link.pageHref ? link.pageHref : link.href, current };
  });
  const currentClass = "text-ink underline decoration-action-soft decoration-2 underline-offset-8";

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-40 px-3 pt-2">
      <nav
        aria-label="Main"
        className="mx-auto flex h-[60px] max-w-6xl items-center justify-between rounded-full bg-surface-raised/80 pl-5 pr-2 ring-1 ring-hairline backdrop-blur-md"
      >
        {/*
          The wordmark crop of the client's logo (the word is IN the logo, so
          no duplicate text beside it). Served at 2x its display height so it
          stays sharp on retina; the accessible name keeps the brand for
          screen readers.
        */}
        <a href="#top" aria-label={`${businessName}, home`} className={`rounded-sm ${FOCUS}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/aurora-logo-nav.png" alt={businessName} className="h-7 w-auto rounded-sm sm:h-8" />
        </a>

        <div className="flex items-center gap-2 lg:gap-6">
          <ul className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={`rounded-sm text-sm font-medium transition-colors duration-[160ms] ease-out hover-fine:text-ink ${FOCUS} ${
                    link.current ? currentClass : "text-ink-muted"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {telLink && (
            <a
              href={`tel:${telLink}`}
              aria-label={phone ? `Call ${phone}` : "Call us"}
              className={`inline-flex size-11 items-center justify-center gap-2 rounded-full bg-action text-sm font-semibold text-ink hover-fine:bg-action-hover sm:w-auto sm:px-5 ${PRESS} ${FOCUS}`}
            >
              <Phone aria-hidden="true" strokeWidth={1.5} className="size-4" />
              <span className="hidden sm:inline">{phone}</span>
            </a>
          )}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`flex size-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors duration-[160ms] ease-out hover-fine:bg-surface-high lg:hidden ${FOCUS}`}
          >
            {open ? (
              <X aria-hidden="true" strokeWidth={1.5} className="size-6" />
            ) : (
              <Menu aria-hidden="true" strokeWidth={1.5} className="size-6" />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <ul
          id="mobile-menu"
          className="mx-auto mt-2 max-w-6xl rounded-[16px] bg-surface-raised/95 p-3 ring-1 ring-hairline backdrop-blur-md [transition:opacity_200ms_var(--ease-out),transform_200ms_var(--ease-out)] starting:opacity-0 starting:[transform:translateY(-4px)] motion-reduce:starting:[transform:none] lg:hidden"
        >
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={link.current ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-[10px] px-3 text-base font-medium ${FOCUS} ${
                  link.current ? currentClass : "text-ink-body"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
