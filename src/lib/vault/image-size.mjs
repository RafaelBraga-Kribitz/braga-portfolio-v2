// src/lib/vault/image-size.mjs — the pixel size of an image file, read from
// its header, so an embedded picture carries width and height and the page
// does not jump while it loads. PNG, GIF, JPEG and WebP; anything else (or
// a file that does not parse) returns undefined and the image keeps its
// natural box.
import { openSync, readSync, closeSync } from 'node:fs';

/** @param {string} path @returns {{ width: number, height: number } | undefined} */
export function imageSize(path) {
  let fd;
  try {
    fd = openSync(path, 'r');
    const buf = Buffer.alloc(64 * 1024);
    const n = readSync(fd, buf, 0, buf.length, 0);
    return parse(buf.subarray(0, n));
  } catch {
    return undefined;
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}

/** @param {Buffer} b */
export function parse(b) {
  if (b.length < 24) return undefined;
  // PNG: IHDR width/height at 16/20
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  // GIF: logical screen at 6/8, little-endian
  if (b.toString('ascii', 0, 3) === 'GIF') return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  // WebP: VP8 / VP8L / VP8X
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') { const v = b.readUInt32LE(21); return { width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 }; }
    if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  }
  // JPEG: walk the segments to the first SOFn
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  return undefined;
}
