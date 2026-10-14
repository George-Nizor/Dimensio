// An action named in Blender's Action Editor, walk-loop, arrives in Godot's AnimationPlayer as
// walk, set to loop. The -loop ending is a hint Godot reads and removes.
import { push, loopSign } from './helpers.mjs';

export default (kit) => kit.svg({ width: 500, height: 150 },
  kit.text(20, 30, 'Blender, Action Editor', { size: 12 }),
  `<rect x="20" y="42" width="190" height="26" rx="4" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(32, 60, 'walk-loop', { size: 12 }),
  `<rect x="20" y="78" width="190" height="26" rx="4" class="d-ui" stroke-width="1"/>`,
  kit.text(32, 96, 'idle-loop', { size: 12 }),
  push(kit, 224, 74, 286, 74, { width: 2 }),
  kit.text(300, 30, 'Godot, AnimationPlayer', { size: 12 }),
  `<rect x="300" y="42" width="180" height="26" rx="4" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(312, 60, 'walk', { size: 12 }), loopSign(kit, 452, 55),
  `<rect x="300" y="78" width="180" height="26" rx="4" class="d-ui" stroke-width="1"/>`,
  kit.text(312, 96, 'idle', { size: 12 }), loopSign(kit, 452, 91),
  kit.text(390, 130, 'loops, named without -loop', { anchor: 'middle', size: 11 }),
);
