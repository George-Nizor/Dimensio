// Add > Armature in Object Mode: one bone standing up from the 3D cursor at the origin. Beside it,
// the Viewport Display panel of the Object Data tab with In Front ticked, so the bones show through
// the mesh.
import { views } from '../../../diagrams/mesh.mjs';
import { checkbox, row } from '../../092-drivers/diagrams/animkit.mjs';
import { drawBones, frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const v = views.front({ at: [110, 230], scale: 150, target: [0, 0, 0] });
  const [cx, cy] = v.project([0, 0, 0]);
  return kit.svg({ width: 470, height: 270 },
    frame(kit, 14, 14, 190, 240),
    kit.line(30, cy, 188, cy, { cls: 'd-guide', width: 1 }),
    drawBones(kit, v, [{ name: 'Bone', head: [0, 0, 0], tail: [0, 0, 1] }], { marked: ['Bone'] }),
    kit.circle(cx, cy, 9, { cls: 'd-bad', width: 1.6, dash: '3 3' }),
    kit.text(cx + 14, cy + 18, '3D cursor', { size: 12 }),
    frame(kit, 220, 14, 236, 150),
    kit.text(234, 38, 'Viewport Display', { size: 13 }),
    row(kit, 222, 52, 80, 130, 'Display As', 'Octahedral'),
    checkbox(kit, 302, 86, false, 'Names'),
    checkbox(kit, 302, 108, true, 'In Front', { mark: true }),
    checkbox(kit, 302, 130, false, 'Axes'),
  );
};
