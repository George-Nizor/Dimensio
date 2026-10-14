// Seen from the top, close up on one point of the grid. Wrong: a post snapped with Snap Base on
// Closest has its corner on the grid point, so its middle sits off it. Right: with Center, the
// post's origin, its middle, is on the grid point.
import { box, views, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, origin } from './parts.mjs';

export default (kit) => {
  const cell = (x, centre, tag, tone) => {
    const v = views.top({ at: [x + 110, 100], scale: 320 });
    const [gx, gy] = v.project([0, 0, 0]);
    const [ox, oy] = v.project([...centre, 1.2]);
    return [
      panel(kit, x, 14, 220, 172),
      kit.line(x + 10, gy, x + 210, gy, { cls: 'd-guide', width: 1.4 }),
      kit.line(gx, 24, gx, 176, { cls: 'd-guide', width: 1.4 }),
      drawMesh(kit, box({ size: [0.2, 0.2, 1.2], center: [...centre, 0.6] }), v, { width: 1.8 }),
      origin(kit, ox, oy),
      kit.circle(gx, gy, 9, { cls: tone === 'bad' ? 'd-bad' : 'd-mark', width: 2 }),
      kit.tag(x + 110, 212, tag, { tone }),
    ];
  };
  return kit.svg({ width: 500, height: 226 },
    cell(14, [0.1, -0.1], 'Closest: corner on the point', 'bad'),
    cell(266, [0, 0], 'Center: middle on the point'),
  );
};
