// Merge by Distance on the broken crate. Left, the top was split off, so each of its four corners
// is two vertices in the same place (ringed). Right, after the merge, one vertex at each corner.
import { view } from '../../../diagrams/mesh.mjs';
import { broken, topCorners } from './faults.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 30, at: [118, 108], scale: 224, target: [0, 0, 0.25] });
  const right = view({ azimuth: 30, elevation: 30, at: [392, 108], scale: 224, target: [0, 0, 0.25] });
  const { mesh } = broken({ hole: false, flipped: false });
  const corners = topCorners(mesh);
  return kit.svg({ width: 510, height: 230 },
    panel(kit, 14, 14, 208, 184, 'two vertices at each corner'),
    paint(kit, mesh, left, { width: 1.1 }),
    corners.map((i) => { const [x, y] = left.project(mesh.verts[i]); return [kit.circle(x, y, 7, { cls: 'd-mark', width: 1.6 }), kit.dot(x, y, { r: 3.4, cls: 'd-mark-fill' })]; }),
    step(kit, 232, 104, 278),
    panel(kit, 288, 14, 208, 184, 'merged: one each'),
    paint(kit, mesh, right, { width: 1.1, select: { verts: corners } }),
  );
};
