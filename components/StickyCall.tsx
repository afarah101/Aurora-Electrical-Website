import { Phone } from "lucide-react";

type Props = { phone: string | null; telLink: string | null };

/** Mobile-only click-to-call bar. Renders nothing without a confirmed number. */
export function StickyCall({ phone, telLink }: Props) {
  if (!telLink) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:hidden">
      <a
        href={`tel:${telLink}`}
        className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-action px-6 text-base font-semibold text-white transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
      >
        <Phone aria-hidden="true" className="h-5 w-5" />
        Call {phone}
      </a>
    </div>
  );
}
