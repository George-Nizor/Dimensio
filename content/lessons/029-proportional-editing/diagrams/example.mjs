// The exercise finished, on a smaller grid: a smooth hill 3 m high near one corner and a pond 1 m
// deep, made with the Sphere falloff, near the other.
import { view, plane } from '../../../diagrams/mesh.mjs';
import { bump } from './ground.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  let m = plane({ size: [20, 20], segments: [20, 20] });
  m = bump(m, { at: [-5, 5], height: 3, radius: 6, falloff: 'smooth' });
  m = bump(m, { at: [5, -4], height: -1, radius: 3.5, falloff: 'sphere' });
  const v = view({ azimuth: 30, elevation: 26, at: [250, 128], scale: 15, target: [0, 0, 0] });
  return kit.svg({ width: 500, height: 250 }, paint(kit, m, v, { outward: false, width: 0.9 }));
};
