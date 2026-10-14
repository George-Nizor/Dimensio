// Pose Mode: Ctrl+Tab with the armature selected switches its mode, and the header's mode menu
// reads Pose Mode. A clicked bone, the left forearm, is selected.
import { views, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { field } from '../../092-drivers/diagrams/animkit.mjs';
import { character, drawBones, frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const c = character();
  const v = views.front({ at: [300, 160], scale: 110, target: [0, 0, 0.95] });
  return kit.svg({ width: 480, height: 290 },
    keycap(kit, 70, 60, 'Ctrl+Tab', { size: 14 }),
    field(kit, 20, 100, 110, 'Pose Mode', { mark: true }),
    kit.text(75, 140, 'the header', { anchor: 'middle', size: 12 }),
    frame(kit, 160, 14, 306, 262),
    drawMesh(kit, c.mesh, v, { cls: 'd-guide', width: 0.6 }),
    drawBones(kit, v, c.bones, { marked: ['forearm.L'] }),
  );
};
