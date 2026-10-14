// Wrong: pressing G on the linked barrel, which stays where the library put it. Right: the same
// barrel after Make Library Override, moving with G.
import { view, cylinder, drawMesh, translate, keycap, arrow } from '../../../diagrams/mesh.mjs';
import { chain } from './files.mjs';

export default (kit) => {
  const barrel = cylinder({ vertices: 12, radius: 0.35, depth: 0.9, center: [0, 0, 0.45] });
  const left = view({ scale: 90, at: [110, 150] });
  const right = view({ scale: 90, at: [330, 150] });
  return kit.svg({ width: 500, height: 240 },
    drawMesh(kit, barrel, left, { width: 1.6 }),
    chain(kit, 110, 50, { cls: 'd-bad' }),
    keycap(kit, 190, 60, 'G', { size: 12 }),
    kit.tag(110, 226, 'linked, not editable', { tone: 'bad' }),
    drawMesh(kit, barrel, right, { width: 1.0, cls: 'd-guide', mode: 'wire' }),
    drawMesh(kit, translate(barrel, [1.4, 0, 0]), right, { width: 1.6 }),
    arrow(kit, right, [0.4, 0, 0.45], [1.0, 0, 0.45]),
    keycap(kit, 470, 60, 'G', { size: 12 }),
    kit.tag(380, 226, 'overridden, moves'),
  );
};
