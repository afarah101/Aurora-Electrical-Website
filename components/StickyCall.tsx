import { Phone } from "lucide-react";

type Props = { phone: string | null; telLink: string | null };

/** Mobile-only click-to-call bar. Renders nothing without a confirmed number. */
export function StickyCall({ phone, telLink }: Props) {
  if (!telLink) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface/95 p-3 backdrop-blur sm:hidden">
      <a
        href={`tel:${telLink}`}
        className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-sm bg-action px-6 text-base font-semibold text-on-action hover-fine:bg-action-hover [transition:transform_100ms_var(--ease-out),background-color_160ms_var(--ease-out)] active:scale-[0.97] active:[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
      >
        <Phone aria-hidden="true" strokeWidth={1.5} className="size-5" />
        Call {phone}
      </a>
    </div>
  );
}
