// The selection order for binding: Character clicked first, then Armature with Shift held, so the
// armature is the active object. Ctrl+P then offers Armature Deform, and With Automatic Weights is
// picked out.
import { keycap } from '../../../diagrams/mesh.mjs';
import { menu } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => kit.svg({ width: 480, height: 330 },
  frame(kit, 14, 14, 190, 96),
  kit.text(26, 36, 'Outliner', { size: 13 }),
  `<rect x="22" y="46" width="174" height="22" rx="3" class="d-paper" stroke-width="1"/>`,
  kit.text(32, 61, '1. Character', { size: 12 }),
  `<rect x="22" y="74" width="174" height="22" rx="3" class="d-ui-mark" stroke-width="1.2"/>`,
  kit.text(32, 89, '2. Armature (active)', { size: 12 }),
  keycap(kit, 110, 150, 'Ctrl+P', { size: 13 }),
  menu(kit, 226, 14, ['Object', 'Object (Keep Transform)', 'Armature Deform', '   With Empty Groups', '   With Envelope Weights', '   With Automatic Weights', 'Bone'], { w: 240, mark: '   With Automatic Weights', title: 'Set Parent To' }),
);
