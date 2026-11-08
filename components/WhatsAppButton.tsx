import { MessageCircle } from "lucide-react";

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
      className={`inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 text-base font-semibold text-slate-950 transition-colors hover:bg-[#1ebe5b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft ${className}`}
    >
      <MessageCircle aria-hidden="true" className="h-5 w-5" />
      WhatsApp us
    </a>
  );
}
