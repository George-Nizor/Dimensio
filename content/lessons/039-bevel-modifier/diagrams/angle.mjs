// Limit Method Angle on a 16-sided cylinder. The rims, where the surface turns 90 degrees, are
// bevelled. The edges down the sides turn only 22.5 degrees, under the 30 degree limit, and are left.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { lathe, panel } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const r = 1;
  const h = 1.6;
  const w = 0.14;
  const plain = lathe([[r, 0], [r, h]], 16, { caps: true });
  const bevelled = lathe([[r - w, 0], [r, w], [r, h - w], [r - w, h]], 16, { caps: true });
  const v1 = view({ at: [120, 130], scale: 58, target: [0, 0, 0.8] });
  const v2 = view({ at: [360, 130], scale: 58, target: [0, 0, 0.8] });
  return kit.svg({ width: 480, height: 262 },
    panel(kit, 14, 14, 212, 220, 'no modifier'),
    drawMesh(kit, plain, v1, { width: 1.3 }),
    panel(kit, 254, 14, 212, 220, 'Bevel with Limit Method Angle'),
    drawMesh(kit, bevelled, v2, { width: 1.3, select: { faces: bevelled.faces.map((f, i) => i).filter((i) => i < 16 || (i >= 32 && i < 48)) } }),
  );
};
