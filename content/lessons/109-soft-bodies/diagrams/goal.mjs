// The Physics tab after clicking Soft Body: the Goal panel's checkbox, ticked by default, is
// unticked so the cube can fall.
import { button, checkbox } from './helpers.mjs';

export default (kit) => kit.svg({ width: 440, height: 200 },
  `<rect x="10" y="10" width="290" height="180" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(22, 32, 'Physics tab, Cube', { size: 11 }),
  button(kit, 22, 44, 130, 'Soft Body', { on: true }),
  ['Object', 'Simulation', 'Cache'].map((name, i) => [`<rect x="20" y="${78 + i * 26}" width="270" height="22" rx="4" class="d-sunk" stroke-width="1"/>`, kit.text(30, 93 + i * 26, `>  ${name}`, { size: 11 })]),
  `<rect x="20" y="156" width="270" height="24" rx="4" class="d-ui-mark" stroke-width="1"/>`,
  checkbox(kit, 30, 161, 'Goal', false),
  kit.text(310, 172, 'untick Goal', { size: 12, cls: 'd-tag' }),
);
