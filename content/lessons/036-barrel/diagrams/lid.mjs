// The top face inset 0.06 m with I, then pushed 0.05 m down with E: a sunken lid, still selected.
import { view } from '../../../diagrams/mesh.mjs';
import { barrel } from './barrel.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const m = barrel('done');
  const lid = m.faces.length - 1;
  const v = view({ azimuth: 22, elevation: 42, at: [230, 112], scale: 140, target: [0, 0, 0.6] });
  return kit.svg({ width: 460, height: 250 }, paint(kit, m, v, { outward: false, width: 1.3, fill: (i) => (i === lid ? 'd-face-sel' : null) }));
};
