// The exercise's wall and the cuts made into it. Not a diagram itself. The wall is 3 m wide, 0.2 m
// thick and 2.5 m tall, standing on the ground; its front faces -Y. Cuts are lists of points on a
// face, drawn as the edges the knife makes.
import { box } from '../../../diagrams/mesh.mjs';

export const wall = () => box({ size: [3, 0.2, 2.5], center: [0, 0, 1.25] });
export const front = (x, z) => [x, -0.1, z];
export const back = (x, z) => [x, 0.1, z];

export const DOOR = [[-0.5, 0], [-0.5, 2], [0.5, 2], [0.5, 0]];
export const CRACK = [[0.9, 2.5], [1.04, 2.18], [0.94, 1.9], [1.18, 1.62], [1.5, 1.46]];
export const WINDOW = [[0.4, 1.1], [1.1, 1.1], [1.1, 1.8], [0.4, 1.8]];

// Draws a cut through the given points on one face of the wall.
export function cut(kit, v, points, { side = front, cls = 'd-ink', width = 1.8, dash, closed = false } = {}) {
  const pts = points.map(([x, z]) => v.project(side(x, z)));
  if (closed) pts.push(pts[0]);
  return kit.polyline(pts, { cls, width, dash });
}

export function clicks(kit, v, points, { side = front, r = 3.6 } = {}) {
  return points.map(([x, z]) => { const [px, py] = v.project(side(x, z)); return kit.dot(px, py, { r, cls: 'd-mark-fill' }); });
}
