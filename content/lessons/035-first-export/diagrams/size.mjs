// The crate on Godot's grid, seen from above: the grid squares are 1 m, the crate 0.5 m, half a
// square wide.
import { views } from '../../../diagrams/mesh.mjs';
import { grid, crateAt } from './godot.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = views.top({ at: [230, 120], scale: 90, target: [0, 0, 0] });
  const line = (a, b, label, dy) => {
    const p = v.project(a); const q = v.project(b);
    return [kit.line(p[0], p[1] + dy, q[0], q[1] + dy, { cls: 'd-mark', width: 1.6 }), kit.arrowhead(p[0], p[1] + dy, Math.PI, { size: 7 }), kit.arrowhead(q[0], q[1] + dy, 0, { size: 7 }), kit.text((p[0] + q[0]) / 2, p[1] + dy - 6, label, { anchor: 'middle', size: 12 })];
  };
  return kit.svg({ width: 460, height: 240 },
    grid(kit, v, 2),
    paint(kit, crateAt(0.25, 0.25), v, { outward: false, width: 1.1 }),
    line([0, 0.5, 0], [0.5, 0.5, 0], '0.5 m', -8),
    line([-1, -1, 0], [0, -1, 0], '1 m', 22),
  );
};
