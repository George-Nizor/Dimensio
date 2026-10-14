// Stacking with Vertex snapping: the bottom corner of the block being moved snaps onto the matching
// top corner of the block below. Both corners are picked out.
import { cube, translate, view, drawMesh, arrow } from '../../../diagrams/mesh.mjs';
import { keyRow } from './parts.mjs';

export default (kit) => {
  const v = view({ azimuth: 32, elevation: 24, at: [200, 156], scale: 62, target: [0, 0, 1] });
  const lower = translate(cube(1), [0, 0, 0.5]);
  const upper = translate(cube(1), [-1.4, -0.6, 1.9]);
  const from = [-1.9, -1.1, 1.4];
  const to = [-0.5, -0.5, 1];
  const [fx, fy] = v.project(from);
  const [tx, ty] = v.project(to);
  return kit.svg({ width: 440, height: 260 },
    drawMesh(kit, lower, v, { width: 1.6 }),
    drawMesh(kit, upper, v, { width: 1.8, cls: 'd-mark' }),
    arrow(kit, v, [-1.8, -1.05, 1.36], [-0.6, -0.55, 1.04]),
    kit.circle(fx, fy, 6, { cls: 'd-mark', width: 2 }), kit.dot(tx, ty, { r: 5, cls: 'd-mark-fill' }), kit.circle(tx, ty, 10, { cls: 'd-mark', width: 1.6 }),
    keyRow(kit, 250, 40, ['G', 'B', '+', 'Ctrl'], { size: 12 }).svg,
    kit.text(250, 76, 'B, then click the corner that lands', { size: 11 }),
  );
};
