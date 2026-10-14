// Faces by Sides with Number of Vertices 4 and Type Greater Than: the lamp's n-gons selected. The
// base's two flat caps have eight corners; each side of the shade has six.
import { view } from '../../../diagrams/mesh.mjs';
import { lamp } from './lamp.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const m = lamp('ngon');
  const v = view({ azimuth: 24, elevation: 24, at: [250, 216], scale: 420, target: [0, 0, 0] });
  return kit.svg({ width: 500, height: 240 }, paint(kit, m, v, { width: 1.4, inside: true, fill: (i) => (m.faces[i].length > 4 ? 'd-face-sel' : null) }));
};
