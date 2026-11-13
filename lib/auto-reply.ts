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
  fault: string;
  businessName: string;
  phone: string | null;
  whatsapp: string | null;
};

export function autoReplyEnabled(): boolean {
  return (
    process.env.AUTO_REPLY_ENABLED === "true" && Boolean(process.env.FROM_EMAIL)
  );
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name.trim();
}

function shorten(text: string, max = 200): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > max ? `${oneLine.slice(0, max - 1)}…` : oneLine;
}

export function buildAutoReply(input: AutoReplyInput): {
  subject: string;
  text: string;
} {
  const lines = [
    `Hi ${firstName(input.name)},`,
    "",
    `Thank you for contacting ${input.businessName}. We have your message and will get back to you soon.`,
    "",
    "You told us:",
    `"${shorten(input.fault)}"`,
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
    `${input.businessName}`,
  );

  return {
    subject: `${input.businessName}: we have your enquiry`,
    text: lines.join("\n"),
  };
}
