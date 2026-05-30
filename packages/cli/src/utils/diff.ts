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
      // Span the full run of unchanged lines [i, j).
      let j = i;
      while (j < N && ops[j].kind === "same") j++;
      const changeAhead = j < N;
      const changeBehind = lines.length > 0;

      // A whole-file no-op run (no change on either side) carries no signal.
      if (!changeAhead && !changeBehind) {
        i = j;
        continue;
      }

      // Show up to `ctx` lines trailing the previous change (the "head") and
      // up to `ctx` lines leading the next change (the "tail"). Either side is
      // empty when there's no change on that side — so leading context before
      // the first change and trailing context after the last change collapse
      // too, not just the gaps between changes.
      const headEnd = changeBehind ? Math.min(i + ctx, j) : i;
      const tailStart = changeAhead ? Math.max(j - ctx, i) : j;

      if (headEnd >= tailStart) {
        // Head and tail meet or overlap: nothing is hidden, show the whole run.
        for (let k = i; k < j; k++) lines.push(pc.dim(`  ${ops[k].line}`));
      } else {
        for (let k = i; k < headEnd; k++) lines.push(pc.dim(`  ${ops[k].line}`));
        lines.push(pc.dim(`  ...`));
        for (let k = tailStart; k < j; k++) lines.push(pc.dim(`  ${ops[k].line}`));
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
