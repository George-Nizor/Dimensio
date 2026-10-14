// The Apply menu from Ctrl+A in Object Mode with All Transforms picked out, used with the mesh and
// the armature both selected. Afterwards both read Scale 1, 1, 1.
import { keycap } from '../../../diagrams/mesh.mjs';
import { menu, row } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => kit.svg({ width: 460, height: 240 },
  keycap(kit, 60, 36, 'Ctrl+A', { size: 13 }),
  menu(kit, 20, 62, ['Location', 'Rotation', 'Scale', 'All Transforms', 'Rotation & Scale'], { w: 170, mark: 'All Transforms', title: 'Apply' }),
  frame(kit, 214, 40, 232, 160),
  kit.text(228, 62, 'Character and Armature', { size: 13 }),
  row(kit, 214, 76, 90, 130, 'Location', '0, 0, 0'),
  row(kit, 214, 104, 90, 130, 'Rotation', '0°, 0°, 0°'),
  row(kit, 214, 132, 90, 130, 'Scale', '1, 1, 1', { mark: true }),
);
