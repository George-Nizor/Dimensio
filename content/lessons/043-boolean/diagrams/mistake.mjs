// Wrong: the cutter still drawn solid, filling the window, so the wall looks uncut. Right: the
// cutter set to Display As Wire, and the window shows.
import { box, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';
import { wallWithWindow, cutter, wallView } from './shapes.mjs';

export default (kit) => {
  const v1 = wallView([130, 108], 48);
  const v2 = wallView([380, 108], 48);
  const wall = wallWithWindow('ngon');
  return kit.svg({ width: 510, height: 250 },
    panel(kit, 14, 14, 232, 196),
    drawMesh(kit, wall, v1, { width: 1.3 }),
    drawMesh(kit, cutter(), v1, { width: 1.3 }),
    kit.tag(130, 236, 'cutter drawn solid', { tone: 'bad' }),
    panel(kit, 264, 14, 232, 196),
    drawMesh(kit, wall, v2, { width: 1.3 }),
    drawMesh(kit, cutter(), v2, { mode: 'wire', width: 1.1, cls: 'd-guide' }),
    kit.tag(380, 236, 'cutter drawn as wire'),
  );
};
