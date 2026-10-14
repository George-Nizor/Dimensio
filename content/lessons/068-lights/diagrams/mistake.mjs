// The crate lit two ways. Wrong: the fill as bright as the key, so both visible sides are equally
// bright and the crate looks flat. Right: the fill at half the key or less, so one side is darker
// and the shape reads.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { crate, panel } from './lights.mjs';

export default (kit) => {
  const left = view({ azimuth: 35, elevation: 25, scale: 120, at: [125, 120], target: [0, 0, 0.35] });
  const right = view({ azimuth: 35, elevation: 25, scale: 120, at: [375, 120], target: [0, 0, 0.35] });
  // Light from the front left and front right at once: both sides face it the same amount.
  const flat = drawMesh(kit, crate(), left, { width: 1.4, light: [0, -1, 0.15] });
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 222, 196),
    flat.map((s) => s.replace('class="d-face-2"', 'class="d-face-1"')),
    kit.tag(125, 236, 'fill as bright as key', { tone: 'bad' }),
    panel(kit, 264, 14, 222, 196),
    drawMesh(kit, crate(), right, { width: 1.4, light: [-0.8, -0.4, 0.45] }),
    kit.tag(375, 236, 'fill at half or less'),
  );
};
