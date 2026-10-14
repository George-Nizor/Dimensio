// What binding adds to the mesh: an Armature modifier whose Object is the Armature, and in the
// Object Data tab a vertex group named after each deforming bone. upper_arm.L is selected.
import { row, field } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const groups = ['hips', 'spine', 'chest', 'neck', 'head', 'upper_arm.L', 'forearm.L', '...'];
  return kit.svg({ width: 480, height: 270 },
    frame(kit, 14, 14, 216, 120),
    kit.text(28, 38, 'Armature modifier', { size: 13 }),
    row(kit, 20, 52, 70, 130, 'Object', 'Armature', { mark: true }),
    row(kit, 20, 84, 70, 130, 'Bind to', 'Vertex Groups'),
    frame(kit, 246, 14, 220, 242),
    kit.text(260, 38, 'Vertex Groups', { size: 13 }),
    groups.map((g, i) => field(kit, 256, 48 + i * 25, 200, g, { anchor: 'start', mark: g === 'upper_arm.L' })),
    kit.text(28, 170, 'one group per bone,', { size: 12 }),
    kit.text(28, 190, 'named after it, holding', { size: 12 }),
    kit.text(28, 210, 'a weight from 0 to 1', { size: 12 }),
    kit.text(28, 230, 'for each vertex', { size: 12 }),
  );
};
