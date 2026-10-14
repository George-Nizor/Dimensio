// The IK constraint in the Bone Constraints tab: Target Armature, Bone foot.L, and Chain Length
// set to 2 and picked out, so only the shin and the thigh above it bend.
import { row, field } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from './ikkit.mjs';

export default (kit) => kit.svg({ width: 440, height: 250 },
  frame(kit, 14, 14, 412, 222),
  kit.text(28, 38, 'IK', { size: 13 }),
  row(kit, 20, 50, 120, 270, 'Target', 'Armature'),
  row(kit, 20, 78, 120, 270, 'Bone', 'foot.L'),
  row(kit, 20, 106, 120, 270, 'Pole Target', ''),
  row(kit, 20, 134, 120, 120, 'Iterations', '500'),
  row(kit, 20, 162, 120, 120, 'Chain Length', '2', { mark: true }),
  kit.text(274, 178, 'shin + thigh', { size: 12 }),
  field(kit, 140, 196, 120, 'Use Tail ✓', { size: 11 }),
);
