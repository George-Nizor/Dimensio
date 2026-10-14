// The cart tipped back, and six crates that slid off its bed lying tumbled on the ground behind
// it, the fall that Bake to Keyframes turns into one animation for Godot.
import { view, drawMesh, plane, join, translate } from '../../../diagrams/mesh.mjs';
import { cart, fallen } from './scene.mjs';

export default (kit) => {
  const v = view({ azimuth: 62, elevation: 22, at: [250, 140], scale: 52, target: [0, 1.4, 0.4] });
  return kit.svg({ width: 500, height: 250 },
    drawMesh(kit, translate(plane({ size: [3, 6.4] }), [0, 1.3, 0]), v, { width: 1 }),
    drawMesh(kit, join(cart(-35), fallen()), v, { width: 1.2 }),
  );
};
