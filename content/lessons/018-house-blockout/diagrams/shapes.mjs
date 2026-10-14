// The house block-out and its plot, built to the lesson's sizes, shared by this lesson's diagrams.
// Not a diagram itself.
import { box, plane, rotate, translate, join, drawMesh, mesh, orientOutward } from '../../../diagrams/mesh.mjs';

export const plot = () => plane({ size: [6, 6] });
export const path = () => translate(plane({ size: [1, 3] }), [0, -4.5, 0]);
export const figure = (x = 1.2, y = -4.2) => join(
  box({ size: [0.44, 0.24, 1.55], center: [x, y, 0.775] }),
  box({ size: [0.24, 0.24, 0.25], center: [x, y, 1.675] }),
);
export const floor = () => box({ size: [5, 4, 0.2], center: [0, 0, 0.1] });
export const backWall = () => box({ size: [5, 0.2, 2.5], center: [0, 1.9, 1.45] });
export const sideWalls = () => [box({ size: [0.2, 3.6, 2.5], center: [-2.4, 0, 1.45] }), box({ size: [0.2, 3.6, 2.5], center: [2.4, 0, 1.45] })];
export const frontWall = () => [
  box({ size: [2.05, 0.2, 2.5], center: [-1.475, -1.9, 1.45] }),
  box({ size: [2.05, 0.2, 2.5], center: [1.475, -1.9, 1.45] }),
  box({ size: [0.9, 0.2, 0.4], center: [0, -1.9, 2.5] }),
];
export const roof = () => translate(rotate(box({ size: [4.8, 3.1, 3.1] }), 'x', 45), [0, 0, 2.7]);

// The part of the roof box above the walls: the top half of the turned box, a prism with two 45
// degree slopes. Its ridge is half the box's diagonal, 2.19 m, above the top of the walls.
export function roofTop() {
  const h = (3.1 * Math.SQRT2) / 2;
  const verts = [];
  for (const x of [-2.4, 2.4]) verts.push([x, -h, 2.7], [x, h, 2.7], [x, 0, 2.7 + h]);
  return orientOutward(mesh(verts, [[0, 3, 5, 2], [1, 2, 5, 4], [0, 1, 2], [3, 5, 4], [0, 1, 4, 3]]));
}

// Draws boxes one after another, farthest first, so separate parts hide each other properly.
// Flat ground pieces in `under` always go first.
export function drawParts(kit, v, parts, { under = [], width = 1.3, mode = 'solid' } = {}) {
  const mid = (m) => m.verts.reduce((s, p) => [s[0] + p[0], s[1] + p[1], s[2] + p[2]], [0, 0, 0]).map((c) => c / m.verts.length);
  const sorted = [...parts].sort((a, b) => v.depth(mid(a.mesh || a)) - v.depth(mid(b.mesh || b)));
  return [
    ...under.map((m) => drawMesh(kit, m, v, { width, mode })),
    ...sorted.map((p) => drawMesh(kit, p.mesh || p, v, { width, mode, ...(p.opts || {}) })),
  ];
}
