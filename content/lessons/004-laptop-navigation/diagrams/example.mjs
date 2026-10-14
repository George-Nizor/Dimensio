// A laptop keyboard and touchpad: the number row's 1, 3 and 7 stand in for the numpad, and two
// fingers drag on the touchpad to orbit.
import { keyboard, touchpad } from './laptop.mjs';

export default (kit) => {
  const kb = keyboard(kit, 30, 20, { k: 30, mark: ['1', '3', '7'] });
  return kit.svg({ width: 520, height: 330 },
    `<rect x="14" y="8" width="492" height="314" rx="14" class="d-ui" stroke-width="1.2"/>`,
    kb.svg,
    touchpad(kit, 180, 222, 160, 88, { fingers: [[0.36, 0.5], [0.52, 0.5]] }),
    kit.arcArrow(226, 284, 300, 250, { lift: -16 }),
  );
};
