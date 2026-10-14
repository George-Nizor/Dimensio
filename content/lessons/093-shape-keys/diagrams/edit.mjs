// Editing the squash key in Edit Mode: the sack's vertices, all selected, moved down and out from
// the Basis (dashed) to the squashed shape (solid). The vertex count stays the same.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { pageArrow } from '../../092-drivers/diagrams/animkit.mjs';
import { sack, frame } from './sackkit.mjs';

export default (kit) => {
  const v = views.front({ at: [230, 200], scale: 72 });
  const moved = sack(1);
  return kit.svg({ width: 460, height: 250 },
    frame(kit, 14, 14, 432, 214),
    kit.text(30, 38, 'Edit Mode, squash selected in the list', { size: 12 }),
    drawMesh(kit, sack(0), v, { mode: 'wire', cls: 'd-guide', width: 1 }),
    drawMesh(kit, moved, v, { mode: 'xray', width: 1.3, select: { verts: moved.verts.map((_, i) => i) } }),
    pageArrow(kit, 230, 60, 230, 92),
    pageArrow(kit, 118, 150, 86, 150),
    pageArrow(kit, 342, 150, 374, 150),
    kit.text(420, 206, 'S Z, then S Shift+Z', { anchor: 'end', size: 12 }),
  );
};
