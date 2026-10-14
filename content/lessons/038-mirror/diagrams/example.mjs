// The shield from the front. The right half is the mesh you model; the Mirror modifier draws the
// left half, flipped across the middle line through the origin.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { halfShield, mirrored } from './shapes.mjs';

export default (kit) => {
  const v = views.front({ at: [250, 120], scale: 150 });
  const half = halfShield();
  return kit.svg({ width: 500, height: 250 },
    drawMesh(kit, mirrored(half), v, { mode: 'wire', width: 1.4, cls: 'd-guide' }),
    drawMesh(kit, half, v, { width: 1.8, select: { faces: [0, 1] } }),
    kit.line(250, 18, 250, 222, { cls: 'd-mark', width: 1.4, dash: '6 5' }),
    kit.dot(250, 120, { r: 4, cls: 'd-mark-fill' }),
    kit.text(330, 236, 'the half you model', { anchor: 'middle', size: 12 }),
    kit.text(170, 236, 'the half Mirror adds', { anchor: 'middle', size: 12 }),
  );
};
