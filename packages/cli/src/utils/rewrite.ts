import type { StylesheetUiConfig } from "../registry/schema";

const SECTIONS: Array<{ name: "theme" | "utils" | "components"; key: keyof StylesheetUiConfig["aliases"] }> = [
  { name: "theme",      key: "theme" },
  { name: "utils",      key: "utils" },
  { name: "components", key: "components" },
];

// Rewrites cross-section relative imports to use the consumer's configured aliases.
// Matches any `from "<one-or-more ../>theme/<x>"` (and same for utils/components),
// leaves intra-section relatives like "./tokens" untouched.
export function rewriteImports(
  content: string,
  aliases: StylesheetUiConfig["aliases"],
): string {
  let result = content;
  for (const section of SECTIONS) {
    const alias = aliases[section.key];
    const re = new RegExp(
      `(from\\s+["'])(?:\\.\\.\\/)+${section.name}\\/([^"']+)(["'])`,
      "g",
    );
    result = result.replace(re, `$1${alias}/$2$3`);
  }
  return result;
}

export function shouldRewrite(filename: string): boolean {
  return /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filename);
}
