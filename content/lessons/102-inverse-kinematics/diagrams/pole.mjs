// A pole for the knee, seen from the side: knee.L, a bone half a metre in front of the knee with
// no parent and Deform off. In the IK constraint, Pole Target is the Armature, its Bone knee.L,
// and Pole Angle -90 degrees turns the knee to point at it.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { row } from '../../092-drivers/diagrams/animkit.mjs';
import { character, skeleton, drawBones } from '../../097-character-modelling/diagrams/charkit.mjs';
import { frame, poleBone, partMesh } from './ikkit.mjs';

export default (kit) => {
  const v = views.right({ at: [170, 260], scale: 190, target: [0, 0, 0] });
  const leg = skeleton().filter((b) => /^(thigh|shin|foot)\.L$/.test(b.name));
  const [kx, ky] = v.project([0.1175, -0.02, 0.51]);
  const [px, py] = v.project([0.1175, -0.5, 0.51]);
  return kit.svg({ width: 480, height: 290 },
    frame(kit, 14, 14, 230, 262),
    drawMesh(kit, partMesh(character(), ['hips', 'thigh.L', 'shin.L', 'foot.L']), v, { cls: 'd-guide', width: 0.6 }),
    drawBones(kit, v, [...leg, poleBone('.L')], { marked: ['knee.L'] }),
    kit.line(kx, ky, px, py, { cls: 'd-mark', width: 1.2, dash: '4 4' }),
    kit.text(px + 10, py - 14, 'knee.L', { size: 12 }),
    frame(kit, 258, 60, 208, 116),
    row(kit, 260, 74, 86, 110, 'Pole Target', 'Armature'),
    row(kit, 260, 102, 86, 110, 'Bone', 'knee.L', { mark: true }),
    row(kit, 260, 130, 86, 110, 'Pole Angle', '-90°', { mark: true }),
    kit.text(260, 214, 'knee.L: no parent,', { size: 12 }),
    kit.text(260, 234, 'Deform unticked', { size: 12 }),
  );
};
