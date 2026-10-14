// Testing the legs from the side. Left, the rest pose. Right, the hips moved 0.3 m down with G and
// Z: both feet stay flat on the floor and the knees bend forward.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character, drawBones } from '../../097-character-modelling/diagrams/charkit.mjs';
import { legIK, frame } from './ikkit.mjs';

export default (kit) => {
  const cell = (x, drop, label) => {
    const pose = drop ? { ...legIK('.L', drop), ...legIK('.R', drop) } : {};
    const c = character(pose, { move: { hips: [0, 0, -drop] } });
    const v = views.right({ at: [x + 110, 262], scale: 128, target: [0, 0, 0] });
    const [, gy] = v.project([0, 0, 0]);
    return [
      frame(kit, x, 14, 220, 270, label),
      kit.line(x + 14, gy, x + 206, gy, { cls: 'd-guide', width: 1.2 }),
      drawMesh(kit, c.mesh, v, { width: 0.7 }),
      drawBones(kit, v, c.bones.filter((b) => b.name === 'hips'), { marked: drop ? ['hips'] : [] }),
    ];
  };
  return kit.svg({ width: 470, height: 310 },
    cell(14, 0, 'rest pose'),
    cell(240, 0.3, 'hips down 0.3 m'),
  );
};
