// Rotating with R: the left upper arm turned up from its rest position (faint). The forearm, its
// child, goes with it without being touched.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character, drawBones, frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const rest = character();
  const posed = character({ 'upper_arm.L': [[0, 1, 0], -45] });
  const v = views.front({ at: [190, 156], scale: 100, target: [0, 0, 0.95] });
  const arm = (b) => b.name.endsWith('.L') && b.name.includes('arm');
  return kit.svg({ width: 460, height: 290 },
    frame(kit, 14, 14, 432, 262),
    drawMesh(kit, rest.mesh, v, { cls: 'd-guide', width: 0.5 }),
    drawMesh(kit, posed.mesh, v, { width: 0.9 }),
    drawBones(kit, v, posed.bones.filter(arm), { marked: ['upper_arm.L'] }),
    kit.text(310, 236, 'R: upper_arm.L', { size: 12 }),
    kit.text(310, 256, 'forearm.L follows', { size: 12 }),
  );
};
