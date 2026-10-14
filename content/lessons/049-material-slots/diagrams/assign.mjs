// Edit Mode: both roof faces selected, the Roof slot active, and Assign picked out. The roof has
// taken the roof material; the rest of the house still wears the first slot's.
import { view } from '../../../diagrams/mesh.mjs';
import { house, COLOURS, partOf } from './house.mjs';
import { drawPainted } from './painted.mjs';
import { slotList } from './slots.mjs';

export default (kit) => {
  const { mesh, parts } = house();
  const part = partOf(parts);
  const v = view({ at: [130, 150], scale: 44, target: [0, 0, 1.3], azimuth: 32 });
  const list = slotList(kit, 270, 60, [['Walls', COLOURS.walls], ['Roof', COLOURS.roof], ['Door', COLOURS.door]], { active: 1, editMode: true, mark: 'Assign' });
  return kit.svg({ width: 490, height: 270 },
    drawPainted(kit, mesh, v, (f) => (part(f) === 'roof' ? COLOURS.roof : COLOURS.walls), { select: parts.roof }),
    list.svg,
    kit.text(130, 258, 'roof faces selected, then Assign', { anchor: 'middle', size: 12 }),
  );
};
