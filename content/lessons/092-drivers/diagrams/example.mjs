// The cart seen from the side (the front view). Faint, where it started; solid, after rolling
// 3.77 m to the right. The spoke on the near wheels has turned one and a half turns, from straight
// up to straight down, because each turn of a 0.4 m wheel rolls 2.51 m.
import { views } from '../../../diagrams/mesh.mjs';
import { cart, spoke, draw } from './animkit.mjs';

export default (kit) => {
  const d = 3 * Math.PI * 0.4;
  const v = views.front({ at: [118, 180], scale: 66 });
  const start = cart({ x: 0, turn: 0 });
  const end = cart({ x: d, turn: 540 });
  const near = (c) => c.centres.filter((p) => p[1] < 0);
  const gx = v.project([-1.4, 0, 0])[0];
  const hx = v.project([d + 1.4, 0, 0])[0];
  const [, gy] = v.project([0, 0, 0]);
  const ax = v.project([0.7, 0, 0])[0];
  const bx = v.project([0.7 + d, 0, 0])[0];
  return kit.svg({ width: 520, height: 250 },
    kit.line(gx - 10, gy, hx + 10, gy, { cls: 'd-guide', width: 1.6 }),
    draw(kit, start.mesh, v, { mode: 'wire', cls: 'd-guide', width: 1 }),
    near(start).map((c) => spoke(kit, v, c, 0, { cls: 'd-guide' })),
    draw(kit, end.mesh, v, { width: 1.6 }),
    near(end).map((c) => spoke(kit, v, c, 540)),
    kit.line(ax, gy + 24, bx, gy + 24, { cls: 'd-mark', width: 1.6 }),
    kit.arrowhead(bx, gy + 24, 0, { size: 7 }),
    kit.text((ax + bx) / 2, gy + 46, 'rolled 3.77 m: one and a half turns', { anchor: 'middle', size: 12 }),
    kit.text(260, 34, 'wheel Y rotation = cart X location / 0.4', { anchor: 'middle', size: 13 }),
  );
};
