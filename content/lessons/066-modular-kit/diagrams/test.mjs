// A small room laid out from the kit, from the top: four floors, walls on the outer edges, corner
// pieces in the corners and the doorway at the front, with no gaps.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { floor, wall, corner, door, rotate, translate } from './kit.mjs';

export default (kit) => {
  const v = views.top({ scale: 44, at: [250, 104], target: [0, 0, 0] });
  const place = (m, x, y, deg) => translate(rotate(m, 'z', deg), [x, y, 0]);
  const parts = [
    place(floor(), -1, -1, 0), place(floor(), 1, -1, 0), place(floor(), -1, 1, 0), place(floor(), 1, 1, 0),
    place(corner(), -1, 1, 0), place(corner(), 1, 1, -90), place(corner(), 1, -1, 180), place(door(), -1, -1, 180),
    place(wall(), -1, -1, 90),
  ];
  return kit.svg({ width: 500, height: 234 },
    parts.map((m) => drawMesh(kit, m, v, { width: 1.2 })),
    kit.text(250, 222, 'four floors, three corners, a wall and the doorway', { size: 12, anchor: 'middle' }),
  );
};
