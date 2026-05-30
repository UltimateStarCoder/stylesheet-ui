import test from "node:test";
import assert from "node:assert/strict";
import { unifiedDiff } from "./diff";

const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, "");

test("collapses leading and trailing context around a mid-file change", () => {
  const before = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join("\n");
  const after = before.replace("line 10", "line 10 CHANGED");

  const out = stripAnsi(unifiedDiff(before, after));

  // The hidden head and tail are both marked.
  assert.match(out, /\.\.\./);
  // Distant context (line 1) is dropped, not printed in full.
  assert.doesNotMatch(out, /^ {2}line 1$/m);
  // The change itself and its near context survive.
  assert.match(out, /^- line 10$/m);
  assert.match(out, /^\+ line 10 CHANGED$/m);
  assert.match(out, /^ {2}line 9$/m);
  // Far fewer lines than the full 20-line file.
  assert.ok(
    out.split("\n").length < 12,
    `expected a collapsed hunk, got:\n${out}`,
  );
});

test("collapses context after a change near the top", () => {
  const before = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join("\n");
  const after = before.replace("line 2", "line 2 CHANGED");

  const out = stripAnsi(unifiedDiff(before, after));

  assert.match(out, /^ {2}line 1$/m); // immediate context kept
  assert.match(out, /\.\.\./); // trailing tail collapsed
  assert.doesNotMatch(out, /^ {2}line 18$/m);
});

test("does not collapse a file shorter than the context window", () => {
  const out = stripAnsi(unifiedDiff("a\nb\nc", "a\nB\nc"));

  assert.doesNotMatch(out, /\.\.\./);
  assert.match(out, /^- b$/m);
  assert.match(out, /^\+ B$/m);
});
