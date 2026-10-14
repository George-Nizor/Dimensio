// Wrong: Collision was added to the cloth, so the table has none and the cloth falls straight
// through it. Right: Collision on the table, and the cloth drapes over it.
import { view, drawMesh, plane } from '../../../diagrams/mesh.mjs';
import { table, draped } from './scene.mjs';
import { panel } from './helpers.mjs';

export default (kit) => {
  const cell = (x, cloth) => {
    const v = view({ azimuth: 35, elevation: 22, at: [x + 110, 104], scale: 86, target: [0, 0, 0.45] });
    return [panel(kit, x, 14, 220, 170), drawMesh(kit, cloth.under ? cloth.mesh : table(), v, { width: 1.1 }), drawMesh(kit, cloth.under ? table() : cloth.mesh, v, { width: 0.7 })];
  };
  return kit.svg({ width: 480, height: 220 },
    cell(10, { mesh: plane({ size: [1.8, 1.4], segments: [12, 10], z: 0.01 }), under: true }),
    kit.tag(120, 208, 'Collision on the cloth', { tone: 'bad' }),
    cell(250, { mesh: draped([16, 12]) }),
    kit.tag(360, 208, 'Collision on the table'),
  );
};
