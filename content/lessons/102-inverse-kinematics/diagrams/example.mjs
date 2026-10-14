// IK on both legs, seen from the side: the hips lowered 0.3 m and the feet still flat where they
// were, the knees bent forward towards the pole bones in front of them. The thigh and shin of the
// near leg, the IK chain, are picked out.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character, drawBones } from '../../097-character-modelling/diagrams/charkit.mjs';
import { legIK, poleBone } from './ikkit.mjs';

export default (kit) => {
  const pose = { ...legIK('.L', 0.3), ...legIK('.R', 0.3) };
  const c = character(pose, { move: { hips: [0, 0, -0.3] } });
  const v = views.right({ at: [250, 270], scale: 150, target: [0, 0, 0] });
  const legs = c.bones.filter((b) => /^(thigh|shin|foot)/.test(b.name));
  const [, gy] = v.project([0, 0, 0]);
  return kit.svg({ width: 480, height: 300 },
    kit.line(60, gy, 440, gy, { cls: 'd-guide', width: 1.4 }),
    drawMesh(kit, c.mesh, v, { cls: 'd-guide', width: 0.6 }),
    drawBones(kit, v, [...legs, poleBone('.L')], { marked: ['thigh.L', 'shin.L'] }),
    kit.text(v.project([0, -0.62, 0.51])[0] - 6, v.project([0, -0.62, 0.51])[1] - 14, 'pole', { anchor: 'middle', size: 12 }),
    kit.text(v.project([0, -0.2, 0])[0], gy + 18, 'foot: the target', { anchor: 'middle', size: 12 }),
  );
};
