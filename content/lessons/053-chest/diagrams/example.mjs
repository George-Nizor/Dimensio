// The finished chest: a hollow wooden body and a rounded wooden lid, open on its hinge, with two
// grey metal bands round the lid and a lock on the front. Wood and metal are two material slots.
import { view } from '../../../diagrams/mesh.mjs';
import { body, lid, band, lock, openOnHinge, drawParts } from './chest.mjs';
import { drawPainted } from './painted.mjs';

export default (kit) => {
  const open = (p) => openOnHinge(p, -50);
  const v = view({ at: [220, 178], scale: 150, azimuth: 30, elevation: 26, target: [0, 0, 0.5] });
  return kit.svg({ width: 440, height: 300 }, drawParts(kit, v, [open(lid()), open(band(-0.4)), open(band(0.4)), body(), lock()], drawPainted));
};
