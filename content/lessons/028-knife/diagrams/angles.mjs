// Angle Constraint (A) during a cut: the line from the last click held to steps of 30 degrees,
// shown as faint guides, with its length shown beside it after S.
import { views, keycap } from '../../../diagrams/mesh.mjs';
import { wall, front, clicks } from './wall.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = views.front({ at: [200, 122], scale: 76, target: [0, 0, 1.25] });
  const [ox, oy] = v.project(front(-0.5, 0));
  const [tx, ty] = v.project(front(-0.5, 2));
  const guides = [0, 30, 60, 90, 120, 150, 180].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return kit.line(ox, oy, ox + Math.cos(a) * 120, oy - Math.sin(a) * 120, { cls: 'd-guide', width: 1.1, dash: '4 5' });
  });
  return kit.svg({ width: 500, height: 240 },
    paint(kit, wall(), v, { width: 1.6 }),
    guides,
    kit.line(ox, oy, tx, ty, { cls: 'd-mark', width: 2.4 }),
    clicks(kit, v, [[-0.5, 0], [-0.5, 2]]),
    kit.text(ox + 8, (oy + ty) / 2, '2 m', { size: 12 }),
    kit.text(ox + 30, oy - 8, '30°', { size: 11 }),
    keycap(kit, 410, 88, 'A'),
    kit.text(410, 122, '30° steps', { anchor: 'middle', size: 12 }),
    keycap(kit, 410, 158, 'S'),
    kit.text(410, 192, 'show lengths', { anchor: 'middle', size: 12 }),
  );
};
