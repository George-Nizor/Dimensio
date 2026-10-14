// One of the shade's faces rebuilt: the bent six-sided face, four triangles after Ctrl+T, and two
// quads after Alt+J, split at the middle ring.
import { mesh, view, keycap } from '../../../diagrams/mesh.mjs';
import { paint, panel, step } from './paint.mjs';

const R = [[0.25, 0.17], [0.35, 0.14], [0.45, 0.08]];
const P = (z, r, a) => [Math.cos(a) * r, Math.sin(a) * r, z];

export default (kit) => {
  const a0 = -Math.PI / 2 - Math.PI / 8;
  const a1 = -Math.PI / 2 + Math.PI / 8;
  const verts = R.flatMap(([z, r]) => [P(z, r, a0), P(z, r, a1)]);
  const [b0, b1, m0, m1, t0, t1] = [0, 1, 2, 3, 4, 5];
  const stages = [
    ['n-gon', [[b0, b1, m1, t1, t0, m0]]],
    ['4 triangles', [[b0, b1, m1], [b0, m1, m0], [m0, m1, t1], [m0, t1, t0]]],
    ['2 quads', [[b0, b1, m1, m0], [m0, m1, t1, t0]]],
  ];
  return kit.svg({ width: 540, height: 230 }, stages.map(([label, faces], i) => {
    const x = 14 + i * 186;
    const v = view({ azimuth: 18, elevation: 14, at: [x + 64, 100], scale: 500, target: [0, -0.15, 0.35] });
    return [
      panel(kit, x, 14, 128, 172, label),
      paint(kit, mesh(verts, faces), v, { width: 1.5, light: [-0.8, -0.5, 0.3], outward: false, fill: () => 'd-face-sel' }),
      i < 2 ? [step(kit, x + 134, 104, x + 180), keycap(kit, x + 157, 80, i === 0 ? 'Ctrl+T' : 'Alt+J', { size: 10 })] : '',
    ];
  }));
};
