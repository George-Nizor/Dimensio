// Wrong: the upper arm bone moved in Edit Mode. The rest position changes, the mesh stays where it
// was and the bone ends up outside the arm. Right: the bone rotated in Pose Mode, and the arm's
// mesh turns with it.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character, drawBones, frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const cell = (x, c, bones, tag, tone, mode) => {
    const v = views.front({ at: [x + 96, 140], scale: 88, target: [0, 0, 0.95] });
    return [
      frame(kit, x, 14, 244, 230),
      kit.text(x + 122, 36, mode, { anchor: 'middle', size: 12 }),
      drawMesh(kit, c.mesh, v, { width: 0.7 }),
      drawBones(kit, v, bones, { marked: ['upper_arm.L', 'forearm.L'] }),
      kit.tag(x + 122, 268, tag, { tone }),
    ];
  };
  const rest = character();
  const turned = character({ 'upper_arm.L': [[0, 1, 0], -40] });
  const arm = (b) => b.name === 'upper_arm.L' || b.name === 'forearm.L';
  return kit.svg({ width: 520, height: 284 },
    cell(12, rest, turned.bones.filter(arm), 'moved in Edit Mode', 'bad', 'Edit Mode: the mesh stays'),
    cell(264, turned, turned.bones.filter(arm), 'turned in Pose Mode', 'mark', 'Pose Mode: the mesh follows'),
  );
};
