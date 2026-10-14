// Three equal cubes in a row going away from you. In perspective the far ones look smaller; in
// orthographic they stay the same size.
import { cube, translate, join, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { panel } from './shapes.mjs';

export default (kit) => {
  const row = join(...[0, 3, 6].map((y) => translate(cube(1), [0, y, 0])));
  const persp = view({ azimuth: 30, elevation: 18, at: [132, 92], scale: 24, target: [0, 3, 0], distance: 8 });
  const ortho = view({ azimuth: 30, elevation: 18, at: [400, 100], scale: 26, target: [0, 3, 0] });
  return kit.svg({ width: 520, height: 210 },
    panel(kit, 14, 14, 212, 170, 'perspective'), drawMesh(kit, row, persp, { width: 1.6 }),
    keycap(kit, 260, 100, 'Numpad 5', { size: 11 }),
    panel(kit, 294, 14, 212, 170, 'orthographic'), drawMesh(kit, row, ortho, { width: 1.6 }),
  );
};
