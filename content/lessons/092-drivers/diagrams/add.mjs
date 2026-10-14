// The Object tab's Transform panel. The mouse is over the Y field under Rotation, which is picked
// out, with Ctrl+D beside it: the key that adds a driver to the field under the mouse.
import { cursor, keycap } from '../../../diagrams/mesh.mjs';
import { frame, row } from './animkit.mjs';

export default (kit) => {
  const x = 20;
  const rows = [
    ['Location X', '0 m'], ['Y', '0.68 m'], ['Z', '-0.35 m'],
    ['Rotation X', '0°'], ['Y', '0°', true], ['Z', '0°'],
    ['Mode', 'XYZ Euler'],
  ];
  return kit.svg({ width: 460, height: 250 },
    frame(kit, 14, 14, 300, 222),
    kit.text(30, 36, 'Transform', { size: 13 }),
    rows.map(([label, value, mark], i) => row(kit, x, 48 + i * 25 + (i >= 3 ? 8 : 0) + (i >= 6 ? 8 : 0), 100, 180, label, value, { mark })),
    cursor(kit, 222, 48 + 4 * 25 + 8 + 10),
    keycap(kit, 380, 132, 'Ctrl+D', { size: 14 }),
    kit.text(380, 170, 'add a driver', { anchor: 'middle', size: 12 }),
  );
};
