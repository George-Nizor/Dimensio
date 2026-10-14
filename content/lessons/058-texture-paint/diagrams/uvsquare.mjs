// A small UV square for the mistake pair. Not a diagram itself. With `overlap`, two islands lie on
// the same spot; without, they sit apart.
export function uvSquare(kit, x, y, size, overlap) {
  const out = [`<rect x="${x}" y="${y}" width="${size}" height="${size}" class="d-paper" stroke-width="1.2"/>`];
  const a = [x + size * 0.1, y + size * 0.3, size * 0.35, size * 0.35];
  const b = overlap ? [x + size * 0.18, y + size * 0.36, size * 0.35, size * 0.35] : [x + size * 0.55, y + size * 0.3, size * 0.35, size * 0.35];
  for (const [rx, ry, w, h] of [a, b]) out.push(`<rect x="${rx.toFixed(1)}" y="${ry.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" class="${overlap ? 'd-key-bad' : 'd-face-2'}" stroke-width="1" opacity="0.6"/>`);
  out.push(kit.text(x + size + 8, y + size / 2 + 4, 'UV map', { size: 11 }));
  return out;
}
