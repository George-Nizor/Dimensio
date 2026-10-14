// Wrong: every face still selected from before when Assign was clicked, so the whole house turns
// red. Right: only the two roof faces selected, so only the roof is red.
import { view } from '../../../diagrams/mesh.mjs';
import { house, COLOURS, partOf } from './house.mjs';
import { drawPainted } from './painted.mjs';

export default (kit) => {
  const { mesh, parts } = house();
  const part = partOf(parts);
  const left = view({ at: [120, 140], scale: 40, target: [0, 0, 1.3], azimuth: 32 });
  const right = view({ at: [370, 140], scale: 40, target: [0, 0, 1.3], azimuth: 32 });
  return kit.svg({ width: 500, height: 250 },
    drawPainted(kit, mesh, left, () => COLOURS.roof),
    kit.tag(120, 236, 'everything selected: all red', { tone: 'bad' }),
    drawPainted(kit, mesh, right, (f) => (part(f) === 'roof' ? COLOURS.roof : part(f) === 'door' ? COLOURS.door : COLOURS.walls)),
    kit.tag(370, 236, 'only the roof selected', { tone: 'mark' }),
  );
};
