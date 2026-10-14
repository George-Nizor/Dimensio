// Seen from the top: with the pivot point on 3D Cursor, R, Z, 30 swings a plank standing 2 m from
// the cursor 30 degrees around it.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { cursor3d, keyRow } from './parts.mjs';
import { plank } from './planks.mjs';

export default (kit) => {
  const v = views.top({ at: [190, 140], scale: 50 });
  const [cx, cy] = v.project([0, 0, 0]);
  const [ax, ay] = v.project([0, 2, 0]);
  const [bx, by] = v.project([-Math.sin(Math.PI / 6) * 2, Math.cos(Math.PI / 6) * 2, 0]);
  return kit.svg({ width: 440, height: 256 },
    kit.circle(cx, cy, 100, { cls: 'd-guide', width: 1, dash: '4 6' }),
    kit.line(cx, cy, ax, ay, { cls: 'd-guide', width: 1.2 }),
    kit.line(cx, cy, bx, by, { cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, plank(0), v, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, plank(30), v, { width: 1.8, cls: 'd-mark' }),
    kit.arcArrow(ax - 14, ay + 6, bx + 14, by + 4, { lift: -10 }),
    cursor3d(kit, cx, cy, { r: 10 }),
    kit.text(cx + 18, cy + 30, '3D cursor', { size: 12 }),
    keyRow(kit, 316, 40, ['R', 'Z', '30'], { size: 12 }).svg,
  );
};
