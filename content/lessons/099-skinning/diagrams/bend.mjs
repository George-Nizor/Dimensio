// Testing the bind in Pose Mode, seen from the side: left, the rest pose; right, the left thigh
// turned forward with R and the shin bent back, and the mesh of the leg following both bones.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character, drawBones, frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const cell = (x, pose, label, marked) => {
    const c = character(pose);
    const v = views.right({ at: [x + 100, 150], scale: 120, target: [0, 0, 0.9] });
    return [frame(kit, x, 14, 200, 256, label), drawMesh(kit, c.mesh, v, { width: 0.9 }), drawBones(kit, v, c.bones, { marked })];
  };
  return kit.svg({ width: 460, height: 300 },
    cell(14, {}, 'rest pose', []),
    cell(246, { 'thigh.L': [[1, 0, 0], -50], 'shin.L': [[1, 0, 0], 55] }, 'thigh and shin turned', ['thigh.L', 'shin.L']),
  );
};
