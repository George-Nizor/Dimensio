// Copy and paste flipped: the left arm's wave copied with Ctrl+C, then pasted with Shift+Ctrl+V
// onto the bones of the same name with .R, so the right arm waves instead.
import { views, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { character, drawBones, frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const left = { 'upper_arm.L': [[0, 1, 0], -60], 'forearm.L': [[0, 1, 0], -60] };
  const right = { 'upper_arm.R': [[0, 1, 0], 60], 'forearm.R': [[0, 1, 0], 60] };
  const cell = (x, pose, marked, key) => {
    const c = character(pose);
    const v = views.front({ at: [x + 110, 150], scale: 92, target: [0, 0, 1] });
    return [
      frame(kit, x, 14, 220, 230),
      drawMesh(kit, c.mesh, v, { width: 0.7 }),
      drawBones(kit, v, c.bones.filter((b) => marked.includes(b.name)), { marked }),
      keycap(kit, x + 110, 266, key, { size: 13 }),
    ];
  };
  return kit.svg({ width: 480, height: 290 },
    cell(14, left, ['upper_arm.L', 'forearm.L'], 'Ctrl+C'),
    cell(246, right, ['upper_arm.R', 'forearm.R'], 'Shift+Ctrl+V'),
  );
};
