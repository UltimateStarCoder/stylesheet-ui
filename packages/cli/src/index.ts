import { Command } from "commander";
import { initCommand } from "./commands/init";
import { addCommand } from "./commands/add";
import { listCommand } from "./commands/list";
import { updateCommand } from "./commands/update";
import { logger } from "./utils/logger";
import pkg from "../package.json";

async function main() {
  const program = new Command()
    .name("stylesheet-ui")
    .description("Add stylesheet-ui components to your Expo / React Native project.")
    .version(pkg.version);

  program
    .command("init")
    .description("Initialize stylesheet-ui in your project.")
    .option("-y, --yes", "skip prompts, accept defaults", false)
    .action(async (opts) => {
      try {
        await initCommand(opts);
      } catch (err) {
        logger.error((err as Error).message);
        process.exit(1);
      }
    });

  program
    .command("add")
    .description("Add component(s) to your project.")
    .argument("<components...>", "component names (e.g. button input)")
    .option("-y, --yes", "skip prompts; preserve files with local edits", false)
    .option("-f, --force", "overwrite even files with local edits", false)
    .option("-v, --verbose", "print one line per file copied", false)
    .option("-d, --dry-run", "preview what would be written without touching the filesystem", false)
    .option("--diff", "show a unified diff between existing files and the registry version", false)
    .action(async (components: string[], opts) => {
      try {
        if (opts.diff && opts.dryRun) {
          throw new Error("--diff and --dry-run are mutually exclusive. Pick one.");
        }
        await addCommand(components, opts);
      } catch (err) {
        logger.error((err as Error).message);
        process.exit(1);
      }
    });

  program
    .command("update")
    .alias("up")
    .description("Refresh installed component(s) from the registry. Omit names to update everything you've added.")
    .argument("[components...]", "component names; defaults to every installed component")
    .option("-y, --yes", "skip prompts; preserve files with local edits", false)
    .option("-f, --force", "overwrite even files with local edits", false)
    .option("-v, --verbose", "print one line per file copied", false)
    .option("-d, --dry-run", "preview what would be written without touching the filesystem", false)
    .option("--diff", "show a unified diff between existing files and the registry version", false)
    .action(async (components: string[], opts) => {
      try {
        await updateCommand(components, opts);
      } catch (err) {
        logger.error((err as Error).message);
        process.exit(1);
      }
    });

  program
    .command("list")
    .alias("ls")
    .description("List every component available in the registry.")
    .action(async () => {
      try {
        await listCommand();
      } catch (err) {
        logger.error((err as Error).message);
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}

main();
