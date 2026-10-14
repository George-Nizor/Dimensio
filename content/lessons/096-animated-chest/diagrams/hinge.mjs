// The chest from the side (the right view). The lid's origin, an orange dot, sits on the hinge at
// the back top edge of the body. Turned there, the lid swings up and back clear of the box.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { body, lid, frame, hingeArc, HINGE } from './chestkit.mjs';

export default (kit) => {
  const v = views.right({ at: [230, 196], scale: 190, target: [0, 0, 0.3] });
  const [hx, hy] = v.project(HINGE);
  return kit.svg({ width: 460, height: 290 },
    frame(kit, 14, 14, 432, 262),
    drawMesh(kit, body(), v, { width: 1.4 }),
    drawMesh(kit, lid(-100), v, { mode: 'wire', cls: 'd-guide', width: 1 }),
    drawMesh(kit, lid(0), v, { width: 1.4 }),
    hingeArc(kit, v, 0, -100),
    kit.dot(hx, hy, { r: 6, cls: 'd-mark-fill' }),
    kit.text(hx + 14, hy + 22, 'origin on the hinge', { size: 12 }),
    kit.text(60, 262, 'front', { size: 12 }),
    kit.text(400, 262, 'back', { anchor: 'end', size: 12 }),
  );
};
