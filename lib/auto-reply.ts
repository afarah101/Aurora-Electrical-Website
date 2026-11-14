/**
 * Customer confirmation email sent after a contact-form enquiry.
 *
 * Off unless AUTO_REPLY_ENABLED is "true". It also needs FROM_EMAIL on a
 * domain verified in Resend: Resend's test sender (onboarding@resend.dev)
 * only delivers to the account owner, so it can never reach a customer.
 * Every fact comes from content/site.md through app/content.ts.
 */
export type AutoReplyInput = {
  name: string;
  businessName: string;
  phone: string | null;
  whatsapp: string | null;
};

export function autoReplyEnabled(): boolean {
  return process.env.AUTO_REPLY_ENABLED === "true" && Boolean(process.env.FROM_EMAIL);
}

/**
 * Anyone can type any email address into the form, so this email must not
 * carry free text from the submitter: it could be used to send messages that
 * appear to come from the business. Only a short, letters-only first name is
 * echoed; anything else falls back to "there". The fault text is never echoed.
 */
function safeFirstName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return /^[\p{L}][\p{L}'-]{0,24}$/u.test(first) ? first : "there";
}

export function buildAutoReply(input: AutoReplyInput): { subject: string; text: string } {
  const lines = [
    `Hi ${safeFirstName(input.name)},`,
    "",
    `Thank you for contacting ${input.businessName}. We have your message and will get back to you soon.`,
    "",
  ];

  if (input.phone) {
    lines.push(`If it is urgent, call us on ${input.phone}.`);
  }
  if (input.whatsapp) {
    const wa = input.whatsapp.replace(/\D/g, "");
    lines.push(`You can also message us on WhatsApp: https://wa.me/${wa}`);
  }
  lines.push(
    "",
    "If you smell burning or see sparks, switch off at the fuse board if it is safe to do so, then call us.",
    "",
    input.businessName,
  );

  return {
    subject: `${input.businessName}: we have your enquiry`,
    text: lines.join("\n"),
  };
}
