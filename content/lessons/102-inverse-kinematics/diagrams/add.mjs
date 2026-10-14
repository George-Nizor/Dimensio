// Adding the constraint in Pose Mode: foot.L clicked first, then shin.L with Shift held, so the
// shin is active. Shift+I opens Add IK, with Target Selected Bone picked out.
import { keycap } from '../../../diagrams/mesh.mjs';
import { menu } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from './ikkit.mjs';

export default (kit) => kit.svg({ width: 470, height: 230 },
  frame(kit, 14, 14, 190, 96),
  kit.text(26, 36, 'selected bones', { size: 13 }),
  `<rect x="22" y="46" width="174" height="22" rx="3" class="d-paper" stroke-width="1"/>`,
  kit.text(32, 61, '1. foot.L', { size: 12 }),
  `<rect x="22" y="74" width="174" height="22" rx="3" class="d-ui-mark" stroke-width="1.2"/>`,
  kit.text(32, 89, '2. shin.L (active)', { size: 12 }),
  keycap(kit, 110, 150, 'Shift+I', { size: 13 }),
  menu(kit, 240, 30, ['Target Selected Bone', 'Target Selected Object'], { w: 210, mark: 'Target Selected Bone', title: 'Add IK' }),
  kit.text(240, 150, 'the shin turns yellow:', { size: 12 }),
  kit.text(240, 170, 'it has an IK constraint', { size: 12 }),
);
