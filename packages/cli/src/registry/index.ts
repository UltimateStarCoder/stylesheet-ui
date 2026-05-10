import fs from "fs-extra";
import path from "node:path";
import type { RegistryEntry } from "./schema";

// Registry files are bundled in the published package at `<pkg>/registry/`.
// `__dirname` after tsup-bundling resolves to `<pkg>/dist`, so the registry
// sits one directory up.
const REGISTRY_ROOT = path.resolve(__dirname, "..", "registry");
const FILES_ROOT = path.join(REGISTRY_ROOT, "files");

export function getRegistryFilesRoot(): string {
  return FILES_ROOT;
}

export async function loadRegistryEntry(name: string): Promise<RegistryEntry> {
  const manifestPath = path.join(REGISTRY_ROOT, `${name}.json`);
  if (!(await fs.pathExists(manifestPath))) {
    throw new Error(
      `Unknown registry entry: "${name}". No manifest at ${manifestPath}.`,
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
