// Two separate strips 0.4 m apart, in one mesh, with the right-hand tip of the front strip lifted
// 1.2 m and a 2.5 m circle. Left, without Connected Only, the back strip bends too. Right, with it,
// only the strip whose tip moved bends.
import { view, plane, translate, join, transform } from '../../../diagrams/mesh.mjs';
import { FALLOFF } from './ground.mjs';
import { paint, panel } from './paint.mjs';

const strip = (y) => translate(plane({ size: [4, 0.6], segments: [12, 2] }), [0, y, 0]);
const lift = (m) => transform(m, ([x, y, z]) => {
  const d = Math.hypot(x - 2, y + 0.5);
  return [x, y, d < 2.5 ? z + 1.2 * FALLOFF.smooth(1 - d / 2.5) : z];
});

export default (kit) => {
  const left = view({ azimuth: 14, elevation: 22, at: [124, 124], scale: 50, target: [0, 0, 0.3] });
  const right = view({ azimuth: 14, elevation: 22, at: [376, 124], scale: 50, target: [0, 0, 0.3] });
  const both = join(lift(strip(-0.5)), lift(strip(0.5)));
  const one = join(lift(strip(-0.5)), strip(0.5));
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 180, 'off: both strips bend'),
    paint(kit, both, left, { outward: false, width: 1.1 }),
    panel(kit, 266, 14, 220, 180, 'Connected Only: one bends'),
    paint(kit, one, right, { outward: false, width: 1.1 }),
  );
};
