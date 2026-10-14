// Support loops. Left, the cube with an edge loop close to each edge, as the mesh you edit. Right,
// the same mesh under Subdivision Surface at level 2: a box with tight, rounded edges.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { subdivide, panel, pageArrow } from '../../037-modifiers/diagrams/modkit.mjs';
import { loopBox } from './shapes.mjs';

export default (kit) => {
  const c = [-1, -0.82, 0.82, 1];
  const m = loopBox([c, c, c]);
  return kit.svg({ width: 500, height: 220 },
    panel(kit, 14, 14, 200, 170, 'loops near every edge'),
    drawMesh(kit, m, view({ at: [114, 100], scale: 34 }), { width: 1.1 }),
    pageArrow(kit, 226, 99, 274, 99),
    panel(kit, 286, 14, 200, 170, 'level 2'),
    drawMesh(kit, subdivide(m, 2), view({ at: [386, 100], scale: 34 }), { width: 0.35 }),
  );
};
