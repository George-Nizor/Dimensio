// Bake to Keyframes with the six crates selected: the menu path, the frame range from 1 to 120
// and Frame Step 1, and the result, a key on every frame for each crate.
import { menuPath, field, timeline } from './helpers.mjs';

export default (kit) => {
  const t = timeline(kit, 40, 196, 440, { start: 1, end: 41, keys: Array.from({ length: 41 }, (_, i) => i + 1), labels: [[1, '1'], [41, '...']] });
  return kit.svg({ width: 520, height: 240 },
    menuPath(kit, 20, 14, ['Object', 'Rigid Body', 'Bake to Keyframes']).svg,
    `<rect x="20" y="52" width="250" height="100" rx="6" class="d-ui" stroke-width="1"/>`,
    field(kit, 26, 62, 238, 'Start Frame', '1', { labelWidth: 0.5 }),
    field(kit, 26, 90, 238, 'End Frame', '120', { on: true, labelWidth: 0.5 }),
    field(kit, 26, 118, 238, 'Frame Step', '1', { labelWidth: 0.5 }),
    kit.text(300, 90, 'each crate: a key on', { size: 12 }),
    kit.text(300, 108, 'every frame, and no', { size: 12 }),
    kit.text(300, 126, 'rigid body any more', { size: 12 }),
    kit.text(40, 172, 'Crate.001 in the Timeline', { size: 11 }),
    t.svg,
  );
};
