// Ctrl+J in Object Mode. Left, the five rocks selected, each with its own origin; Rock 1 (the
// biggest) was clicked last, so it is active. Right, one rock pile, keeping Rock 1's name and its origin at the big rock's base.
import { view, join } from '../../../diagrams/mesh.mjs';
import { rocks, ROCKS } from './props.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 24, elevation: 26, at: [124, 118], scale: 120, target: [1.5, 0, 0.15] });
  const right = view({ azimuth: 24, elevation: 26, at: [376, 118], scale: 120, target: [1.5, 0, 0.15] });
  const dot = (v, at, r = 4) => { const [x, y] = v.project(at); return kit.dot(x, y, { r, cls: 'd-mark-fill' }); };
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 180, 'five selected, Rock 1 last'),
    rocks().map((m) => paint(kit, m, left, { width: 1.1, rim: 'd-mark' })),
    ROCKS.slice(1).map((r) => dot(left, r.at, 2.6)),
    dot(left, ROCKS[0].at, 4.5),
    step(kit, 240, 104, 260),
    panel(kit, 266, 14, 220, 180, 'one object: Rock 1'),
    paint(kit, join(...rocks()), right, { width: 1.1, rim: 'd-mark' }),
    dot(right, ROCKS[0].at, 4.5),
  );
};
