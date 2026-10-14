// Render Properties > Sampling, and what samples do to an edge: at 1 sample each pixel is either
// in or out, so the edge steps; at 64 the pixels along the edge blend.
import { propRow } from './stage.mjs';

const N = 8;
const coverage = (i, j) => {
  // How much of pixel (i, j) lies under the line y = 0.55 x + 1.4, in pixel units.
  let inside = 0;
  for (let a = 0; a < 4; a += 1) for (let b = 0; b < 4; b += 1) if (j + (b + 0.5) / 4 > 0.55 * (i + (a + 0.5) / 4) + 1.4) inside += 1;
  return inside / 16;
};

function pixels(kit, x, y, size, blended) {
  const out = [];
  for (let i = 0; i < N; i += 1) {
    for (let j = 0; j < N; j += 1) {
      const c = coverage(i, j);
      const amount = blended ? Math.round(c * 4) / 4 : c >= 0.5 ? 1 : 0;
      if (amount > 0) out.push(`<rect x="${x + i * size}" y="${y + (N - 1 - j) * size}" width="${size}" height="${size}" class="d-mark-fill" opacity="${amount}"/>`);
    }
  }
  out.push(kit.path(`M ${x} ${y} h ${N * size} v ${N * size} h ${-N * size} Z`, { cls: 'd-guide', width: 1.2 }));
  return out;
}

export default (kit) => kit.svg({ width: 500, height: 210 },
  `<rect x="14" y="14" width="200" height="150" rx="5" class="d-paper" stroke-width="1.2"/>`,
  kit.text(26, 36, 'Sampling', { size: 12 }),
  kit.text(30, 62, 'Viewport', { size: 11, cls: 'd-label' }),
  propRow(kit, 26, 70, 'Samples', '16', { width: 176, split: 0.5 }),
  kit.text(30, 114, 'Render', { size: 11, cls: 'd-label' }),
  propRow(kit, 26, 122, 'Samples', '64', { width: 176, split: 0.5, mark: true }),
  pixels(kit, 240, 20, 15, false), kit.text(300, 160, '1 sample', { anchor: 'middle', size: 12 }),
  pixels(kit, 372, 20, 15, true), kit.text(432, 160, '64 samples', { anchor: 'middle', size: 12 }),
  kit.text(366, 196, 'the same edge, close up', { anchor: 'middle', size: 12, cls: 'd-label' }),
);
