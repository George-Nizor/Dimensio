// From the top. Wrong: the wall's origin at its own middle (Origin to Geometry); turned 90 degrees,
// it sticks half out of its cell across the back edge, and the corner is left open. Right: the origin at the
// cell's centre; turned 90 degrees, the wall lands on the cell's left edge and meets the back wall.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { wall, rotate, translate, cell, origin, panel } from './kit.mjs';

export default (kit) => {
  const left = views.top({ scale: 46, at: [125, 128], target: [0, 0, 0] });
  const right = views.top({ scale: 46, at: [375, 128], target: [0, 0, 0] });
  // Turned about its own middle (0, 0.9), the wall ends up across the cell.
  const ownMiddle = translate(rotate(translate(wall(), [0, -0.9, 0]), 'z', 90), [0, 0.9, 0]);
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 222, 196),
    cell(kit, left), drawMesh(kit, wall(), left, { width: 1.3 }),
    drawMesh(kit, ownMiddle, left, { width: 1.3, select: { faces: [0, 1, 2, 3, 4, 5] } }),
    origin(kit, ...left.project([0, 0.9, 0])),
    kit.tag(125, 236, 'origin on the wall', { tone: 'bad' }),
    panel(kit, 264, 14, 222, 196),
    cell(kit, right), drawMesh(kit, wall(), right, { width: 1.3 }),
    drawMesh(kit, rotate(wall(), 'z', 90), right, { width: 1.3, select: { faces: [0, 1, 2, 3, 4, 5] } }),
    origin(kit, ...right.project([0, 0, 0])),
    kit.tag(375, 236, 'origin at the cell centre'),
  );
};
