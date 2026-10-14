// Shapes shared by this lesson's diagrams. Not a diagram itself.
import { box, join } from '../../../diagrams/mesh.mjs';

// A box from its lowest corner to its highest, in metres.
const slab = (x0, y0, z0, x1, y1, z1) => box({ size: [x1 - x0, y1 - y0, z1 - z0], center: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2] });

// The exercise's table: a 1.4 by 0.8 m top whose upper face is 0.75 m up, on four 7 cm legs.
export const tableTop = () => slab(-0.7, -0.4, 0.69, 0.7, 0.4, 0.75);
export const tableLeg = (sx = 1, sy = 1) => slab(sx * 0.62 - 0.035, sy * 0.32 - 0.035, 0, sx * 0.62 + 0.035, sy * 0.32 + 0.035, 0.69);
export const table = () => join(tableTop(), tableLeg(1, 1), tableLeg(-1, 1), tableLeg(1, -1), tableLeg(-1, -1));

// The chair: a 0.45 m seat 0.45 m up, four legs, two back posts up to 0.9 m and two rails. Its
// open front faces -Y; the back is on the +Y side.
export function chair() {
  const parts = [slab(-0.225, -0.225, 0.40, 0.225, 0.225, 0.45)];
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const x = sx * 0.19;
      const y = sy * 0.19;
      parts.push(slab(x - 0.025, y - 0.025, 0, x + 0.025, y + 0.025, 0.40));
    }
    parts.push(slab(sx * 0.19 - 0.025, 0.165, 0.45, sx * 0.19 + 0.025, 0.215, 0.9));
  }
  parts.push(slab(-0.165, 0.17, 0.78, 0.165, 0.21, 0.86));
  parts.push(slab(-0.165, 0.17, 0.58, 0.165, 0.21, 0.64));
  return join(...parts);
}

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// A checkbox with its label, ticked or not, for the export dialog schematic.
export function checkbox(kit, x, y, label, { on = false, mark = false } = {}) {
  return [
    `<rect x="${x}" y="${y - 10}" width="12" height="12" rx="2" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`,
    on ? kit.path(`M ${x + 2.5} ${y - 4} L ${x + 5} ${y - 1.5} L ${x + 9.5} ${y - 7}`, { cls: 'd-paper', width: 1.8 }) : '',
    kit.text(x + 20, y, label, { size: 12, cls: mark ? 'd-tag' : 'd-label' }),
  ];
}
