// The three select modes over their keys: 1 selects vertices, 2 edges and 3 faces.
import { cube, view, drawMesh, keycap, facesWhere, vertsWhere, edgesWhere } from '../../../diagrams/mesh.mjs';
import { vertexDots } from './helpers.mjs';

export default (kit) => {
  const m = cube();
  const vs = [0, 1, 2].map((i) => view({ at: [90 + i * 170, 92], scale: 36 }));
  const vert = vertsWhere(m, (p) => p[0] > 0.9 && p[1] < -0.9 && p[2] > 0.9);
  const edge = edgesWhere(m, (a, b) => a[1] < -0.9 && b[1] < -0.9 && a[2] > 0.9 && b[2] > 0.9);
  const face = facesWhere(m, (c, n) => n[2] > 0.9);
  return kit.svg({ width: 520, height: 210 },
    drawMesh(kit, m, vs[0], { width: 1.5 }), vertexDots(kit, m, vs[0], { skip: vert }), drawMesh(kit, m, vs[0], { width: 2, select: { verts: vert } }).slice(-1),
    drawMesh(kit, m, vs[1], { width: 1.5, select: { edges: edge } }),
    drawMesh(kit, m, vs[2], { width: 1.5, select: { faces: face } }),
    [['1', 'vertices'], ['2', 'edges'], ['3', 'faces']].map(([key, name], i) => [
      keycap(kit, 90 + i * 170, 170, key),
      kit.text(90 + i * 170, 202, name, { anchor: 'middle', size: 12 }),
    ]),
  );
};
