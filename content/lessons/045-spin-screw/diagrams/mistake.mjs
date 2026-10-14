// Wrong: the outline sits away from the object's origin, so the Screw turns it round a point beside
// it and the goblet comes out as a ring with a hole down the middle. Right: the outline starts on
// the axis and the base is closed.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';
import { gobletMesh } from './shapes.mjs';

export default (kit) => {
  const v1 = view({ at: [130, 186], scale: 128, elevation: 40, target: [0, 0, 0] });
  const v2 = view({ at: [380, 186], scale: 128, elevation: 40, target: [0, 0, 0] });
  return kit.svg({ width: 510, height: 250 },
    panel(kit, 14, 14, 232, 200),
    drawMesh(kit, gobletMesh(12, 0.18), v1, { width: 0.8 }),
    kit.tag(130, 238, 'outline away from the origin', { tone: 'bad' }),
    panel(kit, 264, 14, 232, 200),
    drawMesh(kit, gobletMesh(12), v2, { width: 0.8 }),
    kit.tag(380, 238, 'outline starts on the axis'),
  );
};
