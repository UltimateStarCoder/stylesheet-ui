import fs from "fs-extra";
import path from "node:path";
import type { RegistryEntry } from "./schema";

const REGISTRY_ROOT = path.resolve(__dirname, "..", "registry");
const FILES_ROOT = path.join(REGISTRY_ROOT, "files");

export function getRegistryFilesRoot(): string {
  return FILES_ROOT;
}

export async function loadRegistryEntry(name: string): Promise<RegistryEntry> {
  const manifestPath = path.join(REGISTRY_ROOT, `${name}.json`);
  if (!(await fs.pathExists(manifestPath))) {
    throw new Error(
      `Unknown registry entry: "${name}". Run \`stylesheet-ui list\` to see available names.`,
    );
  }
  const entry = (await fs.readJson(manifestPath)) as RegistryEntry;
  if (entry.name !== name) {
    throw new Error(
      `Registry manifest at ${manifestPath} has name "${entry.name}", expected "${name}".`,
    );
  }
  return entry;
}

// Lists every registry manifest in the bundle. Used by `list` and tab
// completion in the future.
export async function listAllEntries(): Promise<RegistryEntry[]> {
  const entries: RegistryEntry[] = [];
  const files = await fs.readdir(REGISTRY_ROOT);
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const full = path.join(REGISTRY_ROOT, file);
    const stat = await fs.stat(full);
    if (!stat.isFile()) continue;
    const entry = (await fs.readJson(full)) as RegistryEntry;
    entries.push(entry);
  }
  return entries;
}

// Topologically resolve a set of registry names + their transitive
// dependencies. Returns the install order (deps first, requested entries last).
export async function resolveInstallPlan(
  requested: string[],
): Promise<RegistryEntry[]> {
  const visited = new Map<string, RegistryEntry>();
  const order: RegistryEntry[] = [];

  async function visit(name: string, stack: string[]) {
    if (visited.has(name)) return;
    if (stack.includes(name)) {
      throw new Error(
        `Cycle detected in registry dependencies: ${[...stack, name].join(" -> ")}`,
      );
    }
    const entry = await loadRegistryEntry(name);
    for (const dep of entry.registryDependencies ?? []) {
      await visit(dep, [...stack, name]);
    }
    visited.set(name, entry);
    order.push(entry);
  }

  for (const name of requested) {
    await visit(name, []);
  }
  return order;
}
