// The exercise's three pieces after this lesson: a rope hanging between two posts, a pipe with a
// bend and closed ends, and a handrail swept from a flat rectangular profile. Drawn thicker than
// the real pieces so the shapes read at this size.
import { box, join, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { autoPath, pathPoints, tube, sweep, rectangle, panel } from './curves.mjs';

export default (kit) => {
  const rope = autoPath([[-1.5, 0, 1.3], [0, 0, 0.75], [1.5, 0, 1.3]]);
  const posts = join(...[-1.56, 1.56].map((x) => box({ size: [0.14, 0.14, 1.45], center: [x, 0, 0.725] })));
  const pipe = [[[-1, 0, 0], [-0.6, 0, 0], [-0.2, 0, 0], [0.1, 0, 0]], [[0.1, 0, 0], [0.35, 0, 0], [0.5, 0, 0.15], [0.5, 0, 0.4]], [[0.5, 0, 0.4], [0.5, 0, 0.8], [0.5, 0, 1.2], [0.5, 0, 1.5]]];
  const rail = autoPath([[-1.6, 0, 0], [0, 0.5, 0], [1.6, 0, 0]]);
  const cell = (i) => 12 + i * 176;
  return kit.svg({ width: 540, height: 200 },
    panel(kit, cell(0), 12, 164, 156, 'rope'),
    drawMesh(kit, posts, view({ azimuth: 20, elevation: 15, at: [cell(0) + 82, 112], scale: 44, target: [0, 0, 0.7] }), { width: 1.2 }),
    drawMesh(kit, tube(pathPoints(rope, 6), 0.06, 6), view({ azimuth: 20, elevation: 15, at: [cell(0) + 82, 112], scale: 44, target: [0, 0, 0.7] }), { width: 1 }),
    panel(kit, cell(1), 12, 164, 156, 'pipe'),
    drawMesh(kit, tube(pathPoints(pipe, 4), 0.14, 8, { caps: true }), view({ azimuth: 30, elevation: 20, at: [cell(1) + 82, 92], scale: 60, target: [0, 0, 0.6] }), { width: 1 }),
    panel(kit, cell(2), 12, 164, 156, 'rail'),
    drawMesh(kit, sweep(pathPoints(rail, 6), rectangle(0.24, 0.12), { caps: true }), view({ azimuth: 35, elevation: 30, at: [cell(2) + 82, 92], scale: 44, target: [0, 0.2, 0] }), { width: 1 }),
  );
};
