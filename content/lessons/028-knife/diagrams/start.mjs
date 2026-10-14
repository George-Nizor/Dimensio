// A doorway being cut, seen from the front (Numpad 1): K, a click on the bottom edge, clicks at two
// corners, and the next line following the mouse. Enter makes the cut.
import { views, keycap, cursor } from '../../../diagrams/mesh.mjs';
import { wall, front, cut, clicks, DOOR } from './wall.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = views.front({ at: [200, 122], scale: 76, target: [0, 0, 1.25] });
  const done = DOOR.slice(0, 3);
  const [x, y] = v.project(front(0.5, 0.75));
  const [lx, ly] = v.project(front(0.5, 2));
  return kit.svg({ width: 500, height: 240 },
    paint(kit, wall(), v, { width: 1.6 }),
    cut(kit, v, done, { cls: 'd-mark', width: 2.2 }),
    kit.line(lx, ly, x, y, { cls: 'd-mark', width: 2, dash: '5 4' }),
    clicks(kit, v, done),
    cursor(kit, x, y),
    keycap(kit, 410, 88, 'K'),
    kit.text(410, 122, 'start the knife', { anchor: 'middle', size: 12 }),
    keycap(kit, 410, 158, 'Enter', { size: 12 }),
    kit.text(410, 192, 'make the cut', { anchor: 'middle', size: 12 }),
  );
};
