import pc from "picocolors";

export const logger = {
  info:  (msg: string) => console.log(msg),
  success: (msg: string) => console.log(pc.green("✓") + " " + msg),
  warn:    (msg: string) => console.log(pc.yellow("!") + " " + msg),
  error:   (msg: string) => console.error(pc.red("✗") + " " + msg),
  step:    (msg: string) => console.log(pc.cyan("›") + " " + msg),
  dim:     (msg: string) => console.log(pc.dim(msg)),
  added:   (file: string) => console.log(pc.green("+") + " " + file),
  skipped: (file: string) => console.log(pc.dim("- " + file + " (already exists)")),
};
