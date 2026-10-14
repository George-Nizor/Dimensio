// One 2 m cell from the top, its outline dashed. The floor fills it, the wall runs along its back
// edge, and the origin of both sits at the cell's centre.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { floor, wall, cell, origin, panel } from './kit.mjs';

export default (kit) => {
  const left = views.top({ scale: 70, at: [125, 112], target: [0, 0, 0] });
  const right = views.top({ scale: 70, at: [375, 112], target: [0, 0, 0] });
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 222, 196, 'floor_2m fills the cell'),
    cell(kit, left), drawMesh(kit, floor(), left, { width: 1.4 }), origin(kit, ...left.project([0, 0, 0])),
    panel(kit, 264, 14, 222, 196, 'wall_2m on its back edge'),
    cell(kit, right), drawMesh(kit, wall(), right, { width: 1.4 }), origin(kit, ...right.project([0, 0, 0])),
  );
};
