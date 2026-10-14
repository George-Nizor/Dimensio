// The Floor's grid. Left, one corner face selected. Right, after Ctrl+click on the opposite corner:
// a path of faces between them.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';
import { floor, face, staircase } from './shapes.mjs';

export default (kit) => {
  const m = floor();
  const left = views.top({ at: [126, 104], scale: 70 });
  const right = views.top({ at: [384, 104], scale: 70 });
  const end = right.project([0.875, 0.875, 0]);
  return kit.svg({ width: 510, height: 220 },
    panel(kit, 14, 14, 224, 180, 'click'),
    drawMesh(kit, m, left, { width: 1, select: { faces: [face(0, 0)] } }),
    panel(kit, 272, 14, 224, 180, 'then Ctrl + click'),
    drawMesh(kit, m, right, { width: 1, select: { faces: staircase() } }),
    kit.circle(end[0], end[1], 11, { cls: 'd-mark', width: 1.6 }),
  );
};
