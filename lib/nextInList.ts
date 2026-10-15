/**
 * The `count` items that follow `current` in `list`, wrapping round to the start.
 * Used for "other standards" and "other industries" links so each page links to its
 * neighbours and every page in the set receives links.
 */
export function nextInList<T>(
  list: readonly T[],
  current: T,
  count: number,
): T[] {
  const start = list.indexOf(current);
  const out: T[] = [];
  for (let i = 1; out.length < Math.min(count, list.length - 1); i++) {
    out.push(list[(start + i) % list.length]);
  }
  return out;
}
