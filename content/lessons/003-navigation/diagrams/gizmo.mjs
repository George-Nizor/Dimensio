// The navigation gizmo with its Z ball picked out, and the cube seen from the top after clicking it.
import { cube, view, views, drawMesh, navGizmo, cursor } from '../../../diagrams/mesh.mjs';
import { panel } from './shapes.mjs';

export default (kit) => {
  const opening = view({ scale: 20 });
  const top = views.top({ at: [330, 100], scale: 34 });
  return kit.svg({ width: 460, height: 210 },
    navGizmo(kit, 100, 100, opening, { radius: 60, highlight: 'z' }),
    cursor(kit, 112, 60),
    kit.line(178, 100, 236, 100, { cls: 'd-mark', width: 2 }), kit.arrowhead(236, 100, 0, { size: 8 }),
    panel(kit, 250, 16, 160, 168, 'top view'),
    drawMesh(kit, cube(), top, { width: 1.8 }),
  );
};
