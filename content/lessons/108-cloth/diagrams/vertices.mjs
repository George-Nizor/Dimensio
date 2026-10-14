// Why the cloth needs cuts. Left, the starter's single-face sheet: with only four corners it
// lies stiff across the table. Right, the same sheet subdivided with 30 cuts: it folds over
// the edges.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { table, draped, stiff } from './scene.mjs';
import { panel } from './helpers.mjs';

export default (kit) => {
  const cell = (x, cloth, width) => {
    const v = view({ azimuth: 35, elevation: 24, at: [x + 110, 110], scale: 92, target: [0, 0, 0.5] });
    return [panel(kit, x, 14, 220, 170), drawMesh(kit, table(), v, { width: 1.1 }), drawMesh(kit, cloth, v, { width })];
  };
  return kit.svg({ width: 480, height: 214 },
    cell(10, stiff(), 1.4),
    kit.text(120, 204, '1 face: no folds', { anchor: 'middle', size: 12 }),
    cell(250, draped([20, 16]), 0.7),
    kit.text(360, 204, '30 cuts: folds', { anchor: 'middle', size: 12 }),
  );
};
