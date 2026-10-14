// The exercise finished: a doorway outline cut into the wall's front from the bottom edge, and a
// zigzag crack from the top edge to the right side.
import { view } from '../../../diagrams/mesh.mjs';
import { wall, cut, DOOR, CRACK } from './wall.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 22, elevation: 14, at: [250, 118], scale: 74, target: [0, 0, 1.25] });
  return kit.svg({ width: 500, height: 240 },
    paint(kit, wall(), v, { width: 1.6 }),
    cut(kit, v, DOOR),
    cut(kit, v, CRACK),
  );
};
