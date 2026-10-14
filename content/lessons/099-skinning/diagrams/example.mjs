// The bound character posed in Pose Mode: the left arm lowered, the right arm raised and the left
// leg stepping forward. The mesh follows its bones.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character, drawBones } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const pose = {
    'upper_arm.L': [[0, 1, 0], 55],
    'forearm.L': [[0, 1, 0], 20],
    'upper_arm.R': [[0, 1, 0], 30],
    'thigh.L': [[1, 0, 0], -35],
    'shin.L': [[1, 0, 0], 30],
  };
  const c = character(pose);
  const v = views.front({ at: [240, 150], scale: 130, target: [0, 0, 0.9] });
  return kit.svg({ width: 480, height: 290 },
    drawMesh(kit, c.mesh, v, { width: 0.8 }),
    drawBones(kit, v, c.bones),
  );
};
