// Wrong: the object's origin sits left of the middle line, so the mirrored half lands too far over
// and a gap opens between the halves. Right: the origin sits on the middle line and the halves meet.
import { views, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { halfShield, mirrored } from './shapes.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const half = halfShield();
  const off = 0.12;
  // The mesh as seen from an origin 0.12 m to its left: the copy flips across that point.
  const shifted = translate(half, [off, 0, 0]);
  const v1 = views.front({ at: [130, 110], scale: 110 });
  const v2 = views.front({ at: [380, 110], scale: 110 });
  return kit.svg({ width: 510, height: 250 },
    panel(kit, 14, 14, 232, 196),
    drawMesh(kit, mirrored(shifted), v1, { width: 1.4 }),
    drawMesh(kit, shifted, v1, { width: 1.4 }),
    kit.dot(130, 110, { r: 4.5, cls: 'd-mark-fill' }),
    kit.tag(130, 236, 'origin off the middle', { tone: 'bad' }),
    panel(kit, 264, 14, 232, 196),
    drawMesh(kit, mirrored(half), v2, { width: 1.4 }),
    drawMesh(kit, half, v2, { width: 1.4 }),
    kit.dot(380, 110, { r: 4.5, cls: 'd-mark-fill' }),
    kit.tag(380, 236, 'origin on the middle line'),
  );
};
