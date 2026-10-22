// src/lib/tools/url-state.mjs — a bench's inputs in the address bar (UX
// pass, 22 Oct 2026), so a scenario survives a reload, can be sent to
// someone, and comes back from the browser history. Only values that
// differ from the defaults are written; the default scenario keeps a
// clean URL. Tested in tests/unit/parse.test.mjs.

/**
 * The numeric and choice fields found in a query string, clamped to their
 * bounds; anything unreadable is left out.
 * @param {string} search  location.search
 * @param {Record<string, {min:number,max:number}>} bounds  numeric fields
 * @param {Record<string, readonly string[]>} [choices]  fields with a fixed set of values
 */
export function readParams(search, bounds, choices = {}) {
  const q = new URLSearchParams(search);
  /** @type {Record<string, number|string>} */
  const out = {};
  for (const [k, b] of Object.entries(bounds)) {
    const raw = q.get(k);
    if (raw === null || raw.trim() === '') continue;
    const n = Number(raw);
    if (Number.isFinite(n)) out[k] = Math.min(b.max, Math.max(b.min, n));
  }
  for (const [k, allowed] of Object.entries(choices)) {
    const raw = q.get(k);
    if (raw !== null && allowed.includes(raw)) out[k] = raw;
  }
  return out;
}

/**
 * The query string ("" or "?a=1&b=2") for the fields of `state` that differ
 * from `defaults`, in the order of `keys`.
 * @param {Record<string, unknown>} state @param {Record<string, unknown>} defaults @param {string[]} keys
 */
export function writeParams(state, defaults, keys) {
  const q = new URLSearchParams();
  for (const k of keys) {
    const v = state[k];
    if (v === null || v === undefined || v === defaults[k]) continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}
