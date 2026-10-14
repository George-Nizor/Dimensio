// The house block with three materials in three slots: pale walls, a red roof and a dark door. The
// slot list beside it holds Walls, Roof and Door.
import { view } from '../../../diagrams/mesh.mjs';
import { house, COLOURS, partOf } from './house.mjs';
import { drawPainted } from './painted.mjs';
import { slotList } from './slots.mjs';

export default (kit) => {
  const { mesh, parts } = house();
  const part = partOf(parts);
  const v = view({ at: [140, 160], scale: 48, target: [0, 0, 1.3], azimuth: 32 });
  const list = slotList(kit, 290, 70, [['Walls', COLOURS.walls], ['Roof', COLOURS.roof], ['Door', COLOURS.door]], { active: 1 });
  return kit.svg({ width: 500, height: 290 },
    drawPainted(kit, mesh, v, (f) => COLOURS[part(f)]),
    list.svg,
    kit.text(290, 58, 'three slots, one object', { size: 12 }),
  );
};
