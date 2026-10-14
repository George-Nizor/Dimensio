// The front wheel from the right (Numpad 3), close up. One face of the wheel is picked out. After
// R X 90 the wheel has turned a quarter round its own origin, and the body has not moved.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { closeUp, originDot } from './helpers.mjs';
import { car } from './shapes.mjs';

export default (kit) => {
  const before = car();
  const after = car({ turn: { 'Wheel FR': 90 } });
  const m = before.mesh;
  // A triangle of the wheel's outer cap, near its top: it keeps its index when the wheel turns.
  const pick = before.ranges['Wheel FR'].filter((f) => m.faces[f].length === 3 && m.faces[f].every((i) => m.verts[i][0] > 0.9) && m.faces[f].some((i) => m.verts[i][2] > 0.68));
  const hubAt = [0.95, -1.15, 0.35];
  const left = views.right({ at: [126, 126], scale: 150, target: hubAt });
  const right = views.right({ at: [386, 126], scale: 150, target: hubAt });
  const hub = right.project(hubAt);
  return kit.svg({ width: 510, height: 240 },
    closeUp(kit, 'd016-wheel-spin-a', 14, 14, 224, 190, 'before', drawMesh(kit, m, left, { width: 1.3, select: { faces: pick.slice(0, 1) } }), originDot(kit, left, hubAt)),
    closeUp(kit, 'd016-wheel-spin-b', 272, 14, 224, 190, 'after R X 90', drawMesh(kit, after.mesh, right, { width: 1.3, select: { faces: pick.slice(0, 1) } }), originDot(kit, right, hubAt),
      kit.arcArrow(hub[0] + 8, hub[1] - 72, hub[0] - 72, hub[1] - 6, { lift: 26 })),
  );
};
