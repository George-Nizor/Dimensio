// Baking a fluid: the domain's Cache panel with Type set to All, the frame range, and Bake All.
// Replay, the default, only stores frames as they play.
import { field, button } from './helpers.mjs';

export default (kit) => kit.svg({ width: 480, height: 200 },
  `<rect x="10" y="10" width="270" height="180" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(22, 32, 'Domain: Fluid > Cache', { size: 11 }),
  field(kit, 20, 46, 250, 'Frame Start', '1', { labelWidth: 0.45 }),
  field(kit, 20, 74, 250, 'End', '120', { labelWidth: 0.45 }),
  field(kit, 20, 102, 250, 'Type', 'All', { on: true, labelWidth: 0.45 }),
  button(kit, 30, 140, 230, 'Bake All', { on: true }),
  kit.text(300, 80, 'Type Replay, the default,', { size: 12 }),
  kit.text(300, 100, 'only stores frames as', { size: 12 }),
  kit.text(300, 120, 'you play them.', { size: 12 }),
);
