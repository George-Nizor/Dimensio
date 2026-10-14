// Wrong: Ctrl+A > All Transforms on a crate standing 3 m from the world origin moves its origin to
// the world origin, far from the crate. Right: Rotation & Scale leaves the origin at the crate's
// base.
import { view, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { crate, panel, origin } from './parts.mjs';

export default (kit) => {
  const left = view({ azimuth: 24, elevation: 24, scale: 42, at: [70, 140], target: [0, 0, 0] });
  const right = view({ azimuth: 24, elevation: 24, scale: 42, at: [320, 140], target: [0, 0, 0] });
  const box = translate(crate(), [3, 0, 0]);
  const worldOrigin = (v) => {
    const [x, y] = v.project([0, 0, 0]);
    return [kit.line(x - 10, y, x + 10, y, { cls: 'd-guide', width: 1.2 }), kit.line(x, y - 10, x, y + 10, { cls: 'd-guide', width: 1.2 })];
  };
  const [ax, ay] = left.project([0, 0, 0]);
  const [bx, by] = left.project([3, 0, 0]);
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 222, 196),
    worldOrigin(left),
    drawMesh(kit, box, left, { width: 1.4 }),
    kit.line(ax, ay, bx, by, { cls: 'd-bad', width: 1.4, dash: '5 4' }),
    origin(kit, ax, ay),
    kit.tag(125, 236, 'All Transforms', { tone: 'bad' }),
    panel(kit, 264, 14, 222, 196),
    worldOrigin(right),
    drawMesh(kit, box, right, { width: 1.4 }),
    origin(kit, ...right.project([3, 0, 0])),
    kit.tag(375, 236, 'Rotation & Scale'),
  );
};
