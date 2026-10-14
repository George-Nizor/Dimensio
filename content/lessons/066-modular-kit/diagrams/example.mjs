// The four pieces of the exercise's kit, each standing in its own 2 m cell with its origin at the
// cell's centre on the ground: floor_2m, wall_2m, wall_corner and wall_door.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { floor, wall, corner, door, translate, cell, origin } from './kit.mjs';

export default (kit) => {
  const pieces = [[floor(), 'floor_2m'], [wall(), 'wall_2m'], [corner(), 'wall_corner'], [door(), 'wall_door']];
  const v = view({ azimuth: 25, elevation: 28, scale: 40, at: [280, 118], target: [4.8, 0, 1] });
  return kit.svg({ width: 560, height: 230 },
    pieces.map(([m, name], i) => {
      const x = i * 3.2;
      const [ox, oy] = v.project([x, 0, 0]);
      return [cell(kit, v, x, 0), drawMesh(kit, translate(m, [x, 0, 0]), v, { width: 1.2 }), origin(kit, ox, oy), kit.text(ox, 214, name, { size: 12, anchor: 'middle' })];
    }),
  );
};
