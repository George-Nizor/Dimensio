// The Shape Keys panel in the Object Data tab after two clicks on its plus button: Basis, then a
// key renamed squash, which is selected, with its Value at 0. The plus button is picked out.
import { field, checkbox } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from './sackkit.mjs';

export default (kit) => kit.svg({ width: 440, height: 230 },
  frame(kit, 14, 14, 412, 200),
  kit.text(30, 38, 'Shape Keys', { size: 13 }),
  `<rect x="30" y="50" width="330" height="70" rx="4" class="d-sunk" stroke-width="1"/>`,
  kit.text(44, 70, 'Basis', { size: 12 }),
  `<rect x="34" y="84" width="322" height="26" rx="3" class="d-ui-mark" stroke-width="1.2"/>`,
  kit.text(44, 102, 'squash', { size: 12 }),
  kit.text(300, 102, '0.000', { anchor: 'end', size: 12, cls: 'd-key-text' }),
  checkbox(kit, 318, 90, true),
  field(kit, 372, 50, 30, '+', { mark: true, size: 15 }),
  field(kit, 372, 78, 30, '-', { size: 15 }),
  checkbox(kit, 34, 136, true, 'Relative'),
  kit.text(372, 150, 'first click: Basis', { anchor: 'end', size: 12 }),
  kit.text(372, 170, 'second click: Key 1', { anchor: 'end', size: 12 }),
);
