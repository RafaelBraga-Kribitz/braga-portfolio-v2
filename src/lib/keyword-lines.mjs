// src/lib/keyword-lines.mjs — a project's listing keywords, two to a line,
// arranged so the lines come out even (owner, 30 Oct 2026): a long keyword
// shares its line with a short one, so no line runs long while another
// stays short. The keywords are mono, so a keyword's width is its length
// in characters; each keyword is boxed (components.css, .lr-key), which
// adds the same padding to each, and the keywords on one line are a gap
// apart.
//
// Every way of pairing the keywords is tried (six keywords: fifteen ways),
// and the arrangement kept is the one whose longest line is shortest; among
// equals, the most even one (the smallest sum of squared line widths), then
// the first found, which keeps the stack's own order. The lines are then
// ordered by the most important keyword they hold, and each line puts its
// more important keyword first, so the stack's first keyword still leads.

/** Width of one boxed keyword, in characters: the word and its padding. */
const BOX = 1.5;
/** Space between two boxed keywords on a line, in characters. */
const GAP = 1;

/**
 * The width of a line of keywords, in characters.
 * @param {string[]} line
 */
export function lineWidth(line) {
  return line.reduce((w, k) => w + [...k].length + BOX, 0) + GAP * Math.max(0, line.length - 1);
}

/**
 * The keywords two to a line, the longest line as short as it can be.
 * @param {string[]} keywords in order of importance
 * @returns {string[][]} the lines, each in order of importance
 */
export function keywordLines(keywords) {
  const n = keywords.length;
  if (n <= 2) return n ? [keywords.slice()] : [];
  /** @type {number[][] | null} */
  let best = null;
  let bestMax = Infinity;
  let bestSq = Infinity;
  const width = (/** @type {number[]} */ line) => lineWidth(line.map((i) => keywords[i]));
  /** @param {number[]} rest @param {number[][]} lines @param {boolean} single */
  const walk = (rest, lines, single) => {
    if (!rest.length) {
      const ws = lines.map(width);
      const max = Math.max(...ws);
      const sq = ws.reduce((s, w) => s + w * w, 0);
      if (max < bestMax || (max === bestMax && sq < bestSq)) { best = lines; bestMax = max; bestSq = sq; }
      return;
    }
    const [first, ...others] = rest;
    others.forEach((other, j) => walk(others.filter((_, k) => k !== j), [...lines, [first, other]], single));
    // an odd count leaves one keyword on a line of its own
    if (single) walk(others, [...lines, [first]], false);
  };
  walk(keywords.map((_, i) => i), [], n % 2 === 1);
  return /** @type {number[][]} */ (best)
    .map((line) => line.slice().sort((a, b) => a - b))
    .sort((a, b) => a[0] - b[0])
    .map((line) => line.map((i) => keywords[i]));
}
