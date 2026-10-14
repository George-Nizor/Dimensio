// The default cube with a Bevel and a Subdivision Surface modifier. Left, the mesh you edit, still
// eight vertices. Right, what the viewport shows: the cube bevelled, then subdivided twice.
import { cube, bevelledBox, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { subdivide, panel, pageArrow } from './modkit.mjs';

export default (kit) => {
  const shown = subdivide(bevelledBox({ size: [2, 2, 2], width: 0.1 }), 2);
  return kit.svg({ width: 500, height: 220 },
    panel(kit, 14, 14, 200, 170, 'the mesh: a cube'),
    drawMesh(kit, cube(), view({ at: [114, 104], scale: 36 }), { mode: 'xray', width: 1.6 }),
    pageArrow(kit, 226, 99, 274, 99),
    panel(kit, 286, 14, 200, 170, 'what you see'),
    drawMesh(kit, shown, view({ at: [386, 104], scale: 36 }), { width: 0.5 }),
  );
};
