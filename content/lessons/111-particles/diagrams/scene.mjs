// The tree, ground and leaves this lesson's diagrams draw. Not a diagram itself. The tree is a
// 2.4 m trunk with a round canopy 2.4 m across; leaves are drawn as small shapes at points
// worked out from a fall with a sideways push, not simulated.
import { cylinder, uvSphere, plane, join } from '../../../diagrams/mesh.mjs';
import { random } from '../../../diagrams/lib.mjs';

export const tree = () => join(
  cylinder({ vertices: 8, radius: 0.15, depth: 2.4, center: [0, 0, 1.2] }),
  uvSphere({ segments: 12, rings: 8, radius: 1.2, center: [0, 0, 3.2] }),
);
export const ground = (size = 8) => plane({ size: [size, size] });

// Leaves part way down: each starts on the canopy and drifts `drift` metres along X for every
// metre it falls. Returns [x, y, z, turn] in metres and degrees.
export function falling(count, { seed = 4, drift = 0.8, landed = 0.4 } = {}) {
  const next = random(seed);
  return Array.from({ length: count }, () => {
    const a = next() * Math.PI * 2;
    const r = 0.6 + next() * 0.6;
    const start = [Math.cos(a) * r, Math.sin(a) * r * 0.6, 2.6 + next() * 1.2];
    const onGround = next() < landed;
    const fall = onGround ? start[2] : next() * (start[2] - 0.3);
    return [start[0] + fall * drift, start[1], start[2] - fall + (onGround ? 0.02 : 0), next() * 360, onGround];
  });
}
