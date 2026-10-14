// The exercise finished in Godot: three 0.5 m crates standing on the ground grid of 1 m squares,
// 1 m apart.
import { view } from '../../../diagrams/mesh.mjs';
import { grid, drawCrate } from './godot.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 28, at: [250, 128], scale: 80, target: [0, 0, 0.2] });
  return kit.svg({ width: 500, height: 240 }, grid(kit, v, 4), [-1, 0, 1].map((x) => drawCrate(kit, v, x)));
};
