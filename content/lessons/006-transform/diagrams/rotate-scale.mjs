// Left, R turns the block around its origin. Right, S scales it: moving the mouse away from the
// block makes it bigger.
import { view, drawMesh, rotate, scale, keycap, cursor } from '../../../diagrams/mesh.mjs';
import { origin } from './parts.mjs';
import { block } from './block.mjs';

export default (kit) => {
  const centred = block([0, 0, 0]);
  const lv = view({ at: [120, 112], scale: 100 });
  const rv = view({ at: [360, 116], scale: 90 });
  const [ox, oy] = lv.project([0, 0, 0]);
  const [sx, sy] = rv.project([0, 0, 0]);
  return kit.svg({ width: 500, height: 230 },
    drawMesh(kit, centred, lv, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, rotate(centred, 'z', 35), lv, { width: 1.8 }),
    origin(kit, ox, oy),
    kit.ellipse(ox, oy + 2, 84, 28, { cls: 'd-guide', width: 1.2, dash: '5 6' }),
    kit.arcArrow(ox - 76, oy + 20, ox + 76, oy + 20, { lift: 20 }),
    keycap(kit, 120, 214, 'R'),
    drawMesh(kit, scale(centred, [1.25, 1.25, 1.25]), rv, { width: 1.8 }),
    drawMesh(kit, scale(centred, [0.75, 0.75, 0.75]), rv, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    origin(kit, sx, sy),
    kit.line(sx + 52, sy - 34, sx + 92, sy - 60, { cls: 'd-mark', width: 2 }), kit.arrowhead(sx + 92, sy - 60, Math.atan2(-26, 40), { size: 8 }),
    cursor(kit, sx + 96, sy - 66),
    keycap(kit, 370, 214, 'S'),
  );
};
