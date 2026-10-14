// Shift+N with Face Orientation on. Left, the crate's two front panels point inwards and show red.
// Right, after Shift+N, no red.
import { view } from '../../../diagrams/mesh.mjs';
import { broken } from './faults.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 24, elevation: 20, at: [118, 106], scale: 224, target: [0, 0, 0.25] });
  const right = view({ azimuth: 24, elevation: 20, at: [392, 106], scale: 224, target: [0, 0, 0.25] });
  // Drawn with the panels the right way round and tinted red, as Face Orientation shows a back.
  const turned = broken({ hole: false, flipped: false });
  return kit.svg({ width: 510, height: 230 },
    panel(kit, 14, 14, 208, 184, 'two panels turned in'),
    paint(kit, turned.mesh, left, { width: 1.1, outward: false, fill: (i) => (turned.frontPanels.includes(i) ? 'd-key-bad' : null), fillOpacity: 0.75 }),
    step(kit, 232, 104, 278),
    panel(kit, 288, 14, 208, 184, 'after Shift+N'),
    paint(kit, broken({ hole: false, flipped: false }).mesh, right, { width: 1.1, outward: false }),
  );
};
