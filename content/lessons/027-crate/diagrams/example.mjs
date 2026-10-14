// The finished crate from the lesson's steps: chamfered edges, and on each side a frame, a
// diagonal brace and two triangular panels sunk 2.5 cm (shaded darker).
import { view } from '../../../diagrams/mesh.mjs';
import { crate } from './crate.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const { mesh, picked } = crate('done');
  const v = view({ azimuth: 34, elevation: 26, at: [250, 124], scale: 300, target: [0, 0, 0.25] });
  return kit.svg({ width: 500, height: 250 }, paint(kit, mesh, v, { outward: false, width: 1.3, fillOpacity: 0.8, fill: (i) => (picked.includes(i) ? 'd-face-3' : null) }));
};
