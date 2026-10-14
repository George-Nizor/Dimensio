// Grids moved the way proportional editing moves them. Not a diagram itself. The falloff curves
// follow Blender's: each takes t, 1 at the moved vertex and 0 at the edge of the circle.
import { plane, transform } from '../../../diagrams/mesh.mjs';

export const FALLOFF = {
  smooth: (t) => 3 * t * t - 2 * t * t * t,
  sphere: (t) => Math.sqrt(Math.max(0, 2 * t - t * t)),
  sharp: (t) => t * t,
  linear: (t) => t,
  constant: () => 1,
};

// A grid `size` metres across with `cuts` squares a side, with a vertex at `at` moved `height`
// metres up, pulling the vertices within `radius` with it.
export function bump(m, { at = [0, 0], height = 1, radius = 2, falloff = 'smooth' } = {}) {
  const f = FALLOFF[falloff];
  return transform(m, ([x, y, z]) => {
    const d = Math.hypot(x - at[0], y - at[1]);
    if (radius === 0) return [x, y, d < 1e-6 ? z + height : z];
    return [x, y, d < radius ? z + height * f(1 - d / radius) : z];
  });
}

export const grid = (size = 6, cuts = 12) => plane({ size: [size, size], segments: [cuts, cuts] });

// The circle of influence on the ground, as Blender draws it round the moved vertex.
export function circle(kit, v, at, radius, z = 0) {
  const pts = [...Array(48).keys()].map((i) => v.project([at[0] + Math.cos((i * Math.PI) / 24) * radius, at[1] + Math.sin((i * Math.PI) / 24) * radius, z]));
  return kit.polyline([...pts, pts[0]], { cls: 'd-mark', width: 1.6, dash: '6 5' });
}
