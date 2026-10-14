// Alt+E, Extrude Faces Along Normals, -0.05: the inner triangles sunk 2.5 cm, with walls round them.
import { view } from '../../../diagrams/mesh.mjs';
import { crate } from './crate.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const { mesh, picked } = crate('done');
  const v = view({ azimuth: 34, elevation: 26, at: [250, 122], scale: 300, target: [0, 0, 0.25] });
  return kit.svg({ width: 500, height: 245 }, paint(kit, mesh, v, { outward: false, width: 1.3, fill: (i) => (picked.includes(i) ? 'd-face-sel' : null) }));
};
