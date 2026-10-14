// The finished block-out on its plot: a floor, four walls with a doorway at the front, a roof with
// two slopes, and the 1.8 m figure on the path in front.
import { view } from '../../../diagrams/mesh.mjs';
import { plot, path, figure, floor, backWall, sideWalls, frontWall, roofTop, drawParts } from './shapes.mjs';

export default (kit) => {
  const v = view({ azimuth: 32, elevation: 22, at: [250, 168], scale: 30, target: [0, -1, 1.6] });
  return kit.svg({ width: 500, height: 300 },
    drawParts(kit, v, [floor(), backWall(), ...sideWalls(), ...frontWall(), figure()], { under: [plot(), path()] }),
    drawParts(kit, v, [roofTop()]),
  );
};
