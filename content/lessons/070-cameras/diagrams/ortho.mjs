// The front view through a perspective camera and an orthographic one. In orthographic the far
// barrel is not smaller and the sides do not show. Orthographic Scale is how much fits across.
import { drawMesh } from '../../../diagrams/mesh.mjs';
import { props, cameraPanel, shot } from './stage.mjs';

export default (kit) => {
  const persp = cameraPanel(kit, 14, 24, 236, 150, { frame: 0.92, label: 'Perspective', clip: 'cameras-ortho-0' });
  const ortho = cameraPanel(kit, 262, 24, 236, 150, { frame: 0.92, label: 'Orthographic', clip: 'cameras-ortho-1' });
  const [fx, fy, fw] = ortho.frame;
  return kit.svg({ width: 512, height: 196 },
    persp.svg, persp.inside(drawMesh(kit, props(), shot(persp.frame, [0, -2.0, 1.2], { lens: 22 }), { width: 1.5 })), persp.border, persp.label,
    ortho.svg, ortho.inside(drawMesh(kit, props(), shot(ortho.frame, [0, -6, 0.45], { ortho: 2.6 }), { width: 1.5 })), ortho.border, ortho.label,
    kit.line(fx, fy + 10, fx + fw, fy + 10, { cls: 'd-mark', width: 1.6 }),
    kit.arrowhead(fx, fy + 10, Math.PI, { size: 7, width: 1.6 }), kit.arrowhead(fx + fw, fy + 10, 0, { size: 7, width: 1.6 }),
    kit.text(fx + fw / 2, fy - 2, 'Orthographic Scale', { anchor: 'middle', size: 11, cls: 'd-tag' }),
  );
};
