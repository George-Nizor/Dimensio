// Composition Guides > Thirds: two lines each way divide the frame in thirds. The lantern sits where
// two of them cross.
import { drawMesh } from '../../../diagrams/mesh.mjs';
import { props, cameraPanel, shot } from './stage.mjs';

export default (kit) => {
  const p = cameraPanel(kit, 40, 14, 400, 236, { frame: 0.86, clip: 'cameras-thirds' });
  const [fx, fy, fw, fh] = p.frame;
  // The lantern lands where the left and upper thirds cross.
  const v = shot(p.frame, [2.9, -4.4, 1.7], { lens: 50, target: [-0.55, 0.2, 0.85], at: [fx + fw / 3, fy + fh / 3] });
  const lines = [1, 2].flatMap((k) => [
    kit.line(fx + (fw * k) / 3, fy, fx + (fw * k) / 3, fy + fh, { cls: 'd-guide', width: 1.2 }),
    kit.line(fx, fy + (fh * k) / 3, fx + fw, fy + (fh * k) / 3, { cls: 'd-guide', width: 1.2 }),
  ]);
  return kit.svg({ width: 480, height: 264 },
    p.svg, p.inside(drawMesh(kit, props(), v, { width: 1.6 }), lines), p.border,
    kit.circle(fx + fw / 3, fy + fh / 3, 26, { cls: 'd-mark', width: 2 }),
  );
};
