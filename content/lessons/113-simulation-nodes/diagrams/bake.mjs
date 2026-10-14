// Baking the zone: the Physics tab's Simulation Nodes panel with Calculate to Frame and Bake,
// for the selected spout. The file must be saved first.
import { button } from './helpers.mjs';

export default (kit) => kit.svg({ width: 480, height: 170 },
  `<rect x="10" y="10" width="270" height="150" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(22, 32, 'Physics tab, Spout', { size: 11 }),
  `<rect x="20" y="42" width="250" height="22" rx="4" class="d-sunk" stroke-width="1"/>`,
  kit.text(30, 57, 'Simulation Nodes', { size: 11 }),
  button(kit, 30, 74, 230, 'Calculate to Frame'),
  button(kit, 30, 104, 230, 'Bake', { on: true }),
  kit.text(300, 70, 'save the file first:', { size: 12 }),
  kit.text(300, 90, 'the bake is stored', { size: 12 }),
  kit.text(300, 110, 'beside it', { size: 12 }),
);
