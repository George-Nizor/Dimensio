// Three selections made in one or two clicks: an edge loop round the Pipe, a band of faces round
// it, and a path of faces across the Floor's grid.
import { view, views, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';
import { pipe, loopAt, bandAt, floor, staircase } from './shapes.mjs';

export default (kit) => {
  const t = pipe();
  const a = view({ at: [90, 100], scale: 54, target: [0, 0, 1] });
  const b = view({ at: [262, 100], scale: 54, target: [0, 0, 1] });
  const c = views.top({ at: [434, 100], scale: 64 });
  return kit.svg({ width: 524, height: 220 },
    panel(kit, 10, 14, 160, 172, 'edge loop'),
    drawMesh(kit, t, a, { width: 1.1, select: { edges: loopAt(t, 3) } }),
    panel(kit, 182, 14, 160, 172, 'face loop'),
    drawMesh(kit, t, b, { width: 1.1, select: { faces: bandAt(3) } }),
    panel(kit, 354, 14, 160, 172, 'path'),
    drawMesh(kit, floor(), c, { width: 0.9, select: { faces: staircase() } }),
  );
};
