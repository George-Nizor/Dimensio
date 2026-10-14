// Creases. Left, the cube with its four top edges creased to 1 with Shift+E. Right, under
// Subdivision Surface at level 2 the top rim stays sharp while the rest rounds off.
import { cube, edgesWhere, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { subdivide, panel, pageArrow } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const m = cube();
  const top = edgesWhere(m, (a, b) => a[2] > 0.9 && b[2] > 0.9);
  return kit.svg({ width: 500, height: 220 },
    panel(kit, 14, 14, 200, 170, 'top edges creased'),
    drawMesh(kit, m, view({ at: [114, 104], scale: 34 }), { width: 1.4, select: { edges: top } }),
    keycap(kit, 250, 70, 'Shift+E', { size: 11 }),
    pageArrow(kit, 226, 104, 274, 104),
    panel(kit, 286, 14, 200, 170, 'level 2'),
    drawMesh(kit, subdivide(m, 2, { creases: top }), view({ at: [386, 104], scale: 34 }), { width: 0.5 }),
  );
};
