// The crate and the barrel, each inside its collision mesh drawn as a wire: a box around the
// crate and an 8-sided cylinder around the barrel.
import { view, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { crate, crateCollision, barrel, barrelCollision } from './shapes.mjs';

export default (kit) => {
  const v = view({ azimuth: 28, elevation: 20, scale: 140, at: [240, 140], target: [0.6, 0, 0.45] });
  return kit.svg({ width: 480, height: 250 },
    drawMesh(kit, crate(), v, { width: 1.4 }),
    drawMesh(kit, crateCollision(), v, { mode: 'wire', cls: 'd-mark', width: 1.6 }),
    drawMesh(kit, translate(barrel(), [1.2, 0, 0]), v, { width: 1.2 }),
    drawMesh(kit, translate(barrelCollision(), [1.2, 0, 0]), v, { mode: 'wire', cls: 'd-mark', width: 1.6 }),
  );
};
