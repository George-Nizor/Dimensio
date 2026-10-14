// The rippled plane this lesson builds. Not a diagram itself: a 4 m grid with every point moved up by
// 0.2 x sin(3 x X), the field the lesson's nodes compute.
import { plane } from '../../../diagrams/mesh.mjs';

export const height = (x) => 0.2 * Math.sin(3 * x);
export function rippled(segments = 20) {
  const m = plane({ size: [4, 4], segments: [segments, segments] });
  return { verts: m.verts.map(([x, y]) => [x, y, height(x)]), faces: m.faces };
}
