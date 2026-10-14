// Leaves falling from a tree and drifting to the right in the wind, some already lying on the
// ground downwind of it.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { tree, ground, falling } from './scene.mjs';
import { leaf } from './helpers.mjs';

export default (kit) => {
  const v = view({ azimuth: 10, elevation: 18, at: [190, 200], scale: 38, target: [0.6, 0, 0] });
  return kit.svg({ width: 500, height: 250 },
    drawMesh(kit, ground(6.4), v, { width: 1 }),
    drawMesh(kit, tree(), v, { width: 1.2 }),
    falling(60, { drift: 1.1 }).map(([x, y, z, turn, down]) => { const [px, py] = v.project([x, y, z]); return leaf(kit, px, py, { size: down ? 5 : 6, angle: down ? 10 : turn }); }),
  );
};
