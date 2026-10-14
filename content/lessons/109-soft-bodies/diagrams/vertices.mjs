// Left, the default cube: 8 vertices, nothing to bend between. Right, the same cube with 4 cuts
// along each edge: enough vertices to squash and wobble.
import { view, drawMesh, cube } from '../../../diagrams/mesh.mjs';
import { jelly } from './scene.mjs';
import { panel } from './helpers.mjs';

export default (kit) => {
  const cell = (x, mesh) => [panel(kit, x, 14, 200, 170), drawMesh(kit, mesh, view({ azimuth: 30, elevation: 24, at: [x + 100, 100], scale: 95, target: [0, 0, 0.42] }), { width: 1.3 })];
  return kit.svg({ width: 440, height: 212 },
    cell(10, jelly({ cuts: 0 })),
    kit.text(110, 204, '8 vertices', { anchor: 'middle', size: 12 }),
    cell(230, jelly({ cuts: 4 })),
    kit.text(330, 204, '4 cuts: 152 vertices', { anchor: 'middle', size: 12 }),
  );
};
