// The left arm and leg bones with their names, each ending in .L: upper_arm.L and forearm.L, then
// thigh.L, shin.L and foot.L. Below, the Bone tab's name field with forearm.L typed in.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { field } from '../../092-drivers/diagrams/animkit.mjs';
import { character, skeleton, drawBones, frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const v = views.front({ at: [150, 140], scale: 120, target: [0, 0, 0.9] });
  const bones = skeleton().filter((b) => b.name.endsWith('.L'));
  const p = (q) => v.project(q);
  const label = (q, text, dx = 12, dy = -8) => kit.text(p(q)[0] + dx, p(q)[1] + dy, text, { size: 12 });
  return kit.svg({ width: 480, height: 290 },
    frame(kit, 14, 14, 452, 262),
    drawMesh(kit, character().mesh, v, { cls: 'd-guide', width: 0.6 }),
    drawBones(kit, v, bones, { marked: ['forearm.L'] }),
    label([0.3, 0, 1.38], 'upper_arm.L', -20, -22),
    label([0.64, 0, 1.38], 'forearm.L', 0, 28),
    label([0.12, 0, 0.72], 'thigh.L', 20, 0),
    label([0.12, 0, 0.3], 'shin.L', 20, 0),
    label([0.12, -0.1, 0.06], 'foot.L', 20, 4),
    kit.text(300, 200, 'Bone tab', { size: 13 }),
    field(kit, 300, 214, 150, 'forearm.L', { mark: true, anchor: 'start' }),
  );
};
