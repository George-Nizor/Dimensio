// The finished sword, 1 m tall: a bevelled blade built in half with Mirror and Solidify, a bevelled
// guard and an eight-sided grip, beside Kenney's sword it copies.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { sword } from './shapes.mjs';

export default (kit) => kit.svg({ width: 400, height: 260 },
  drawMesh(kit, sword(), view({ at: [200, 240], scale: 215, target: [0, 0, 0] }), { width: 1.1 }),
);
