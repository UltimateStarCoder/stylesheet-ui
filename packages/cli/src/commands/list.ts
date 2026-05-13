import pc from "picocolors";
import { listAllEntries } from "../registry";
import type { RegistryEntry, RegistryType } from "../registry/schema";

const TYPE_ORDER: RegistryType[] = ["component", "theme", "util"];
const TYPE_LABEL: Record<RegistryType, string> = {
  component: "Components",
  theme: "Foundation",
  util: "Utilities",
};

export async function listCommand(): Promise<void> {
  const entries = await listAllEntries();
  const grouped = groupByType(entries);

  for (const type of TYPE_ORDER) {
    const items = grouped.get(type);
    if (!items || items.length === 0) continue;

    console.log("");
    console.log(pc.bold(TYPE_LABEL[type]));

    const longest = Math.max(...items.map((e) => e.name.length));
    for (const entry of items.sort(byName)) {
      const pad = " ".repeat(longest - entry.name.length + 2);
      const desc = entry.description ?? "";
      console.log(`  ${pc.cyan(entry.name)}${pad}${pc.dim(desc)}`);
    }
  }

  console.log("");
  console.log(pc.dim("Add components with: stylesheet-ui add <name> [...names]"));
}

function groupByType(entries: RegistryEntry[]): Map<RegistryType, RegistryEntry[]> {
  const map = new Map<RegistryType, RegistryEntry[]>();
  for (const e of entries) {
    const list = map.get(e.type) ?? [];
    list.push(e);
    map.set(e.type, list);
  }
  return map;
}

function byName(a: RegistryEntry, b: RegistryEntry): number {
  return a.name.localeCompare(b.name);
}
