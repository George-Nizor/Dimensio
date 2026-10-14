// Simple Deform in Bend mode, Axis Z, Angle 90 degrees, on a sign with loop cuts across it, seen
// from above and to the front. The middle stays put and the ends curl back.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, pageArrow } from '../../037-modifiers/diagrams/modkit.mjs';
import { sign } from './shapes.mjs';

export default (kit) => {
  const v = (x) => view({ at: [x, 120], scale: 82, elevation: 50, azimuth: 0, target: [0, 0.3, 0.3] });
  return kit.svg({ width: 520, height: 220 },
    panel(kit, 14, 14, 226, 180, 'ten loop cuts'),
    drawMesh(kit, sign(10, 0.001), v(127), { width: 1.2 }),
    pageArrow(kit, 248, 104, 272, 104),
    panel(kit, 280, 14, 226, 180, 'Bend, Axis Z, 90°'),
    drawMesh(kit, sign(10, 90), v(393), { width: 1.2 }),
  );
};
