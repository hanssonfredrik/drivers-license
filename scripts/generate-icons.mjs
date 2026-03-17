/**
 * Generates simple PWA icon PNGs using pure Node.js with no external deps.
 * Uses a minimal PNG encoder to produce solid-color icons with a car/road symbol.
 * Run with: node scripts/generate-icons.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Minimal PNG encoder (no compression, for icon generation only)
function createPNG(width, height, getPixel) {
  const CRC_TABLE = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    CRC_TABLE[n] = c;
  }
  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
  function chunk(type, data) {
    const t = Buffer.from(type, 'ascii');
    const d = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const len = Buffer.alloc(4); len.writeUInt32BE(d.length);
    const crcBuf = Buffer.concat([t, d]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(crcBuf));
    return Buffer.concat([len, t, d, crc]);
  }

  const imageData = [];
  for (let y = 0; y < height; y++) {
    imageData.push(0); // filter byte: none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      imageData.push(r, g, b, a);
    }
  }
  // No compression: use zlib store block
  const raw = Buffer.from(imageData);
  const BLOCK_SIZE = 65535;
  const blocks = [];
  for (let off = 0; off < raw.length; off += BLOCK_SIZE) {
    const end = Math.min(off + BLOCK_SIZE, raw.length);
    const isLast = end === raw.length ? 1 : 0;
    const blk = raw.slice(off, end);
    const hdr = Buffer.alloc(5);
    hdr[0] = isLast;
    hdr.writeUInt16LE(blk.length, 1);
    hdr.writeUInt16LE(~blk.length & 0xFFFF, 3);
    blocks.push(hdr, blk);
  }
  const zlibHeader = Buffer.from([0x78, 0x01]);
  const adler32 = (() => {
    let s1 = 1, s2 = 0;
    for (const b of raw) { s1 = (s1 + b) % 65521; s2 = (s2 + s1) % 65521; }
    const r = Buffer.alloc(4); r.writeUInt32BE((s2 << 16) | s1); return r;
  })();
  const idat = Buffer.concat([zlibHeader, ...blocks, adler32]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function drawIcon(x, y, w, h) {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) / 2;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background circle: brand blue #1d4ed8
  const inCircle = dist <= r - 1;
  if (!inCircle) return [0, 0, 0, 0]; // transparent

  // Steering wheel ring
  const ringOuter = r * 0.75;
  const ringInner = r * 0.58;
  const inRing = dist >= ringInner && dist <= ringOuter;
  if (inRing) return [255, 255, 255, 255];

  // Spokes at 3 angles (top, bottom-left, bottom-right)
  const angles = [Math.PI / 2, Math.PI / 2 + 2 * Math.PI / 3, Math.PI / 2 + 4 * Math.PI / 3];
  const spokeWidth = r * 0.09;
  for (const angle of angles) {
    const sx = cx + Math.cos(angle) * ringOuter, sy = cy - Math.sin(angle) * ringOuter;
    const ex = cx + Math.cos(angle) * ringInner, ey = cy - Math.sin(angle) * ringInner;
    const proj = ((x - sx) * (ex - sx) + (y - sy) * (ey - sy)) / ((ex - sx) ** 2 + (ey - sy) ** 2);
    if (proj >= 0 && proj <= 1) {
      const perpDist = Math.sqrt(((x - sx) - proj * (ex - sx)) ** 2 + ((y - sy) - proj * (ey - sy)) ** 2);
      if (perpDist < spokeWidth) return [255, 255, 255, 255];
    }
  }

  // Hub
  if (dist < ringInner * 0.25) return [255, 255, 255, 255];

  // Background fill
  return [29, 78, 216, 255]; // #1d4ed8
}

mkdirSync(join(ROOT, 'public', 'icons'), { recursive: true });

console.log('Generating 192x192 icon...');
writeFileSync(join(ROOT, 'public', 'icons', 'icon-192.png'), createPNG(192, 192, drawIcon));
console.log('Generating 512x512 icon...');
writeFileSync(join(ROOT, 'public', 'icons', 'icon-512.png'), createPNG(512, 512, drawIcon));
console.log('Done! Icons written to public/icons/');
