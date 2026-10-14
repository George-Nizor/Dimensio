// The same group framed at 24 mm from close up and at 85 mm from further back. The short lens
// stretches depth; the long one flattens it.
import { drawMesh } from '../../../diagrams/mesh.mjs';
import { props, cameraPanel, shot, AIM } from './stage.mjs';

export default (kit) => {
  const out = [];
  const near = [1.1, -1.65, 1.05];
  const far = [3.8, -6.0, 1.9];
  [['24 mm, close', near, 24], ['85 mm, further back', far, 85]].forEach(([label, from, lens], i) => {
    const p = cameraPanel(kit, 14 + i * 248, 14, 236, 150, { frame: 0.92, label, clip: `cameras-lens-${i}` });
    out.push(p.svg, p.inside(drawMesh(kit, props(), shot(p.frame, from, { lens, target: AIM }), { width: 1.5 })), p.border, p.label);
  });
  return kit.svg({ width: 500, height: 192 }, out);
};
