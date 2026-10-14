// Select: with the Door slot active, Select selects every face that uses it, here the one door face.
import { view } from '../../../diagrams/mesh.mjs';
import { house, COLOURS, partOf } from './house.mjs';
import { drawPainted } from './painted.mjs';
import { slotList } from './slots.mjs';

export default (kit) => {
  const { mesh, parts } = house();
  const part = partOf(parts);
  const v = view({ at: [130, 150], scale: 44, target: [0, 0, 1.3], azimuth: 32 });
  const list = slotList(kit, 270, 60, [['Walls', COLOURS.walls], ['Roof', COLOURS.roof], ['Door', COLOURS.door]], { active: 2, editMode: true, mark: 'Select' });
  return kit.svg({ width: 490, height: 270 },
    drawPainted(kit, mesh, v, (f) => COLOURS[part(f)], { select: parts.door }),
    list.svg,
    kit.text(130, 258, 'the door face is selected', { anchor: 'middle', size: 12 }),
  );
};
