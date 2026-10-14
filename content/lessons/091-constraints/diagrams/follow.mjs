// Copy Location with Offset moves the camera along with the cart, keeping its distance. Above Track
// To in the stack, it moves the camera first, and Track To then aims from the new place.
import { cameraIcon, cartIcon } from './yard.mjs';

export default (kit) => {
  const carts = [[60, 1], [190, 60], [320, 120]];
  return kit.svg({ width: 540, height: 210 },
    kit.line(30, 50, 350, 50, { cls: 'd-guide', width: 1, dash: '5 5' }),
    carts.map(([x, f]) => [
      kit.line(x, 158, x, 64, { cls: 'd-mark', width: 1.4, dash: '5 4' }),
      cartIcon(kit, x, 50),
      cameraIcon(kit, x, 170, -Math.PI / 2, { ghost: f !== 120 }),
      kit.text(x, 26, `frame ${f}`, { anchor: 'middle', size: 12 }),
    ]),
    `<rect x="380" y="40" width="150" height="110" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(392, 60, 'Object Constraints', { size: 11 }),
    `<rect x="390" y="72" width="130" height="28" rx="4" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(400, 91, '1  Copy Location', { size: 12 }),
    `<rect x="390" y="108" width="130" height="28" rx="4" class="d-paper" stroke-width="1"/>`,
    kit.text(400, 127, '2  Track To', { size: 12 }),
    kit.text(455, 170, 'top runs first', { anchor: 'middle', size: 12 }),
  );
};
