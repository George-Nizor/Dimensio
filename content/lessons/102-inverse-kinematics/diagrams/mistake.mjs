// The same foot lifted forward, seen from the side. Wrong: Chain Length 0, so the IK reaches up
// through the thigh and hips and the whole body tips over. Right: Chain Length 2, so only the thigh
// and shin bend and the body stays upright.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character } from '../../097-character-modelling/diagrams/charkit.mjs';
import { frame } from './ikkit.mjs';

export default (kit) => {
  const cell = (x, pose, tag, tone, label) => {
    const v = views.right({ at: [x + 122, 252], scale: 112, target: [0, 0, 0] });
    const [, gy] = v.project([0, 0, 0]);
    return [
      frame(kit, x, 14, 244, 262),
      kit.text(x + 122, 36, label, { anchor: 'middle', size: 12 }),
      kit.line(x + 14, gy, x + 230, gy, { cls: 'd-guide', width: 1.2 }),
      drawMesh(kit, character(pose).mesh, v, { width: 0.7 }),
      kit.tag(x + 122, 300, tag, { tone }),
    ];
  };
  const tipped = { hips: [[1, 0, 0], 28], 'thigh.L': [[1, 0, 0], -40], 'shin.L': [[1, 0, 0], 30] };
  const bent = { 'thigh.L': [[1, 0, 0], -60], 'shin.L': [[1, 0, 0], 70], 'foot.L': [[1, 0, 0], -10] };
  return kit.svg({ width: 520, height: 314 },
    cell(12, tipped, 'Chain Length 0', 'bad', 'the body tips over'),
    cell(264, bent, 'Chain Length 2', 'mark', 'only the leg bends'),
  );
};
