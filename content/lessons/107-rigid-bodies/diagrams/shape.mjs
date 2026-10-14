// Collision shapes. Left, Box fits a block exactly. Middle, Convex Hull wraps an L-shaped piece
// like shrink wrap and fills its notch (dashed). Right, Mesh follows every face, notch and all.
import { box, join, translate, views, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';

export default (kit) => {
  const ell = join(box({ size: [1.2, 0.6, 0.4], center: [0, 0, 0.2] }), box({ size: [0.4, 0.6, 0.8], center: [-0.4, 0, 0.8] }));
  const cell = (x, label, mesh, outline) => {
    const v = views.front({ at: [x + 75, 120], scale: 80, target: [0, 0, 0.6] });
    const out = [panel(kit, x, 20, 150, 150, label), drawMesh(kit, mesh, v, { width: 1.4 })];
    if (outline) out.push(kit.polyline(outline.map((p) => v.project(p)), { cls: 'd-mark', width: 2, dash: '5 4' }));
    return out;
  };
  const blockOnly = box({ size: [0.6, 0.6, 1.0], center: [0, 0, 0.5] });
  return kit.svg({ width: 500, height: 200 },
    cell(10, 'Box', blockOnly, [[-0.34, 0, -0.04], [0.34, 0, -0.04], [0.34, 0, 1.04], [-0.34, 0, 1.04], [-0.34, 0, -0.04]]),
    cell(175, 'Convex Hull', ell, [[-0.64, 0, -0.04], [0.64, 0, -0.04], [0.64, 0, 0.44], [-0.16, 0, 1.24], [-0.64, 0, 1.24], [-0.64, 0, -0.04]]),
    cell(340, 'Mesh', ell, [[-0.64, 0, -0.04], [0.64, 0, -0.04], [0.64, 0, 0.44], [-0.16, 0, 0.44], [-0.16, 0, 1.24], [-0.64, 0, 1.24], [-0.64, 0, -0.04]]),
  );
};
