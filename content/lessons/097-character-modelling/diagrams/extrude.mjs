// Extruding the limbs from the half torso: the bottom face of the hip extruded down twice, to the
// knee and to the ankle, and the shoulder's side face extruded out along X to the elbow and wrist.
import { views, drawMesh, box, join, facesWhere } from '../../../diagrams/mesh.mjs';
import { pageArrow } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from './charkit.mjs';

export default (kit) => {
  const torso = box({ size: [0.19, 0.22, 0.5], segments: [1, 1, 2], center: [0.095, 0, 1.2] });
  const thigh = box({ size: [0.145, 0.22, 0.44], center: [0.1175, 0, 0.73] });
  const shin = box({ size: [0.145, 0.22, 0.41], center: [0.1175, 0, 0.305] });
  const upper = box({ size: [0.28, 0.12, 0.14], center: [0.33, 0, 1.38] });
  const fore = box({ size: [0.37, 0.12, 0.14], center: [0.655, 0, 1.38] });
  const all = join(torso, thigh, shin, upper, fore);
  const v = views.front({ at: [150, 160], scale: 150, target: [0, 0, 0.85] });
  const ends = facesWhere(all, (c, n) => (n[2] < -0.9 && c[2] < 0.11) || (n[0] > 0.9 && c[0] > 0.83));
  const p = (q) => v.project(q);
  return kit.svg({ width: 460, height: 300 },
    frame(kit, 14, 14, 432, 272),
    drawMesh(kit, all, v, { width: 1.2, select: { faces: ends } }),
    pageArrow(kit, ...p([0.33, 0, 0.98]), ...p([0.33, 0, 0.55])),
    kit.text(p([0.33, 0, 0.75])[0] + 8, p([0.33, 0, 0.75])[1], 'E, down', { size: 12 }),
    pageArrow(kit, ...p([0.3, 0, 1.6]), ...p([0.8, 0, 1.6])),
    kit.text(p([0.55, 0, 1.6])[0], p([0.55, 0, 1.6])[1] - 10, 'E, out along X', { anchor: 'middle', size: 12 }),
  );
};
