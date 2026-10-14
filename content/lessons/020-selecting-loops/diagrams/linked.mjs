// Five small cubes in one mesh, none joined to another. With the mouse over the second and L
// pressed, only that cube is selected.
import { box, join, view, drawMesh, cursor, keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const bolts = [0, 1, 2, 3, 4].map((i) => box({ size: [0.2, 0.2, 0.2], center: [i * 0.35, 0, 0.1] }));
  const m = join(...bolts);
  const v = view({ at: [190, 120], scale: 190, target: [0.7, 0, 0.1] });
  const [x, y] = v.project([0.35, -0.1, 0.12]);
  return kit.svg({ width: 400, height: 220 },
    drawMesh(kit, m, v, { width: 1.4, select: { faces: [6, 7, 8, 9, 10, 11] } }),
    cursor(kit, x, y),
    keycap(kit, 200, 186, 'L'),
  );
};
