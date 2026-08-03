"use client";

import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";

type Props = { businessName: string; phone: string | null; telLink: string | null };

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#clients", label: "Clients" },
  { href: "#contact", label: "Contact" },
];

export function Nav({ businessName, phone, telLink }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"
      >
        <a
          href="#top"
          className="rounded-md text-lg font-semibold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
        >
          {businessName}
        </a>

        <div className="hidden items-center gap-8 sm:flex">
          <ul className="flex items-center gap-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-md text-sm font-medium text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {telLink && (
            <a
              href={`tel:${telLink}`}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-action px-4 text-sm font-semibold text-white transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              {phone}
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft sm:hidden"
        >
          {open ? (
            <X aria-hidden="true" className="h-6 w-6 text-white" />
          ) : (
            <Menu aria-hidden="true" className="h-6 w-6 text-white" />
          )}
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-slate-800 px-5 py-3 sm:hidden">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center text-sm font-medium text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
