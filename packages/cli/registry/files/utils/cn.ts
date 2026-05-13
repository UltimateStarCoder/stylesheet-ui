// Style-array helper. Flattens nested arrays and drops falsy values so you
// can write `cn(styles.base, pressed && styles.pressed, style)` instead of
// the noisy `[styles.base, pressed && styles.pressed, style]` literal that
// requires the reader to mentally filter out the booleans.
export function cn<T>(...args: Array<T | T[] | false | null | undefined>): T[] {
  const out: T[] = [];
  for (const arg of args) {
    if (!arg) continue;
    if (Array.isArray(arg)) {
      for (const inner of arg) if (inner) out.push(inner);
    } else {
      out.push(arg);
    }
  }
  return out;
}
