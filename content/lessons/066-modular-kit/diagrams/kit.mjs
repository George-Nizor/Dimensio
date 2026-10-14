// The kit's pieces on a 2 m grid, for this lesson's diagrams. Not a diagram itself. Every piece's
// origin is at the centre of its 2 by 2 m cell, on the ground; a wall runs along the cell's back
// edge, the +Y side.
import { box, join, rotate, translate } from '../../../diagrams/mesh.mjs';

const slab = (x0, y0, z0, x1, y1, z1) => box({ size: [x1 - x0, y1 - y0, z1 - z0], center: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2] });

export const floor = () => slab(-1, -1, 0, 1, 1, 0.1);
export const wall = () => slab(-1, 0.8, 0, 1, 1, 2.5);
export const corner = () => join(wall(), slab(-1, -1, 0, -0.8, 0.8, 2.5));
export const door = () => join(slab(-1, 0.8, 0, -0.5, 1, 2.5), slab(0.5, 0.8, 0, 1, 1, 2.5), slab(-0.5, 0.8, 2.1, 0.5, 1, 2.5));

export { rotate, translate };

// The outline of one 2 m cell on the ground, dashed, around (cx, cy).
export function cell(kit, v, cx = 0, cy = 0, { cls = 'd-guide' } = {}) {
  const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]].map(([x, y]) => v.project([cx + x, cy + y, 0]));
  return kit.polyline(pts, { cls, width: 1.2, dash: '5 4' });
}

// An object's origin: the small dot Blender draws, in the selection colour.
export const origin = (kit, x, y) => [kit.dot(x, y, { r: 4.5, cls: 'd-mark-fill' }), kit.circle(x, y, 4.5, { cls: 'd-ink', width: 1.1 })];

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
