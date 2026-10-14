// The sack's two shapes side by side: its Basis, a round sack with a neck, and its squash key, the
// same vertices moved lower and wider.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { sack, frame } from './sackkit.mjs';

export default (kit) => kit.svg({ width: 460, height: 230 },
  frame(kit, 14, 14, 200, 180, 'Basis'),
  drawMesh(kit, sack(0), view({ at: [114, 160], scale: 62, elevation: 18 }), { width: 1.2 }),
  frame(kit, 246, 14, 200, 180, 'squash'),
  drawMesh(kit, sack(1), view({ at: [346, 160], scale: 62, elevation: 18 }), { width: 1.2 }),
);
