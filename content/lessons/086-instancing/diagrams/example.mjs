// The exercise's result: rocks and trees scattered over the hill, each turned its own way and a
// little bigger or smaller than the next.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { hill, points, scattered } from './scene.mjs';

// The hill is drawn first, then each prop from the back to the front.

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 30, at: [260, 150], scale: 26, target: [0, 0, 1] });
  const props = points().sort((a, b) => v.depth(a.p) - v.depth(b.p));
  return kit.svg({ width: 520, height: 300 }, drawMesh(kit, hill(12), v, { width: 0.8 }), props.map((pt) => drawMesh(kit, scattered([pt]), v, { width: 0.8 })));
};
