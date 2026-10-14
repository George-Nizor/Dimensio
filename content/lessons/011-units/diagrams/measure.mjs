// The Measure tool: a ruler snapped with Ctrl from the bottom corner to the top corner of a 1 m
// cube, reading 1 m.
import { cube, translate, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const v = view({ at: [170, 150], scale: 110, target: [0, 0, 0.5] });
  const a = v.project([0.5, -0.5, 0]);
  const b = v.project([0.5, -0.5, 1]);
  return kit.svg({ width: 420, height: 260 },
    drawMesh(kit, translate(cube(1), [0, 0, 0.5]), v, { width: 1.6 }),
    kit.line(a[0], a[1], b[0], b[1], { cls: 'd-mark', width: 3 }),
    kit.dot(a[0], a[1], { r: 5, cls: 'd-mark-fill' }), kit.dot(b[0], b[1], { r: 5, cls: 'd-mark-fill' }),
    `<rect x="${a[0] - 58}" y="${(a[1] + b[1]) / 2 - 12}" width="44" height="22" rx="4" class="d-paper" stroke-width="1"/>`,
    kit.text(a[0] - 36, (a[1] + b[1]) / 2 + 4, '1 m', { anchor: 'middle', size: 13 }),
    keycap(kit, 340, 60, 'Ctrl'),
    kit.text(340, 96, 'snaps the ends', { anchor: 'middle', size: 12 }),
    kit.text(340, 112, 'to corners', { anchor: 'middle', size: 12 }),
  );
};
