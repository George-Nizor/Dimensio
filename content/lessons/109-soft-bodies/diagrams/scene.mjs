// The jelly cube and plate this lesson's diagrams draw, as real meshes. Not a diagram itself.
// The cube is 0.8 m across, cut 4 times along each edge; the plate is a 1 m disc on the ground.
import { box, cylinder, transform } from '../../../diagrams/mesh.mjs';

export const plate = () => cylinder({ vertices: 24, radius: 1, depth: 0.02, center: [0, 0, 0.01] });

// The cube resting at height z, squashed by `squash` (1 is its own shape) and bulging at the
// sides as much as it is squashed, so its volume looks the same.
export function jelly({ z = 0.42, squash = 1, cuts = 4, sag = 0 } = {}) {
  const n = cuts + 1;
  return transform(box({ size: [0.8, 0.8, 0.8], segments: [n, n, n] }), ([x, y, h]) => {
    const t = (h + 0.4) / 0.8;
    const bulge = 1 + (1 - squash) * 1.4 * Math.sin(Math.PI * t) + sag * (1 - t);
    return [x * bulge, y * bulge, z - 0.4 + t * 0.8 * squash];
  });
}

// What the default Edges settings leave: a slumped puddle 0.1 m high, wider than the plate.
export const puddle = () => transform(box({ size: [0.8, 0.8, 0.8], segments: [5, 5, 5] }), ([x, y, h]) => {
  const t = (h + 0.4) / 0.8;
  return [x * (1.55 - 0.3 * t), y * (1.55 - 0.3 * t), 0.03 + t * 0.09 + 0.02 * Math.sin(x * 9) * t];
});
