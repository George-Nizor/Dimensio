// Baking. The Scene tab's Rigid Body World > Cache panel with Start, End and Bake picked out,
// and Object > Rigid Body > Bake to Keyframes, which turns the result into ordinary keys.
import { field, button, menuPath } from './helpers.mjs';

export default (kit) => kit.svg({ width: 500, height: 220 },
  `<rect x="10" y="10" width="260" height="196" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(22, 32, 'Scene tab', { size: 11 }),
  `<rect x="20" y="42" width="240" height="22" rx="4" class="d-sunk" stroke-width="1"/>`,
  kit.text(30, 57, 'Rigid Body World > Cache', { size: 11 }),
  field(kit, 20, 76, 240, 'Simulation Start', '1', { labelWidth: 0.55 }),
  field(kit, 20, 104, 240, 'End', '250', { labelWidth: 0.55 }),
  button(kit, 30, 144, 220, 'Bake', { on: true }),
  kit.text(30, 192, 'save the file first', { size: 11 }),
  kit.text(290, 60, 'for a game, keys instead', { size: 12 }),
  menuPath(kit, 290, 76, ['Object', 'Rigid Body'], { size: 10 }).svg,
  menuPath(kit, 290, 106, ['Bake to Keyframes'], { size: 10 }).svg,
  kit.text(290, 150, 'every active body gets a key', { size: 11 }),
  kit.text(290, 166, 'on each frame, and its rigid', { size: 11 }),
  kit.text(290, 182, 'body is removed', { size: 11 }),
);
