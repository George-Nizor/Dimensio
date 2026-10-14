// The three Boolean operations on two 2 m cubes, the second moved 1 m along X, Y and Z.
// Difference cuts the second out of the first, Union joins them, Intersect keeps the overlap.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';
import { difference, union, intersect } from './shapes.mjs';

export default (kit) => {
  const cells = [['Difference', difference()], ['Union', union()], ['Intersect', intersect()]];
  return kit.svg({ width: 520, height: 210 },
    cells.map(([label, m], i) => {
      const x = 14 + i * 168;
      return [panel(kit, x, 14, 156, 170, label), drawMesh(kit, m, view({ at: [x + 78, 108], scale: 30, target: [0.4, -0.4, 0.4] }), { width: 1.3 })];
    }),
  );
};
