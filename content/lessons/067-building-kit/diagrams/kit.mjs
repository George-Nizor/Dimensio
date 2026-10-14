// The building kit's pieces on a 2 m grid, for this lesson's diagrams. Not a diagram itself. Each
// origin is at the centre of the piece's 2 by 2 m cell, on the cell's floor.
import { box, join, rotate, translate } from '../../../diagrams/mesh.mjs';

const slab = (x0, y0, z0, x1, y1, z1) => box({ size: [x1 - x0, y1 - y0, z1 - z0], center: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2] });

export const floor = () => slab(-1, -1, 0, 1, 1, 0.1);
export const wall = () => slab(-1, 0.8, 0, 1, 1, 2.5);
export const corner = () => join(wall(), slab(-1, -1, 0, -0.8, 0.8, 2.5));
export const door = () => join(slab(-1, 0.8, 0, -0.5, 1, 2.5), slab(0.5, 0.8, 0, 1, 1, 2.5), slab(-0.5, 0.8, 2.1, 0.5, 1, 2.5));
export const windowWall = () => join(slab(-1, 0.8, 0, -0.5, 1, 2.5), slab(0.5, 0.8, 0, 1, 1, 2.5), slab(-0.5, 0.8, 0, 0.5, 1, 1), slab(-0.5, 0.8, 2, 0.5, 1, 2.5));
export const roof = () => slab(-1, -1, 0, 1, 1, 0.2);

// Places a piece in the cell at column cx, row cy and floor level fz, turned by deg about Z.
export const place = (m, cx, cy, fz = 0, deg = 0) => translate(rotate(m, 'z', deg), [cx * 2, cy * 2, fz * 2.5]);

export { join };

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
