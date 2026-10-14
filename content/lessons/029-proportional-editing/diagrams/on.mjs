// The same move twice: one vertex of a grid lifted 1.5 m. Left, proportional editing off: a spike.
// Right, on, with the Smooth falloff and a 2 m circle: a smooth hill.
import { view } from '../../../diagrams/mesh.mjs';
import { grid, bump } from './ground.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 24, at: [124, 112], scale: 23, target: [0, 0, 0.4] });
  const right = view({ azimuth: 30, elevation: 24, at: [376, 112], scale: 23, target: [0, 0, 0.4] });
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 180, 'off: a spike'),
    paint(kit, bump(grid(), { height: 1.5, radius: 0 }), left, { outward: false, width: 1 }),
    panel(kit, 266, 14, 220, 180, 'on: a hill'),
    paint(kit, bump(grid(), { height: 1.5, radius: 2 }), right, { outward: false, width: 1 }),
  );
};
