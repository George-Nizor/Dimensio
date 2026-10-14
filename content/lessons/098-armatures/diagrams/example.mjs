// The finished skeleton of 15 octahedral bones inside the character, seen from the front with the
// mesh drawn faint: hips, spine, chest, neck and head up the middle, and on each side an upper arm,
// forearm, thigh, shin and foot.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character, drawBones } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const c = character();
  const v = views.front({ at: [240, 150], scale: 130, target: [0, 0, 0.9] });
  return kit.svg({ width: 480, height: 290 },
    drawMesh(kit, c.mesh, v, { cls: 'd-guide', width: 0.6 }),
    drawBones(kit, v, c.bones),
  );
};
