// The starter scene with its physics set: the crates active with a Box shape, the cart passive
// with Animated ticked and a Mesh shape, so its keys tip it and the crates rest between its rails.
import { view, drawMesh, plane, join } from '../../../diagrams/mesh.mjs';
import { cart, stacked } from './scene.mjs';
import { field, checkbox } from './helpers.mjs';

export default (kit) => {
  const v = view({ azimuth: 50, elevation: 20, at: [140, 160], scale: 60, target: [0, 0, 0.6] });
  return kit.svg({ width: 520, height: 260 },
    drawMesh(kit, plane({ size: [3, 3.6] }), v, { width: 1 }),
    drawMesh(kit, join(cart(0), stacked()), v, { width: 1.2 }),
    `<rect x="290" y="12" width="220" height="74" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(300, 30, 'Crates: Add Active', { size: 11 }),
    field(kit, 296, 40, 208, 'Shape', 'Box', { on: true, labelWidth: 0.4 }),
    `<rect x="290" y="100" width="220" height="104" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(300, 118, 'Cart: Add Passive', { size: 11 }),
    checkbox(kit, 300, 128, 'Animated', true),
    field(kit, 296, 154, 208, 'Shape', 'Mesh', { on: true, labelWidth: 0.4 }),
    kit.text(300, 226, 'Ground: Add Passive', { size: 11 }),
  );
};
