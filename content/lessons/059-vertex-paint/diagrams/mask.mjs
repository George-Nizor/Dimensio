// Face mask on: the lower canopy's faces selected with L, ready to fill. The keys 1 (face mask)
// and L (select the part under the mouse) beside it.
import { view, keycap, cursor } from '../../../diagrams/mesh.mjs';
import { tree, drawPainted } from './parts.mjs';

export default (kit) => {
  const { mesh, part } = tree();
  const v = view({ azimuth: 30, elevation: 14, scale: 74, at: [140, 116], target: [0, 0, 1.3] });
  return kit.svg({ width: 420, height: 240 },
    drawPainted(kit, mesh, v, (i) => (part(i) === 'low' ? 'd-face-sel' : null), { width: 1 }),
    cursor(kit, 168, 130),
    keycap(kit, 300, 70, '1'), kit.text(330, 75, 'face mask', { size: 12 }),
    keycap(kit, 300, 130, 'L'), kit.text(330, 135, 'pick a part', { size: 12 }),
    keycap(kit, 300, 190, 'Alt+A', { size: 12 }), kit.text(338, 195, 'clear', { size: 12 }),
  );
};
