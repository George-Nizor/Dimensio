// Numpad 0: the view through the camera. The dashed frame is what renders; the darker band around
// it is the passepartout.
import { drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { props, cameraPanel, shot } from './stage.mjs';

export default (kit) => {
  const p = cameraPanel(kit, 20, 46, 330, 200, { frame: 0.78, clip: 'cameras-camera-view' });
  const v = shot(p.frame, [3.4, -5.0, 1.9]);
  const [fx, fy, fw, fh] = p.frame;
  return kit.svg({ width: 500, height: 262 },
    p.svg, p.inside(drawMesh(kit, props(), v, { width: 1.6 })), p.border,
    keycap(kit, 80, 22, 'Numpad 0', { size: 11 }),
    kit.line(fx + fw, fy + 18, 378, fy + 18, { cls: 'd-guide', width: 1.2 }),
    kit.text(384, fy + 22, 'the frame', { size: 12 }),
    kit.line(340, fy + fh + 14, 378, fy + fh + 14, { cls: 'd-guide', width: 1.2 }),
    kit.text(384, fy + fh + 18, 'passepartout', { size: 12 }),
  );
};
