// The bowl before Solidify: a UV sphere with the vertices of its top half deleted, an open surface
// with no thickness.
import { uvSphere, view, drawMesh, vertsWhere, views } from '../../../diagrams/mesh.mjs';
import { panel, pageArrow } from '../../037-modifiers/diagrams/modkit.mjs';
import { openBowl, twoSided } from './shapes.mjs';

export default (kit) => {
  const s = uvSphere({ segments: 16, rings: 8, radius: 1 });
  return kit.svg({ width: 500, height: 220 },
    panel(kit, 14, 14, 200, 170, 'select the top half, X'),
    drawMesh(kit, s, views.front({ at: [114, 100], scale: 62 }), { width: 1, select: { verts: vertsWhere(s, (p) => p[2] > 1e-6) } }),
    pageArrow(kit, 226, 99, 274, 99),
    panel(kit, 286, 14, 200, 170, 'an open bowl'),
    drawMesh(kit, twoSided(openBowl(1)), view({ at: [386, 66], scale: 62, elevation: 38, target: [0, 0, 0.6] }), { width: 1 }),
  );
};
