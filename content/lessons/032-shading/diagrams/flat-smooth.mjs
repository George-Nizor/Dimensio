// A 12-sided cylinder shaded flat (each side one tone, its edges showing) and shaded smooth (one
// blend round the side). The outline is faceted in both.
import { view, cylinder } from '../../../diagrams/mesh.mjs';
const SIDE = [-0.9, -0.3, 0.3];
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 20, elevation: 22, at: [124, 104], scale: 64, target: [0, 0, 0] });
  const right = view({ azimuth: 20, elevation: 22, at: [376, 104], scale: 64, target: [0, 0, 0] });
  const m = cylinder({ vertices: 12, radius: 0.9, depth: 1.8 });
  const sides = m.faces.map((f, i) => [f, i]).filter(([f]) => f.length === 4).map(([, i]) => i);
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 180, 'Shade Flat'),
    paint(kit, m, left, { light: SIDE, width: 1.3 }),
    panel(kit, 266, 14, 220, 180, 'Shade Smooth'),
    paint(kit, m, right, { light: SIDE, width: 1.3, smooth: (i) => sides.includes(i), sharp: 40, edges: 'shape' }),
  );
};
