// The guard, a cube scaled to 52 by 24 by 16 cm with the same Bevel, and the grip, a cylinder with
// 8 vertices and triangle fan caps, its bottom widened.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';
import { guard, grip } from './shapes.mjs';

export default (kit) => kit.svg({ width: 480, height: 220 },
  panel(kit, 14, 14, 220, 170, 'guard'),
  drawMesh(kit, guard(), view({ at: [124, 99], scale: 330, target: [0, 0, 0.305] }), { width: 1.4 }),
  panel(kit, 246, 14, 220, 170, 'grip'),
  drawMesh(kit, grip(), view({ at: [356, 99], scale: 480, elevation: 14, target: [0, 0, 0.11] }), { width: 1.4 }),
);
