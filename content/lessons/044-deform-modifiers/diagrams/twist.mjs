// Simple Deform in Twist mode, Axis Z, Angle 90 degrees, on a column with loop cuts up its height.
// Each loop turns a little further than the one below it.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, pageArrow } from '../../037-modifiers/diagrams/modkit.mjs';
import { column } from './shapes.mjs';

export default (kit) => kit.svg({ width: 460, height: 240 },
  panel(kit, 14, 14, 190, 200, 'loop cuts'),
  drawMesh(kit, column(0), view({ at: [109, 192], scale: 52, target: [0, 0, 0] }), { width: 1.2 }),
  pageArrow(kit, 214, 114, 246, 114),
  panel(kit, 256, 14, 190, 200, 'Twist, Axis Z, 90°'),
  drawMesh(kit, column(90), view({ at: [351, 192], scale: 52, target: [0, 0, 0] }), { width: 1.2 }),
);
