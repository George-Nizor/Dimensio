// Shape Circle from above. Wrong: Radius left at 0, so all twelve stones sit on the origin, each
// turned a little further, in one clump. Right: Radius 1 m spreads them into a ring.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';
import { stone, circle } from './shapes.mjs';

export default (kit) => {
  const v1 = views.top({ at: [130, 110], scale: 70 });
  const v2 = views.top({ at: [380, 110], scale: 70 });
  return kit.svg({ width: 510, height: 250 },
    panel(kit, 14, 14, 232, 196),
    drawMesh(kit, circle(stone(), 12, 0), v1, { width: 1.1 }),
    kit.tag(130, 236, 'Radius 0', { tone: 'bad' }),
    panel(kit, 264, 14, 232, 196),
    drawMesh(kit, circle(stone(), 12, 1), v2, { width: 1.1 }),
    kit.tag(380, 236, 'Radius 1 m'),
  );
};
