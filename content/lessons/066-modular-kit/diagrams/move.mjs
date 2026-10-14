// From the top: a copy made with Shift+D, X, 2 lands exactly one cell along, and R, Z, 90 turns a
// wall about its origin onto the next edge of the same cell.
import { views, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { wall, rotate, translate, cell, origin, panel } from './kit.mjs';

export default (kit) => {
  const left = views.top({ scale: 44, at: [80, 112], target: [0, 0, 0] });
  const right = views.top({ scale: 60, at: [375, 112], target: [0, 0, 0] });
  return kit.svg({ width: 500, height: 262 },
    panel(kit, 14, 14, 222, 196),
    cell(kit, left, 0, 0), cell(kit, left, 2, 0),
    drawMesh(kit, wall(), left, { width: 1.3 }), drawMesh(kit, translate(wall(), [2, 0, 0]), left, { width: 1.3, select: { faces: [0, 1, 2, 3, 4, 5] } }),
    origin(kit, ...left.project([0, 0, 0])), origin(kit, ...left.project([2, 0, 0])),
    keycap(kit, 64, 236, 'Shift+D', { size: 11 }), keycap(kit, 120, 236, 'X', { size: 11 }), keycap(kit, 150, 236, '2', { size: 11 }),
    panel(kit, 264, 14, 222, 196),
    cell(kit, right),
    drawMesh(kit, wall(), right, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, rotate(wall(), 'z', 90), right, { width: 1.3, select: { faces: [0, 1, 2, 3, 4, 5] } }),
    origin(kit, ...right.project([0, 0, 0])),
    keycap(kit, 335, 236, 'R', { size: 11 }), keycap(kit, 365, 236, 'Z', { size: 11 }), keycap(kit, 403, 236, '90', { size: 11 }),
  );
};
