// The exercise's inn sign: a board with the word INN standing out from its front, the letters
// converted to a mesh.
import { box, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { letters } from './letters.mjs';

export default (kit) => {
  const board = box({ size: [1.5, 0.08, 0.62], center: [0, 0.04, 0.31] });
  const raised = letters('INN', { size: 0.4, depth: 0.03 }).map((m) => ({ verts: m.verts.map(([x, y, z]) => [x, y - 0.03, z + 0.11]), faces: m.faces }));
  const v = view({ azimuth: 22, elevation: 14, at: [230, 112], scale: 220, target: [0, 0, 0.31] });
  return kit.svg({ width: 460, height: 220 }, drawMesh(kit, board, v, { width: 1.4 }), raised.map((m) => drawMesh(kit, m, v, { width: 1.4 })));
};
