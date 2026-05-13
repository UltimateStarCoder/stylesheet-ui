import pc from "picocolors";

// Tiny line-by-line diff using LCS. No npm dep, ~50 lines.
// Output mimics `diff -u`: green `+` lines, red `-` lines, dim context.
// For our use case (showing what `add` would change in an existing file),
// this is plenty — we don't need the speed of myers diff or the precision of
// word-level highlighting.
export function unifiedDiff(
  before: string,
  after: string,
  options: { contextLines?: number } = {},
): string {
  const a = before.split("\n");
  const b = after.split("\n");
  const ops = lcsDiff(a, b);

  const ctx = options.contextLines ?? 2;
  const lines: string[] = [];
  const N = ops.length;

  // Collapse runs of unchanged context, keeping `ctx` lines around each change.
  let i = 0;
  while (i < N) {
    if (ops[i].kind === "same") {
      // Look ahead for the next change.
      let j = i;
      while (j < N && ops[j].kind === "same") j++;
      const changeAhead = j < N;
      const changeBehind = lines.length > 0;
      const startTrim = changeBehind ? i + ctx : j;
      const endTrim = changeAhead ? Math.max(startTrim, j - ctx) : i;

      // Emit `ctx` lines after a previous change.
      for (let k = i; k < Math.min(startTrim, j); k++) {
        lines.push(pc.dim(`  ${ops[k].line}`));
      }
      // Skip the middle.
      if (endTrim > startTrim) {
        lines.push(pc.dim(`  ...`));
      }
      // Emit `ctx` lines before the next change.
      for (let k = Math.max(endTrim, startTrim); k < j; k++) {
        lines.push(pc.dim(`  ${ops[k].line}`));
      }
      i = j;
    } else if (ops[i].kind === "remove") {
      lines.push(pc.red(`- ${ops[i].line}`));
      i++;
    } else {
      lines.push(pc.green(`+ ${ops[i].line}`));
      i++;
    }
  }

  return lines.join("\n");
}

type Op = { kind: "same" | "remove" | "add"; line: string };

// Classic LCS-based diff. O(n*m) — fine for files under a few thousand lines,
// which every component in this registry is.
function lcsDiff(a: string[], b: string[]): Op[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ kind: "same", line: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ kind: "remove", line: a[i] });
      i++;
    } else {
      ops.push({ kind: "add", line: b[j] });
      j++;
    }
  }
  while (i < n) ops.push({ kind: "remove", line: a[i++] });
  while (j < m) ops.push({ kind: "add", line: b[j++] });
  return ops;
}
