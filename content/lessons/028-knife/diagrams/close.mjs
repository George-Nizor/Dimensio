// A window outline cut into the wall: three corners clicked, and a double-click at the fourth joins
// the cut back to the first point.
import { views } from '../../../diagrams/mesh.mjs';
import { wall, front, cut, clicks, WINDOW } from './wall.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = views.front({ at: [200, 122], scale: 76, target: [0, 0, 1.25] });
  const [cx, cy] = v.project(front(...WINDOW[3]));
  return kit.svg({ width: 500, height: 240 },
    paint(kit, wall(), v, { width: 1.6 }),
    cut(kit, v, WINDOW, { cls: 'd-mark', width: 2.2, closed: true }),
    clicks(kit, v, WINDOW),
    kit.circle(cx, cy, 8, { cls: 'd-mark', width: 1.6 }),
    kit.circle(cx, cy, 13, { cls: 'd-mark', width: 1.2 }),
    kit.line(cx - 14, cy - 8, 352, 70, { cls: 'd-guide', width: 1.2 }),
    kit.text(358, 66, 'double-click', { size: 12 }),
    kit.text(358, 82, 'closes the loop', { size: 12 }),
  );
};
