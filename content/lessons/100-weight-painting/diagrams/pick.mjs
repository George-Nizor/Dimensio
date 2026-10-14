// Picking a bone's group: Alt and a left click on the upper arm bone selects it and makes its
// vertex group active, so the mesh shows that bone's weights.
import { keycap, mouse } from '../../../diagrams/mesh.mjs';
import { shoulder, frame } from './shoulder.mjs';

export default (kit) => kit.svg({ width: 460, height: 230 },
  frame(kit, 14, 14, 300, 200),
  shoulder(kit, 120, 70, { weights: [0, 0.35, 0.7, 1, 1, 1, 1, 1] }),
  kit.line(132, 70, 254, 70, { cls: 'd-mark', width: 4 }),
  kit.dot(132, 70, { r: 4, cls: 'd-mark-fill' }),
  kit.text(210, 160, 'upper_arm.L: its weights', { anchor: 'middle', size: 12 }),
  keycap(kit, 360, 70, 'Alt', { size: 14 }),
  kit.text(390, 76, '+', { anchor: 'middle', size: 14 }),
  mouse(kit, 420, 76, { button: 'left', size: 0.6 }),
  kit.text(390, 150, 'select a bone', { anchor: 'middle', size: 12 }),
);
