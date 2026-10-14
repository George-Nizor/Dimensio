// Cut Through (C): the wall drawn see-through, with the doorway cut on the front face (solid) and
// the same outline cut on the back face (dashed, behind).
import { view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { wall, back, cut, DOOR } from './wall.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 16, at: [210, 118], scale: 72, target: [0, 0, 1.25] });
  return kit.svg({ width: 500, height: 240 },
    drawMesh(kit, wall(), v, { mode: 'xray', width: 1.6 }),
    cut(kit, v, DOOR, { side: back, cls: 'd-mark', width: 1.6, dash: '5 4' }),
    cut(kit, v, DOOR, { cls: 'd-mark', width: 2.4 }),
    keycap(kit, 430, 104, 'C'),
    kit.text(430, 138, 'cut through', { anchor: 'middle', size: 12 }),
  );
};
