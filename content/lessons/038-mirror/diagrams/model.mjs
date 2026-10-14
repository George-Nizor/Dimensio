// Making the shield's point: the bottom corner of the right half moves to the middle line, and the
// mirrored half follows.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { halfBoard, halfShield, mirrored } from './shapes.mjs';
import { panel, pageArrow } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const before = halfBoard();
  const after = halfShield();
  const v1 = views.front({ at: [130, 112], scale: 120 });
  const v2 = views.front({ at: [380, 112], scale: 120 });
  const corner = before.verts.findIndex((p) => p[0] > 0.4 && p[2] < -0.5 && p[1] < 0);
  const [cx, cy] = v1.project(before.verts[corner]);
  return kit.svg({ width: 510, height: 240 },
    panel(kit, 14, 14, 232, 196, 'move the corner'),
    drawMesh(kit, mirrored(before), v1, { mode: 'wire', width: 1.2, cls: 'd-guide' }),
    drawMesh(kit, before, v1, { width: 1.6, select: { verts: [corner] } }),
    pageArrow(kit, cx - 6, cy, 136, cy),
    panel(kit, 264, 14, 232, 196, 'both halves follow'),
    drawMesh(kit, mirrored(after), v2, { width: 1.6 }),
    drawMesh(kit, after, v2, { width: 1.6 }),
  );
};
