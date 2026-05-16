import fs from "fs-extra";
import path from "node:path";
import { rewriteImports } from "../src/utils/rewrite";

// Syncs packages/ui/src/{theme,components,utils} into
// packages/cli/registry/files/<section> so the CLI ships a snapshot of the
// library source. Then validates that every registry manifest correctly
// declares its cross-section dependencies and that every cross-section
// relative import is reachable by the rewrite pass.
//
// Run before `npm run build`. Exits non-zero on drift so CI catches a stale
// or incorrectly-declared registry before publish.

const CLI_ROOT = path.resolve(__dirname, "..");
const UI_SRC = path.resolve(CLI_ROOT, "..", "ui", "src");
const REGISTRY_ROOT = path.join(CLI_ROOT, "registry");
const FILES_ROOT = path.join(REGISTRY_ROOT, "files");

const SECTIONS = ["theme", "components", "utils"] as const;
type Section = (typeof SECTIONS)[number];

// Maps the import path's section (`theme`, `utils`, `components`) to the
// registry manifest name a consumer would `add`. Theme + utils ship as single
// manifests; components are one manifest per file.
const SECTION_TO_MANIFEST: Record<"theme" | "utils", string> = {
  theme: "theme",
  utils: "utils",
};

type RegistryFile = { from: string; to: string };
type Manifest = {
  name: string;
  type: "theme" | "util" | "component";
  registryDependencies?: string[];
  peerDependencies?: Record<string, string>;
  files: RegistryFile[];
};

// `react` and `react-native` are always present in any RN project — they need
// no declaration in a manifest's `peerDependencies`.
const IMPLICIT_PEERS = new Set(["react", "react-native"]);

// Reduce a bare specifier like `react-native-reanimated/lib/x` to its npm
// package name (`react-native-reanimated`), so scoped paths still match the
// declared peer.
function packageNameOf(spec: string): string {
  if (spec.startsWith("@")) {
    const [scope, name] = spec.split("/");
    return name ? `${scope}/${name}` : spec;
  }
  return spec.split("/")[0];
}

async function syncFiles(): Promise<void> {
  for (const section of SECTIONS) {
    const from = path.join(UI_SRC, section);
    const to = path.join(FILES_ROOT, section);
    if (!(await fs.pathExists(from))) {
      throw new Error(`Source dir not found: ${from}`);
    }
    await fs.emptyDir(to);
    await fs.copy(from, to);
    console.log(`✓ synced ${section}`);
  }
}

async function loadManifests(): Promise<Manifest[]> {
  const entries = await fs.readdir(REGISTRY_ROOT);
  const manifests: Manifest[] = [];
  for (const entry of entries) {
    if (!entry.endsWith(".json")) continue;
    const full = path.join(REGISTRY_ROOT, entry);
    const stat = await fs.stat(full);
    if (!stat.isFile()) continue;
    manifests.push((await fs.readJson(full)) as Manifest);
  }
  return manifests;
}

// Extracts every `from "<path>"` import specifier from a TS/JS source file.
// Handles single and double quotes; intentionally ignores dynamic `import(...)`
// and `require(...)` because the registry sources do not use them.
function extractImportSpecifiers(source: string): string[] {
  const specs: string[] = [];
  const re = /\bfrom\s+["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    specs.push(m[1]);
  }
  return specs;
}

// Classifies an import specifier as same-section relative, cross-section
// relative (theme/utils/components), or external (bare specifier).
type CrossSection = { kind: "cross"; section: Section; rest: string; raw: string };
type SameSection = { kind: "same"; raw: string };
type External = { kind: "external"; raw: string };

function classify(spec: string): CrossSection | SameSection | External {
  if (!spec.startsWith(".")) return { kind: "external", raw: spec };
  const m = spec.match(/^(?:\.\.\/)+([a-z][a-z0-9-]*)\/(.+)$/);
  if (!m) return { kind: "same", raw: spec };
  const section = m[1] as Section;
  if (!SECTIONS.includes(section)) return { kind: "same", raw: spec };
  return { kind: "cross", section, rest: m[2], raw: spec };
}

type ValidationError = { manifest: string; message: string };

async function validateManifests(manifests: Manifest[]): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];

  // Probe aliases that never collide with anything a real consumer would set,
  // so we can detect whether rewriteImports actually matched a specifier.
  const probeAliases = {
    components: "@@PROBE_COMPONENTS@@",
    theme: "@@PROBE_THEME@@",
    utils: "@@PROBE_UTILS@@",
  };

  for (const manifest of manifests) {
    const declaredRegistry = new Set(manifest.registryDependencies ?? []);
    const declaredPeers = new Set(Object.keys(manifest.peerDependencies ?? {}));
    const usedRegistry = new Set<string>();
    const usedPeers = new Set<string>();

    for (const file of manifest.files) {
      const sourcePath = path.join(FILES_ROOT, file.from);
      if (!(await fs.pathExists(sourcePath))) {
        errors.push({
          manifest: manifest.name,
          message: `references ${file.from} but the file does not exist after sync`,
        });
        continue;
      }
      const source = await fs.readFile(sourcePath, "utf8");
      const specs = extractImportSpecifiers(source);

      for (const spec of specs) {
        const classified = classify(spec);

        if (classified.kind === "external") {
          const pkg = packageNameOf(classified.raw);
          if (!IMPLICIT_PEERS.has(pkg)) {
            usedPeers.add(pkg);
          }
          continue;
        }

        if (classified.kind !== "cross") continue;

        // For theme/utils sections each import maps to a single manifest. A
        // future component-to-component import would resolve to a manifest
        // whose name equals the leaf filename without extension.
        const depName =
          classified.section === "components"
            ? path.basename(classified.rest, path.extname(classified.rest))
            : SECTION_TO_MANIFEST[classified.section];

        usedRegistry.add(depName);

        // Ensures the rewrite regex stays in sync with the shapes committed
        // to source — any unmatched cross-section import would ship broken.
        const probe = `from "${spec}"`;
        const rewritten = rewriteImports(probe, probeAliases);
        if (rewritten === probe) {
          errors.push({
            manifest: manifest.name,
            message: `import "${spec}" in ${file.from} is not matched by rewriteImports; consumer projects will receive a broken path`,
          });
        }
      }
    }

    for (const dep of usedRegistry) {
      if (!declaredRegistry.has(dep)) {
        errors.push({
          manifest: manifest.name,
          message: `imports from "${dep}" but does not declare it in registryDependencies`,
        });
      }
    }

    for (const peer of usedPeers) {
      if (!declaredPeers.has(peer)) {
        errors.push({
          manifest: manifest.name,
          message: `imports "${peer}" but does not declare it in peerDependencies`,
        });
      }
    }
  }

  return errors;
}

async function main() {
  await syncFiles();

  const manifests = await loadManifests();
  const errors = await validateManifests(manifests);

  if (errors.length > 0) {
    console.error("");
    console.error(`✗ Registry validation failed (${errors.length} issue${errors.length === 1 ? "" : "s"}):`);
    for (const e of errors) {
      console.error(`  - ${e.manifest}: ${e.message}`);
    }
    process.exit(1);
  }

  console.log(`✓ validated ${manifests.length} manifest${manifests.length === 1 ? "" : "s"}`);
  console.log("Registry sync complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
