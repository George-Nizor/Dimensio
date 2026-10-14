// The Shrinkwrap modifier with Target set to Stone sculpt, and what it does: the cut cube's
// vertices move onto the nearest point of the sculpt's surface.
import { view, drawMesh, scale } from '../../../diagrams/mesh.mjs';
import { cutCube, lowStone } from './stone.mjs';
import { propRow } from './props.mjs';

export default (kit) => {
  const a = view({ at: [270, 172], scale: 34, elevation: 24 });
  const b = view({ at: [420, 172], scale: 34, elevation: 24 });
  return kit.svg({ width: 500, height: 230 },
    `<rect x="14" y="14" width="250" height="100" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 36, 'Shrinkwrap', { size: 12 }),
    propRow(kit, 22, 48, 'Wrap Method', 'Nearest Surface Point', { width: 236, split: 0.34 }),
    propRow(kit, 22, 76, 'Target', 'Stone sculpt', { width: 236, split: 0.34, mark: true }),
    drawMesh(kit, scale(cutCube(), [1.4, 1.15, 0.95]), a, { width: 1.1 }),
    kit.line(318, 172, 368, 172, { cls: 'd-mark', width: 2 }), kit.arrowhead(370, 172, 0, { size: 8 }),
    drawMesh(kit, lowStone(), b, { width: 1.1 }),
  );
};
