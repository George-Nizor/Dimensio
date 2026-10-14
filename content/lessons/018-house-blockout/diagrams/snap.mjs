// One back corner from above (Numpad 7). The side wall is being moved with G and Ctrl held: its
// nearest corner snaps onto the back wall's corner, marked with a circle.
import { views, drawMesh, box, keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const v = views.top({ at: [300, 46], scale: 60, target: [2.5, 2.0, 0] });
  const back = box({ size: [5, 0.2, 2.5], center: [0, 1.9, 1.45] });
  const sideFrom = box({ size: [0.2, 3.6, 2.5], center: [2.95, -0.55, 1.45] });
  const sideTo = box({ size: [0.2, 3.6, 2.5], center: [2.4, 0, 1.45] });
  const from = v.project([3.05, 1.25, 2.7]);
  const to = v.project([2.5, 1.8, 2.7]);
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  return kit.svg({ width: 400, height: 290 },
    drawMesh(kit, back, v, { width: 1.4 }),
    drawMesh(kit, sideTo, v, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, sideFrom, v, { width: 1.4, select: { faces: sideFrom.faces.map((_, i) => i) } }),
    kit.line(from[0], from[1], to[0] + 8, to[1] + 8, { cls: 'd-mark', width: 2 }), kit.arrowhead(to[0] + 8, to[1] + 8, angle, { size: 8 }),
    kit.circle(to[0], to[1], 8, { cls: 'd-mark', width: 2 }),
    keycap(kit, 40, 150, 'G', { size: 12 }), kit.text(62, 155, '+', { anchor: 'middle', size: 13 }), keycap(kit, 92, 150, 'Ctrl', { size: 12 }),
    kit.text(30, 196, 'Snap Target: Vertex', { size: 12 }),
  );
};
