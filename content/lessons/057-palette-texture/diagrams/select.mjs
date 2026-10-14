// Edit Mode: both metal bands selected, ready to be given one colour. Alt and a click on a band
// selects its ring of faces.
import { view, keycap, mouse } from '../../../diagrams/mesh.mjs';
import { barrel, drawFaces } from './palette.mjs';

export default (kit) => {
  const { mesh: m, parts } = barrel();
  const v = view({ at: [150, 140], scale: 150, target: [0, 0, 0.6], azimuth: 30, elevation: 22 });
  return kit.svg({ width: 420, height: 270 },
    drawFaces(kit, m, v, () => ({ cls: 'd-face-1', dark: 0 }), { select: parts.bands }),
    keycap(kit, 320, 120, 'Alt'), kit.text(346, 125, '+', { anchor: 'middle', size: 13 }),
    mouse(kit, 372, 116, { button: 'left', size: 0.45 }),
    kit.text(340, 172, 'a ring of faces', { anchor: 'middle', size: 12 }),
  );
};
