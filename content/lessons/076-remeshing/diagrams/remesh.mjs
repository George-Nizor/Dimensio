// Cut through the middle. Before, the cap and stem overlap as two shells. After Ctrl+R, the voxel
// remesher gives one outside skin of even steps, with nothing left inside.
import { keycap } from '../../../diagrams/mesh.mjs';
import { capOutline, stemOutline, unionOutline, withVerts } from './section.mjs';

export default (kit) => {
  const cap = capOutline(110, 90, 80, 52);
  return kit.svg({ width: 480, height: 230 },
    kit.polyline([...cap, cap[0]], { cls: 'd-ink', width: 2 }),
    kit.polyline(stemOutline(110, 190, 70, 18), { cls: 'd-ink', width: 2 }),
    kit.text(110, 220, 'before: two shells', { anchor: 'middle', size: 12 }),
    keycap(kit, 240, 110, 'Ctrl+R'),
    withVerts(kit, unionOutline(370, 90, 80, 52, 18, 190, 11)),
    kit.text(370, 220, 'after: one even skin', { anchor: 'middle', size: 12 }),
  );
};
