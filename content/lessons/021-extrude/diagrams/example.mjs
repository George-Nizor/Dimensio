// A set of three steps and an L-shaped wall, each built from one cube by extruding faces.
import { view, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';
import { steps, lWall } from './shapes.mjs';

export default (kit) => {
  const a = view({ at: [126, 116], scale: 64, target: [0, 0.6, 0.45], azimuth: 300, elevation: 26 });
  const b = view({ at: [384, 116], scale: 34, target: [1.5, 1, 1.25], azimuth: 215, elevation: 40 });
  return kit.svg({ width: 510, height: 230 },
    panel(kit, 14, 14, 224, 184, 'steps'),
    drawMesh(kit, steps(), a, { width: 1.3 }),
    panel(kit, 272, 14, 224, 184, 'L-shaped wall'),
    drawMesh(kit, lWall(), b, { width: 1.3 }),
  );
};
