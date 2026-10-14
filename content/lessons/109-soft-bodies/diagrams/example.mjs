// A jelly cube a moment after landing on a plate: squashed down and bulging at the sides, before
// it springs back.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { plate, jelly } from './scene.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 22, at: [240, 136], scale: 135, target: [0, 0, 0.3] });
  return kit.svg({ width: 480, height: 250 },
    drawMesh(kit, plate(), v, { width: 1.2 }),
    drawMesh(kit, jelly({ squash: 0.8, z: 0.36 }), v, { width: 1 }),
  );
};
