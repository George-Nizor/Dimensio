// Baking the drape: the Cloth > Cache panel with Simulation Start 1, End 250 and Bake. To keep
// the draped shape as a plain mesh for a game, apply the Cloth modifier on a settled frame.
import { field, button, menuPath } from './helpers.mjs';

export default (kit) => kit.svg({ width: 500, height: 200 },
  `<rect x="10" y="10" width="250" height="176" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(22, 32, 'Cloth > Cache', { size: 11 }),
  field(kit, 20, 46, 230, 'Simulation Start', '1', { labelWidth: 0.55 }),
  field(kit, 20, 76, 230, 'End', '250', { labelWidth: 0.55 }),
  button(kit, 30, 116, 210, 'Bake', { on: true }),
  kit.text(30, 170, 'save the file first', { size: 11 }),
  kit.text(286, 56, 'keep the drape as a mesh:', { size: 12 }),
  kit.text(286, 80, 'go to a settled frame, then', { size: 11 }),
  menuPath(kit, 286, 92, ['Modifiers tab', 'Cloth', 'Apply'], { size: 10 }).svg,
);
