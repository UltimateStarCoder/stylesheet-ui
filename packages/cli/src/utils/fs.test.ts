import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "fs-extra";
import { copyFileSafely } from "./fs";

// copyFileSafely is the single chokepoint for every irreversible write the CLI
// makes, so its overwrite policy gets table-driven coverage. Each test runs in
// a throwaway temp dir and silences per-file logging.
async function scratch(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "ssui-fs-test-"));
}

test("adds a new file when the destination is absent", async () => {
  const dir = await scratch();
  const from = path.join(dir, "source.txt");
  const to = path.join(dir, "nested", "dest.txt");
  await fs.writeFile(from, "hello", "utf8");

  const result = await copyFileSafely(from, to, { silent: true });

  assert.equal(result, "added");
  assert.equal(await fs.readFile(to, "utf8"), "hello");
});

test("skipIfExists leaves an existing file untouched", async () => {
  const dir = await scratch();
  const from = path.join(dir, "source.txt");
  const to = path.join(dir, "dest.txt");
  await fs.writeFile(from, "registry version", "utf8");
  await fs.writeFile(to, "user version", "utf8");

  const result = await copyFileSafely(from, to, { skipIfExists: true, silent: true });

  assert.equal(result, "skipped");
  assert.equal(await fs.readFile(to, "utf8"), "user version");
});

test("--force overwrites unconditionally", async () => {
  const dir = await scratch();
  const from = path.join(dir, "source.txt");
  const to = path.join(dir, "dest.txt");
  await fs.writeFile(from, "fresh", "utf8");
  await fs.writeFile(to, "edited by user", "utf8");

  const result = await copyFileSafely(from, to, { force: true, silent: true });

  assert.equal(result, "overwritten");
  assert.equal(await fs.readFile(to, "utf8"), "fresh");
});

test("--yes overwrites a pristine file", async () => {
  const dir = await scratch();
  const from = path.join(dir, "source.txt");
  const to = path.join(dir, "dest.txt");
  // Pristine == on-disk content matches what the registry would write.
  await fs.writeFile(from, "pristine", "utf8");
  await fs.writeFile(to, "pristine", "utf8");

  const result = await copyFileSafely(from, to, { yes: true, silent: true });

  assert.equal(result, "overwritten");
});

test("--yes preserves a locally-modified file", async () => {
  const dir = await scratch();
  const from = path.join(dir, "source.txt");
  const to = path.join(dir, "dest.txt");
  await fs.writeFile(from, "registry version", "utf8");
  await fs.writeFile(to, "my local edits", "utf8");

  const result = await copyFileSafely(from, to, { yes: true, silent: true });

  assert.equal(result, "preserved");
  assert.equal(await fs.readFile(to, "utf8"), "my local edits");
});

test("--dry-run reports intent without writing", async () => {
  const dir = await scratch();
  const from = path.join(dir, "source.txt");
  const to = path.join(dir, "dest.txt");
  await fs.writeFile(from, "hello", "utf8");

  const result = await copyFileSafely(from, to, { dryRun: true, silent: true });

  assert.equal(result, "would-add");
  assert.equal(await fs.pathExists(to), false);
});

test("--diff on a new file reports would-add without writing", async () => {
  const dir = await scratch();
  const from = path.join(dir, "source.txt");
  const to = path.join(dir, "dest.txt");
  await fs.writeFile(from, "hello", "utf8");

  const result = await copyFileSafely(from, to, { diff: true, silent: true });

  assert.equal(result, "would-add");
  assert.equal(await fs.pathExists(to), false);
});

test("--diff on an identical file reports would-skip", async () => {
  const dir = await scratch();
  const from = path.join(dir, "source.txt");
  const to = path.join(dir, "dest.txt");
  await fs.writeFile(from, "same", "utf8");
  await fs.writeFile(to, "same", "utf8");

  const result = await copyFileSafely(from, to, { diff: true, silent: true });

  assert.equal(result, "would-skip");
});

test("transform is applied to written content", async () => {
  const dir = await scratch();
  const from = path.join(dir, "source.txt");
  const to = path.join(dir, "dest.txt");
  await fs.writeFile(from, 'from "../theme/tokens"', "utf8");

  const result = await copyFileSafely(from, to, {
    silent: true,
    transform: (c) => c.replace("../theme", "@/theme"),
  });

  assert.equal(result, "added");
  assert.equal(await fs.readFile(to, "utf8"), 'from "@/theme/tokens"');
});
