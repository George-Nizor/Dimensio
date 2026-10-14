// Left, the cube with its top front edge selected. Right, after Ctrl+B: a narrow flat face, a
// chamfer, where the sharp edge was.
import { cube, view, drawMesh, edgesWhere, keycap } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';
import { edgeBevel } from './shapes.mjs';

export default (kit) => {
  const m = cube();
  const edge = edgesWhere(m, (a, b) => a[1] < -0.9 && b[1] < -0.9 && a[2] > 0.9 && b[2] > 0.9);
  const { mesh, chamfer } = edgeBevel(0.4);
  const left = view({ at: [126, 104], scale: 46 });
  const right = view({ at: [414, 104], scale: 46 });
  return kit.svg({ width: 540, height: 230 },
    panel(kit, 14, 14, 224, 180, 'edge selected'),
    drawMesh(kit, m, left, { width: 1.5, select: { edges: edge } }),
    keycap(kit, 270, 104, 'Ctrl+B', { size: 10 }),
    panel(kit, 302, 14, 224, 180, 'after the bevel'),
    drawMesh(kit, mesh, right, { width: 1.5, select: { faces: [chamfer] } }),
  );
};
