// The 3D cursor, a red and white ring with cross hairs, placed on the grid beside a cube with
// Shift and a right click. A new object appears there.
import { cube, view, drawMesh, translate, mouse, keycap } from '../../../diagrams/mesh.mjs';
import { cursor3d } from './parts.mjs';

export default (kit) => {
  const v = view({ at: [140, 170], scale: 44, target: [1, 0, 0] });
  const [cx, cy] = v.project([2.6, -0.4, 0]);
  return kit.svg({ width: 440, height: 250 },
    kit.ellipse(cx, cy, 34, 12, { cls: 'd-guide', width: 1, dash: '4 5' }),
    drawMesh(kit, translate(cube(2), [0, 0, 1]), v, { width: 1.6 }),
    cursor3d(kit, cx, cy, { r: 13 }),
    kit.text(cx, cy + 40, '3D cursor', { anchor: 'middle', size: 12 }),
    keycap(kit, 330, 60, 'Shift'), kit.text(360, 65, '+', { size: 13 }),
    mouse(kit, 390, 70, { button: 'right', size: 0.6, label: 'click' }),
  );
};
