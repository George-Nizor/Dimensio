// One bent six-sided face from the shade, split two ways. Wrong: split into triangles across the
// fold, so a crease runs where the face doesn't bend. Right: split along the middle ring, where it
// does bend.
import { mesh, view } from '../../../diagrams/mesh.mjs';
import { paint, panel } from './paint.mjs';

const R = [[0.25, 0.17], [0.35, 0.14], [0.45, 0.08]];
const P = (z, r, a) => [Math.cos(a) * r, Math.sin(a) * r, z];

export default (kit) => {
  const a0 = -Math.PI / 2 - Math.PI / 8;
  const a1 = -Math.PI / 2 + Math.PI / 8;
  const verts = R.flatMap(([z, r]) => [P(z, r, a0), P(z, r, a1)]);
  const [b0, b1, m0, m1, t0, t1] = [0, 1, 2, 3, 4, 5];
  const wrong = mesh(verts, [[b0, b1, m1], [b0, m1, t1], [b0, t1, t0], [b0, t0, m0]]);
  const right = mesh(verts, [[b0, b1, m1, m0], [m0, m1, t1, t0]]);
  const left = view({ azimuth: 18, elevation: 14, at: [124, 104], scale: 620, target: [0, -0.15, 0.35] });
  const rightV = view({ azimuth: 18, elevation: 14, at: [376, 104], scale: 620, target: [0, -0.15, 0.35] });
  const side = [-0.8, -0.5, 0.3];
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 180),
    paint(kit, wrong, left, { width: 1.5, light: side, outward: false }),
    kit.tag(124, 218, 'split across the fold', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 180),
    paint(kit, right, rightV, { width: 1.5, light: side, outward: false }),
    kit.tag(376, 218, 'split where it bends'),
  );
};
