import { Command } from "commander";
import { initCommand } from "./commands/init";
import { addCommand } from "./commands/add";
import { listCommand } from "./commands/list";
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
    .option("-y, --yes", "overwrite existing files without prompting", false)
    .option("-v, --verbose", "print one line per file copied", false)
    .action(async (components: string[], opts) => {
      try {
        await addCommand(components, opts);
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
