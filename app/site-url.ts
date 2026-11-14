import { readFileSync } from "node:fs";
import { join } from "node:path";

/** The canonical host. The bare domain redirects here, so search engines index www. */
export const SITE_URL = "https://www.aurora-electricals.com";

/** MyBuilder profile from content/site.md, used as a sameAs link in the schema. */
export const myBuilderProfile: string | null = (() => {
  const md = readFileSync(join(process.cwd(), "content", "site.md"), "utf8");
  const section = md.split(/^## /m).find((s) => s.startsWith("MyBuilder"));
  const match = section?.match(/^- Profile:\s*(https:\/\/\S+)\s*$/m);
  return match ? match[1] : null;
})();
