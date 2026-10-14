// Seen from the top, a door with its origin at one end, on its hinge, swinging open around it.
import { views, drawMesh, rotate, translate } from '../../../diagrams/mesh.mjs';
import { origin } from './parts.mjs';
import { door } from './props.mjs';

export default (kit) => {
  const v = views.top({ at: [110, 190], scale: 160, target: [0, 0, 0] });
  const closed = translate(door(), [0.45, 0, 0]);
  const [hx, hy] = v.project([0, 0, 0]);
  return kit.svg({ width: 360, height: 236 },
    drawMesh(kit, closed, v, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    [30, 60].map((a) => drawMesh(kit, rotate(closed, 'z', a), v, { mode: 'wire', cls: 'd-guide', width: 1 })),
    drawMesh(kit, rotate(closed, 'z', 90), v, { width: 1.8, cls: 'd-mark' }),
    kit.arcArrow(hx + 150, hy - 10, hx + 12, hy - 148, { lift: -50 }),
    origin(kit, hx, hy),
    kit.text(hx + 12, hy + 26, 'hinge', { size: 12 }),
  );
};
