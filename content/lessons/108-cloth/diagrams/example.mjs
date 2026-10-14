// A tablecloth draped over a low-poly table: flat across the top, hanging down the four sides
// with soft folds at the corners.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { table, draped } from './scene.mjs';

export default (kit) => {
  const v = view({ azimuth: 35, elevation: 24, at: [240, 150], scale: 150, target: [0, 0, 0.5] });
  return kit.svg({ width: 480, height: 270 },
    drawMesh(kit, table(), v, { width: 1.4 }),
    drawMesh(kit, draped([24, 18]), v, { width: 0.8 }),
  );
};
