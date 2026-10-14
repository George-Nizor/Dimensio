// Marking a seam. Left, edges of the crate selected in Edit Mode. Right, after Edge > Mark Seam
// they show red.
import { view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { crate, drawSeams } from './props.mjs';

export default (kit) => {
  const { mesh: m, seams } = crate();
  const left = view({ at: [110, 120], scale: 100 });
  const right = view({ at: [380, 120], scale: 100 });
  return kit.svg({ width: 500, height: 250 },
    drawMesh(kit, m, left, { width: 1.4, select: { edges: seams } }),
    kit.text(110, 236, 'edges selected', { anchor: 'middle', size: 12 }),
    kit.line(214, 120, 274, 120, { cls: 'd-mark', width: 2 }), kit.arrowhead(274, 120, 0, { size: 8 }),
    kit.text(244, 100, 'Mark Seam', { anchor: 'middle', size: 12 }),
    drawMesh(kit, m, right, { width: 1.4 }),
    drawSeams(kit, m, right, seams),
    kit.text(380, 236, 'seams show red', { anchor: 'middle', size: 12 }),
  );
};
