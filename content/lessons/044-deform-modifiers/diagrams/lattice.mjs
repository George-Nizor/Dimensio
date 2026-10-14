// A lattice from Lattice Deform Selected: a cage of 2 x 2 x 2 points round the object. Moving the
// lattice's top four points together in Edit Mode squeezes the top of the mesh inside it.
import { box, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { latticeCorners, latticeDeform, latticeMesh, panel, pageArrow } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const low = [-1, -1, 0];
  const high = [1, 1, 2];
  const m = box({ size: [2, 2, 2], segments: [4, 4, 4], center: [0, 0, 1] });
  const start = latticeCorners(low, high);
  const moved = start.map((p) => (p[2] > 1 ? [p[0] * 0.45, p[1] * 0.45, p[2]] : p));
  const v1 = view({ at: [114, 160], scale: 44, target: [0, 0, 0] });
  const v2 = view({ at: [386, 160], scale: 44, target: [0, 0, 0] });
  const dots = (v, pts) => pts.map((p) => kit.dot(...v.project(p), { r: 3.6, cls: 'd-mark-fill' }));
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 200, 190, 'the lattice round the mesh'),
    drawMesh(kit, m, v1, { width: 0.8 }),
    drawMesh(kit, latticeMesh(start), v1, { mode: 'wire', width: 1.4, cls: 'd-mark' }),
    dots(v1, start),
    pageArrow(kit, 226, 110, 274, 110),
    panel(kit, 286, 14, 200, 190, 'top points moved in'),
    drawMesh(kit, latticeDeform(m, low, high, moved), v2, { width: 0.8 }),
    drawMesh(kit, latticeMesh(moved), v2, { mode: 'wire', width: 1.4, cls: 'd-mark' }),
    dots(v2, moved),
  );
};
