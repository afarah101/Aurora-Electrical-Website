import { MessageCircle } from "lucide-react";

// Press is deliberate (160ms), release snaps (100ms), hover colour eases 160ms.
const PRESS =
  "[transition:transform_100ms_var(--ease-out),background-color_160ms_var(--ease-out)] active:scale-[0.97] active:[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)] motion-reduce:active:scale-100";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft";

type Props = { whatsapp: string | null; className?: string };

/** Click-to-chat button. Renders nothing without a confirmed WhatsApp number. */
export function WhatsAppButton({ whatsapp, className = "" }: Props) {
  if (!whatsapp) return null;

  // wa.me wants the number in international form with digits only.
  const href = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-base font-semibold text-surface hover-fine:bg-whatsapp-hover ${PRESS} ${FOCUS} ${className}`}
    >
      <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-5" />
      WhatsApp us
    </a>
  );
}
