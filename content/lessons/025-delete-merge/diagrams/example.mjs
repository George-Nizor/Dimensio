// The block before and after cleaning up. Left: a stray loop round its middle, an extra vertex on
// its top back edge, a loose end with its corners doubled, and three loose vertices beside it.
// Right: a plain box with 8 vertices and 6 faces.
import { box, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, cutBox, allEdges } from './helpers.mjs';

export default (kit) => {
  const messy = cutBox({ size: [2, 1, 1], center: [0, 0, 0.5], cuts: { x: [0.25] } });
  const loop = allEdges(messy).filter(([a, b]) => Math.abs(messy.verts[a][0] - 0.25) < 1e-6 && Math.abs(messy.verts[b][0] - 0.25) < 1e-6);
  const left = view({ at: [130, 112], scale: 44, target: [0, 0, 0.5] });
  const right = view({ at: [384, 112], scale: 52, target: [0, 0, 0.5] });
  const extra = left.project([0.625, 0.5, 1]);
  const ends = [[-1, -0.5, 0], [-1, 0.5, 0], [-1, -0.5, 1], [-1, 0.5, 1]].map((p) => left.project(p));
  const loose = [[-1.6, -0.9, 0.4], [-1.5, -1.1, 1.3], [1.7, 0.8, 0.2]].map((p) => left.project(p));
  return kit.svg({ width: 510, height: 240 },
    panel(kit, 14, 14, 224, 190, 'Faces 10, Vertices 20'),
    drawMesh(kit, messy, left, { width: 1.4, select: { edges: loop } }),
    kit.circle(extra[0], extra[1], 6, { cls: 'd-bad', width: 1.6 }), kit.dot(extra[0], extra[1], { r: 2.6 }),
    ends.map(([x, y]) => [kit.circle(x, y, 6, { cls: 'd-bad', width: 1.6 }), kit.dot(x - 2, y, { r: 2.2 }), kit.dot(x + 2, y, { r: 2.2 })]),
    loose.map(([x, y]) => [kit.circle(x, y, 6, { cls: 'd-bad', width: 1.6 }), kit.dot(x, y, { r: 2.6 })]),
    panel(kit, 272, 14, 224, 190, 'Faces 6, Vertices 8'),
    drawMesh(kit, box({ size: [2, 1, 1], center: [0, 0, 0.5] }), right, { width: 1.4 }),
  );
};
