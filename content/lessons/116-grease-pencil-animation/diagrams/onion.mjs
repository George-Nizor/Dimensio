// Onion skinning on frame 4: the flame being drawn in ink, the drawing before (frame 1) as a green
// ghost and the drawing after (frame 7) as a blue ghost, as Blender colours them.
import { flame } from './flame.mjs';

export default (kit) => kit.svg({ width: 360, height: 230 },
  `<rect x="20" y="16" width="320" height="180" rx="6" class="d-paper" stroke-width="1.2"/>`,
  flame(kit, 172, 182, { sway: -0.7, height: 1.3, lean: -0.1 }, { size: 40, cls: 'd-axis-y', width: 1.6, fill: '' }),
  flame(kit, 188, 182, { sway: 0.9, height: 2.1, lean: 0.15 }, { size: 40, cls: 'd-axis-z', width: 1.6, fill: '' }),
  flame(kit, 180, 182, { sway: 0.2, height: 1.7, lean: 0 }, { size: 40, width: 2.6, fill: '' }),
  kit.text(40, 216, 'before (frame 1)', { size: 12, cls: 'd-axis-y-text' }),
  kit.text(180, 216, 'frame 4', { anchor: 'middle', size: 12 }),
  kit.text(320, 216, 'after (frame 7)', { anchor: 'end', size: 12, cls: 'd-axis-z-text' }),
);
