// The cube falling toward the plate, a flat disc made with Add > Mesh > Circle and Fill Type
// N-Gon, which has Collision turned on in its Physics tab.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { plate, jelly } from './scene.mjs';
import { push } from './helpers.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 20, at: [170, 200], scale: 110, target: [0, 0, 0] });
  const c = v.project([0, 0, 0.6]);
  return kit.svg({ width: 460, height: 250 },
    drawMesh(kit, plate(), v, { width: 1.2 }),
    drawMesh(kit, jelly({ z: 1.25 }), v, { width: 1 }),
    push(kit, c[0], c[1] - 8, c[0], c[1] + 26, { width: 2 }),
    kit.text(310, 90, 'plate:', { size: 12 }),
    kit.text(310, 110, 'Add > Mesh > Circle,', { size: 12 }),
    kit.text(310, 130, 'Fill Type N-Gon,', { size: 12 }),
    kit.text(310, 150, 'Physics tab > Collision', { size: 12 }),
  );
};
