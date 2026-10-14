// Alt+E, Extrude Faces Along Normals, 0.04: the second and fourth rows of faces pushed out into two
// bands, still selected.
import { view } from '../../../diagrams/mesh.mjs';
import { barrel } from './barrel.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 22, elevation: 20, at: [230, 126], scale: 150, target: [0, 0, 0.6] });
  const band = (i) => (Math.floor(i / 12) === 2 || Math.floor(i / 12) === 6) && i < 9 * 12;
  return kit.svg({ width: 460, height: 250 }, paint(kit, barrel('bands'), v, { outward: false, width: 1.3, fill: (i) => (band(i) ? 'd-face-sel' : null) }));
};
