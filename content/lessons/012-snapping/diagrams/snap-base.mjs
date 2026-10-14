// The same block twice. Left, Snap Base on Closest: the corner of its box nearest the target is
// the point that snaps. Right, Snap Base on Center: its origin is the point that snaps.
import { cube, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, origin } from './parts.mjs';

export default (kit) => {
  const cell = (x, label, point) => {
    const v = view({ at: [x + 100, 100], scale: 52 });
    const [px, py] = v.project(point);
    const out = [panel(kit, x, 14, 200, 170, label), drawMesh(kit, cube(1.6), v, { width: 1.6 })];
    if (label === 'Closest') out.push(kit.dot(px, py, { r: 6, cls: 'd-mark-fill' }), kit.circle(px, py, 11, { cls: 'd-mark', width: 1.6 }));
    else out.push(origin(kit, px, py), kit.circle(px, py, 11, { cls: 'd-mark', width: 1.6 }));
    return out;
  };
  return kit.svg({ width: 450, height: 210 },
    cell(14, 'Closest', [0.8, -0.8, -0.8]),
    cell(236, 'Center', [0, 0, 0]),
  );
};
