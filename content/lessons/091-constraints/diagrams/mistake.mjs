// Seen from the top. The camera has Track To aimed at the cart. Wrong: R turns its Rotation fields,
// but the constraint keeps it aimed at the cart, so nothing moves. Right: G moves the camera, and it
// keeps aiming at the cart from its new place.
import { keycap } from '../../../diagrams/mesh.mjs';
import { cameraIcon, cartIcon, panel } from './yard.mjs';

export default (kit) => {
  const left = [124, 140];
  const right = [330, 150];
  const moved = [440, 150];
  const cartL = [124, 52];
  const cartR = [376, 52];
  const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 170),
    cartIcon(kit, ...cartL), kit.line(left[0], left[1] - 14, cartL[0], cartL[1] + 14, { cls: 'd-mark', width: 1.4, dash: '5 4' }),
    cameraIcon(kit, left[0], left[1], ang(left, cartL)),
    kit.arcArrow(left[0] - 40, left[1] + 6, left[0] + 40, left[1] + 6, { lift: 22, cls: 'd-bad' }),
    keycap(kit, 196, 150, 'R'),
    kit.tag(124, 222, 'R: it stays aimed', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 170),
    cartIcon(kit, ...cartR),
    cameraIcon(kit, right[0], right[1], ang(right, cartR), { ghost: true }),
    kit.line(right[0] + 18, right[1], moved[0] - 18, moved[1], { cls: 'd-mark', width: 2 }), kit.arrowhead(moved[0] - 18, moved[1], 0, { size: 8 }),
    kit.line(moved[0], moved[1] - 14, cartR[0], cartR[1] + 14, { cls: 'd-mark', width: 1.4, dash: '5 4' }),
    cameraIcon(kit, moved[0], moved[1], ang(moved, cartR)),
    keycap(kit, 390, 190 - 20, 'G'),
    kit.tag(376, 222, 'G: it moves and re-aims'),
  );
};
