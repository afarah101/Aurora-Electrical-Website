import { MessageCircle } from "lucide-react";

/*
 * shortcut: the number is a literal here, not read from content/site.md, because
 * this button is rendered inside the client-side ContactForm. Move it into
 * site.md and pass it through the pages if the WhatsApp number ever differs
 * from the phone line.
 */
const WHATSAPP_URL = "https://wa.me/447304150154";

type Props = { className?: string };

export function WhatsAppButton({ className = "" }: Props) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 text-base font-semibold text-slate-950 transition-colors hover:bg-[#1ebe5b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft ${className}`}
    >
      <MessageCircle aria-hidden="true" className="h-5 w-5" />
      WhatsApp us
    </a>
  );
}
