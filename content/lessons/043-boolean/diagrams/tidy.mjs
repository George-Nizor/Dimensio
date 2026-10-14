// The wall's front from the front. Left, as the Boolean leaves it: one quad and one 8-sided n-gon
// wrapped round the window. Right, after Ctrl+T then Alt+J: two quads and four triangles.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, faceNormal } from '../../037-modifiers/diagrams/modkit.mjs';
import { wallWithWindow } from './shapes.mjs';

export default (kit) => {
  const before = wallWithWindow('ngon');
  const after = wallWithWindow('tidy');
  const ngon = before.faces.map((f, i) => [f, i]).filter(([f]) => f.length > 4 && faceNormal(before, f)[1] < 0).map(([, i]) => i);
  const v1 = views.front({ at: [130, 168], scale: 50, target: [0, 0, 0] });
  const v2 = views.front({ at: [380, 168], scale: 50, target: [0, 0, 0] });
  return kit.svg({ width: 510, height: 220 },
    panel(kit, 14, 14, 232, 180, 'an 8-sided n-gon'),
    drawMesh(kit, before, v1, { width: 1.6, select: { faces: ngon } }),
    panel(kit, 264, 14, 232, 180, 'after Ctrl+T, then Alt+J'),
    drawMesh(kit, after, v2, { width: 1.6 }),
  );
};
