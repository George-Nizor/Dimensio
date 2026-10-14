// The default cube in Edit Mode with one vertex, one edge and one face picked out and named.
import { cube, view, drawMesh, facesWhere, vertsWhere, edgesWhere } from '../../../diagrams/mesh.mjs';
import { vertexDots, callout } from './helpers.mjs';

export default (kit) => {
  const m = cube();
  const v = view({ at: [200, 140], scale: 62 });
  const face = facesWhere(m, (c, n) => n[0] > 0.9);
  const vert = vertsWhere(m, (p) => p[0] < -0.9 && p[1] < -0.9 && p[2] > 0.9);
  const edge = edgesWhere(m, (a, b) => a[1] > 0.9 && b[1] > 0.9 && a[2] > 0.9 && b[2] > 0.9);
  const at = (p) => v.project(p);
  const fv = at([1, 0, 0]);
  const vv = at([-1, -1, 1]);
  const ev = at([0, 1, 1]);
  return kit.svg({ width: 420, height: 280 },
    drawMesh(kit, m, v, { width: 1.6, select: { faces: face, edges: edge, verts: vert } }),
    vertexDots(kit, m, v, { skip: vert }),
    drawMesh(kit, m, v, { width: 1.6, select: { verts: vert } }).slice(-1),
    callout(kit, vv[0] - 60, vv[1] - 30, vv[0], vv[1], 'vertex', { anchor: 'end' }),
    callout(kit, ev[0] + 50, ev[1] - 36, ev[0], ev[1], 'edge'),
    callout(kit, fv[0] + 70, fv[1] + 30, fv[0], fv[1], 'face'),
  );
};
