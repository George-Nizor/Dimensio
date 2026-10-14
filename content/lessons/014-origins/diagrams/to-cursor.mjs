// A lamp post standing on the centre of the world. Origin to 3D Cursor moves its origin from the
// top of the lamp down to the 3D cursor at its base.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { origin, cursor3d } from './parts.mjs';
import { lamp } from './props.mjs';

export default (kit) => {
  const v = view({ at: [160, 150], scale: 80, target: [0, 0, 1.3] });
  const [tx, ty] = v.project([0, 0, 2.6]);
  const [bx, by] = v.project([0, 0, 0]);
  return kit.svg({ width: 420, height: 290 },
    drawMesh(kit, lamp(), v, { width: 1.6 }),
    kit.circle(tx, ty, 6, { cls: 'd-guide', width: 1.2, dash: '2 2' }),
    kit.arcArrow(tx + 12, ty, bx + 16, by - 4, { lift: -60, dash: '6 5' }),
    cursor3d(kit, bx, by, { r: 11 }),
    origin(kit, bx, by),
    kit.text(250, 60, 'Object > Set Origin >', { size: 12 }),
    kit.text(250, 78, 'Origin to 3D Cursor', { size: 12, cls: 'd-tag' }),
  );
};
