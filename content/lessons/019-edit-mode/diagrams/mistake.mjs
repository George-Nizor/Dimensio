// Wrong: in Object Mode, G moves the whole cube (its old place dashed). Right: in Edit Mode, G moves
// only the selected top face, here 1 m up.
import { cube, view, drawMesh, facesWhere, arrow } from '../../../diagrams/mesh.mjs';
import { panel, moveVerts, vertsOfFaces } from './helpers.mjs';

export default (kit) => {
  const m = cube();
  const top = facesWhere(m, (c, n) => n[2] > 0.9);
  const left = view({ at: [120, 120], scale: 30, target: [0, 0, 0.5] });
  const right = view({ at: [384, 120], scale: 30, target: [0, 0, 0.5] });
  return kit.svg({ width: 510, height: 250 },
    panel(kit, 14, 14, 224, 190),
    kit.text(24, 34, 'Object Mode', { size: 11, cls: 'd-tag d-tag-bad' }),
    drawMesh(kit, m, left, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, moveVerts(m, m.verts.map((_, i) => i), [0, 0, 1.2]), left, { width: 1.5 }),
    arrow(kit, left, [0, 0, 1], [0, 0, 2.1]),
    kit.tag(126, 232, 'the whole cube moves', { tone: 'bad' }),
    panel(kit, 272, 14, 224, 190),
    kit.text(282, 34, 'Edit Mode', { size: 11, cls: 'd-tag' }),
    drawMesh(kit, moveVerts(m, vertsOfFaces(m, top), [0, 0, 1.2]), right, { width: 1.5, select: { faces: top } }),
    kit.tag(384, 232, 'only the face moves'),
  );
};
