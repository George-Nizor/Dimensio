// The four faults the lesson finds, each on a 1 m cube: two vertices in one place (a doubled
// corner), a vertex on its own beside the cube, a hole where the front face is missing, and the
// front face turned inwards so its back shows red.
import { view, cube, translate } from '../../../diagrams/mesh.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const box = () => translate(cube(1), [0, 0, 0.5]);
  const cells = [
    ['doubled vertex', (v) => { const [x, y] = v.project([0.5, -0.5, 1]); return [paint(kit, box(), v, { width: 1.4 }), kit.circle(x, y, 7, { cls: 'd-mark', width: 1.6 }), kit.dot(x, y, { r: 3.6, cls: 'd-mark-fill' }), kit.text(x + 8, y - 8, '2', { size: 12 })]; }],
    ['loose vertex', (v) => { const [x, y] = v.project([0.95, 0, 0.9]); return [paint(kit, box(), v, { width: 1.4 }), kit.dot(x, y, { r: 3.6, cls: 'd-mark-fill' })]; }],
    ['hole', (v) => { const m = box(); m.faces = m.faces.filter((f) => !f.every((i) => m.verts[i][1] < -0.49)); return paint(kit, m, v, { width: 1.4, inside: true }); }],
    ['face turned in', (v) => { const m = box(); m.faces = m.faces.map((f) => (f.every((i) => m.verts[i][1] < -0.49) ? [...f].reverse() : f)); return paint(kit, m, v, { width: 1.4, fill: (i, back) => (back ? 'd-key-bad' : null), fillOpacity: 0.75 }); }],
  ];
  return kit.svg({ width: 540, height: 170 }, cells.map(([label, draw], i) => {
    const x = 14 + i * 132;
    const v = view({ azimuth: 30, elevation: 24, at: [x + 56, 76], scale: 56, target: [0, 0, 0.5] });
    return [panel(kit, x, 14, 118, 124, label), draw(v)];
  }));
};
