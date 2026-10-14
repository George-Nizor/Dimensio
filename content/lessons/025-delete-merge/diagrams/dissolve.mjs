// Left, a box with an edge loop round its middle selected. Right, after Ctrl+X: the loop is gone
// and each side is one face again, with no hole.
import { box, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { panel, cutBox, allEdges } from './helpers.mjs';

export default (kit) => {
  const m = cutBox({ size: [2, 1, 1], cuts: { x: [0] } });
  const loop = allEdges(m).filter(([a, b]) => Math.abs(m.verts[a][0]) < 1e-6 && Math.abs(m.verts[b][0]) < 1e-6);
  const left = view({ at: [126, 104], scale: 56 });
  const right = view({ at: [414, 104], scale: 56 });
  return kit.svg({ width: 540, height: 230 },
    panel(kit, 14, 14, 224, 180, 'loop selected'),
    drawMesh(kit, m, left, { width: 1.5, select: { edges: loop } }),
    keycap(kit, 270, 104, 'Ctrl+X', { size: 11 }),
    panel(kit, 302, 14, 224, 180, 'dissolved'),
    drawMesh(kit, box({ size: [2, 1, 1] }), right, { width: 1.5 }),
  );
};
