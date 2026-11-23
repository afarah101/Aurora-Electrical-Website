import { Phone } from "lucide-react";
import { CTA_CALL, CTA_ICON } from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";

type Props = { phone: string | null; telLink: string | null };

/** Mobile-only click-to-call bar. Renders nothing without a confirmed number. */
export function StickyCall({ phone, telLink }: Props) {
  if (!telLink) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface/95 p-3 backdrop-blur sm:hidden">
      <a
        href={`tel:${telLink}`}
        className={cn(CTA_CALL, "flex")}
      >
        <Phone aria-hidden="true" strokeWidth={1.75} className={CTA_ICON} />
        Call {phone}
      </a>
    </div>
  );
}
