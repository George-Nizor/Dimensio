// Frame 45: the cart has tipped 35 degrees and the crates slide and topple off the open back.
// Substeps Per Frame in the Scene tab's Rigid Body World panel steadies them if they jitter.
import { view, drawMesh, plane, join } from '../../../diagrams/mesh.mjs';
import { cart, sliding } from './scene.mjs';
import { field } from './helpers.mjs';

export default (kit) => {
  const v = view({ azimuth: 62, elevation: 18, at: [150, 160], scale: 64, target: [0, 0.8, 0.5] });
  return kit.svg({ width: 520, height: 240 },
    drawMesh(kit, plane({ size: [2.6, 3.6] }), v, { width: 1 }),
    drawMesh(kit, join(cart(-35), sliding()), v, { width: 1.2 }),
    kit.text(40, 30, 'frame 45', { size: 12, cls: 'd-tag' }),
    `<rect x="300" y="70" width="210" height="64" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(310, 88, 'Scene tab, Rigid Body World', { size: 11 }),
    field(kit, 306, 98, 198, 'Substeps Per Frame', '10', { labelWidth: 0.62 }),
  );
};
