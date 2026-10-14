// G, Z with proportional editing on: the circle on the ground shows how far the move reaches, and
// rolling the wheel changes its size.
import { view, mouse } from '../../../diagrams/mesh.mjs';
import { grid, bump, circle } from './ground.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 30, at: [190, 130], scale: 34, target: [0, 0, 0.4] });
  const m = bump(grid(), { height: 1.4, radius: 2 });
  const top = m.verts.findIndex((p) => Math.abs(p[0]) < 1e-6 && Math.abs(p[1]) < 1e-6);
  return kit.svg({ width: 500, height: 250 },
    paint(kit, m, v, { outward: false, width: 1, select: { verts: [top] } }),
    circle(kit, v, [0, 0], 2),
    mouse(kit, 420, 112, { button: 'wheel', label: 'roll: circle size' }),
  );
};
