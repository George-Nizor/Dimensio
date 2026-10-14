// Left, the default cube: 2 m across, its origin in the middle. Right, after S 0.25 and G Z 0.25 in
// Edit Mode: 0.5 m across, standing on the ground with its origin at the middle of its base. The
// default cube's outline is dashed behind it.
import { view, dimension, drawMesh, cube } from '../../../diagrams/mesh.mjs';
import { crate } from './crate.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 34, elevation: 22, at: [118, 94], scale: 54, target: [0, 0, 0] });
  const right = view({ azimuth: 34, elevation: 22, at: [400, 100], scale: 54, target: [0, 0, 0] });
  const ground = (v, s) => { const a = v.project([-s, 0, 0]); const b = v.project([s, 0, 0]); return kit.line(a[0], a[1], b[0], b[1], { cls: 'd-guide', width: 1.2, dash: '5 5' }); };
  const origin = (v, p) => { const [x, y] = v.project(p); return kit.dot(x, y, { r: 4, cls: 'd-mark-fill' }); };
  return kit.svg({ width: 520, height: 240 },
    panel(kit, 14, 14, 210, 190, 'default cube'),
    paint(kit, crate('cube').mesh, left, { width: 1.6 }),
    origin(left, [0, 0, 0]),
    dimension(kit, left, [-1, -1, -1], [1, -1, -1], { offset: [0, -0.25, -0.1], label: '2 m' }),
    kit.text(260, 84, 'S 0.25', { anchor: 'middle', size: 11 }),
    kit.text(260, 100, 'G Z 0.25', { anchor: 'middle', size: 11 }),
    step(kit, 236, 112, 284),
    panel(kit, 296, 14, 210, 190, '0.5 m, on the ground'),
    drawMesh(kit, cube(2), right, { mode: 'wire', cls: 'd-guide', width: 1 }),
    ground(right, 1.3),
    paint(kit, crate('sized').mesh, right, { width: 1.6 }),
    origin(right, [0, 0, 0]),
    dimension(kit, right, [-0.25, -0.25, 0], [0.25, -0.25, 0], { offset: [0, -0.3, -0.3], label: '0.5 m' }),
  );
};
