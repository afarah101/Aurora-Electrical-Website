import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Reads one value from the "## MyBuilder" section of content/site.md.
 * Returns null when the section, the key or a confirmed value is missing,
 * so callers render nothing rather than inventing a rating.
 */
export function mybuilderField(key: string): string | null {
  try {
    const lines = readFileSync(
      join(process.cwd(), "content", "site.md"),
      "utf8",
    ).split("\n");
    const start = lines.findIndex(
      (l) => l.trim().toLowerCase() === "## mybuilder",
    );
    if (start === -1) return null;
    for (const line of lines.slice(start + 1)) {
      if (line.startsWith("## ")) break;
      const t = line.trim();
      if (t.toLowerCase().startsWith(`- ${key.toLowerCase()}:`)) {
        const value = t.slice(t.indexOf(":") + 1).trim();
        return value && !/\[(PLACEHOLDER|TBC)/i.test(value) ? value : null;
      }
    }
    return null;
  } catch {
    return null;
  }
}
