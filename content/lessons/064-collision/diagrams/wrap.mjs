// Simple shapes wrapped around each prop: left, a box a little larger than the crate; right, a
// cylinder with 8 vertices around the barrel. Both are scaled in Edit Mode.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { crate, crateCollision, barrel, barrelCollision, panel } from './shapes.mjs';

export default (kit) => {
  const left = view({ azimuth: 28, elevation: 22, scale: 150, at: [125, 118], target: [0, 0, 0.42] });
  const right = view({ azimuth: 28, elevation: 22, scale: 150, at: [375, 118], target: [0, 0, 0.45] });
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 222, 196, 'box: 12 triangles'),
    drawMesh(kit, crate(), left, { width: 1.3 }),
    drawMesh(kit, crateCollision(), left, { mode: 'wire', cls: 'd-mark', width: 1.6 }),
    panel(kit, 264, 14, 222, 196, 'cylinder, 8 vertices: 28 triangles'),
    drawMesh(kit, barrel(), right, { width: 1.1 }),
    drawMesh(kit, barrelCollision(), right, { mode: 'wire', cls: 'd-mark', width: 1.6 }),
  );
};
