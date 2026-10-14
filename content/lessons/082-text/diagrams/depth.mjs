// Geometry > Extrude: the flat letters, then the same letters with thickness.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { letters, panel } from './letters.mjs';

export default (kit) => {
  const v = (x) => view({ azimuth: 24, elevation: 14, at: [x, 92], scale: 150, target: [0, 0, 0.2] });
  return kit.svg({ width: 520, height: 190 },
    panel(kit, 14, 14, 236, 140, 'Extrude 0'),
    letters('INN', { size: 0.4, depth: 0.0005 }).map((m) => drawMesh(kit, m, v(132), { width: 1.4 })),
    panel(kit, 270, 14, 236, 140, 'Extrude 0.05 m'),
    letters('INN', { size: 0.4, depth: 0.05 }).map((m) => drawMesh(kit, m, v(388), { width: 1.4 })),
  );
};
