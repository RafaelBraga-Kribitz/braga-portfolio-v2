/** Validate the build-time tag catalogue paging override. */
export function letterPagesFrom(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 300;
}

/** Neighbours in a newest-first register, without wrapping its ends.
 * @template {{ id: string }} T
 * @param {readonly T[]} list
 * @param {T} current
 */
export function readingNeighbours(list, current) {
  const i = list.findIndex((entry) => entry.id === current.id);
  return { newer: i > 0 ? list[i - 1] : undefined, older: i >= 0 ? list[i + 1] : undefined };
}
