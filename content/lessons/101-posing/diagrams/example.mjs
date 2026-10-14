// The character posed in Pose Mode, waving: its left upper arm and forearm raised, its right arm
// down by its side. The bones are drawn over the mesh.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character, drawBones } from '../../097-character-modelling/diagrams/charkit.mjs';
import { WAVE } from './poses.mjs';

export default (kit) => {
  const c = character(WAVE);
  const v = views.front({ at: [240, 160], scale: 130, target: [0, 0, 0.95] });
  return kit.svg({ width: 480, height: 300 },
    drawMesh(kit, c.mesh, v, { width: 0.8 }),
    drawBones(kit, v, c.bones, { marked: ['upper_arm.L', 'forearm.L'] }),
  );
};
