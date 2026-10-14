// The barrel unwrapped: red seams down its back and round both ends, a test grid lying evenly on
// it, and its UV map: the side as one strip and each end as a disc.
import { view } from '../../../diagrams/mesh.mjs';
import { drawTextured, uvSquare, drawUVs } from './uv.mjs';
import { barrel, drawSeams } from './props.mjs';

export default (kit) => {
  const { mesh: m, uvs, seams } = barrel();
  const v = view({ at: [130, 150], scale: 150, target: [0, 0, 0.6], azimuth: 210, elevation: 24 });
  return kit.svg({ width: 520, height: 290 },
    drawTextured(kit, m, v, uvs, { cells: 22 }),
    drawSeams(kit, m, v, seams),
    kit.text(130, 282, 'seams in red, seen from the back', { anchor: 'middle', size: 12 }),
    uvSquare(kit, 290, 30, 210, { labels: false }),
    drawUVs(kit, uvs, 290, 30, 210),
    kit.text(395, 282, 'one strip and two discs', { anchor: 'middle', size: 12 }),
  );
};
