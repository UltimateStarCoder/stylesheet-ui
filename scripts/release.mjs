#!/usr/bin/env node

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const bump = process.argv[2] ?? "patch";
const allowedBumps = new Set([
  "patch",
  "minor",
  "major",
  "prepatch",
  "preminor",
  "premajor",
  "prerelease"
]);

if (!allowedBumps.has(bump)) {
  console.error(
    `Invalid bump type '${bump}'. Use one of: ${Array.from(allowedBumps).join(", ")}.`
  );
  process.exit(1);
}

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function runCapture(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

try {
  run("git diff --quiet");
  run("git diff --cached --quiet");
} catch {
  console.error("Git working tree is not clean. Commit or stash changes before releasing.");
  process.exit(1);
}

console.log(`Starting ${bump} release...`);

run(`npm version ${bump} --no-git-tag-version`);
run(`npm version ${bump} --workspace stylesheet-ui --no-git-tag-version`);
run(`npm version ${bump} --workspace @stylesheet-ui/ui --no-git-tag-version`);
run("npm install --package-lock-only");

const cliPackage = JSON.parse(readFileSync("packages/cli/package.json", "utf8"));
const version = cliPackage.version;
const branch = runCapture("git rev-parse --abbrev-ref HEAD");

run("git add package.json package-lock.json packages/cli/package.json packages/ui/package.json");
run(`git commit -m \"chore(release): v${version}\"`);
run(`git tag v${version}`);
run(`git push origin ${branch}`);
run(`git push origin v${version}`);

console.log(`Release v${version} created and pushed.`);
