// Wrong: the chest's parts drawn with Drawing Plane on View from three angles, so from a new angle
// they lie on different planes and miss each other. Right: every part drawn on Front (X-Z), so the
// drawing holds together from the same new angle.
import { view } from '../../../diagrams/mesh.mjs';
import { handStroke, chest, turnZ } from './gp-kit.mjs';

export default (kit) => {
  const left = view({ azimuth: 28, elevation: 16, scale: 170, at: [125, 170] });
  const right = view({ azimuth: 28, elevation: 16, scale: 170, at: [375, 170] });
  const { front } = chest;
  return kit.svg({ width: 500, height: 230 },
    handStroke(kit, left, front.body, { closed: true, seed: 4 }),
    handStroke(kit, left, turnZ(front.lid, 55), { seed: 5 }),
    handStroke(kit, left, turnZ(front.lock, -50), { closed: true, seed: 7, width: 1.8 }),
    handStroke(kit, left, turnZ(front.band, 35), { seed: 6, width: 1.6 }),
    kit.tag(125, 216, 'drawn on View', { tone: 'bad' }),
    handStroke(kit, right, front.body, { closed: true, seed: 4 }),
    handStroke(kit, right, front.lid, { seed: 5 }),
    handStroke(kit, right, front.lock, { closed: true, seed: 7, width: 1.8 }),
    handStroke(kit, right, front.band, { seed: 6, width: 1.6 }),
    kit.tag(375, 216, 'drawn on Front (X-Z)'),
  );
};
