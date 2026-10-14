// The exercise finished in Godot: the barrel standing on the grid of 1 m squares beside the three
// 0.5 m crates from lesson 35.
import { view, translate } from '../../../diagrams/mesh.mjs';
import { grid, drawCrate } from './godot.mjs';
import { barrel } from './barrel.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 26, at: [250, 142], scale: 70, target: [0.4, 0, 0.3] });
  return kit.svg({ width: 500, height: 250 },
    grid(kit, v, 4),
    [-1, 0, 1].map((x) => drawCrate(kit, v, x, -0.6)),
    paint(kit, translate(barrel('done'), [0.4, 1, 0]), v, { outward: false, width: 1, smooth: () => true, sharp: 40, edges: 'shape', light: [-0.9, -0.3, 0.3] }),
  );
};
