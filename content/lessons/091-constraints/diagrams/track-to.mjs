// Seen from the top. Track To on the camera with the Cart as its target: the camera stays where it is
// and turns to keep the cart in view as it drives from frame 1 (faint) to frame 120.
import { cameraIcon, cartIcon } from './yard.mjs';

export default (kit) => {
  const cam = [270, 170];
  const carts = [[80, 1], [270, 60], [460, 120]];
  return kit.svg({ width: 540, height: 210 },
    kit.line(40, 50, 500, 50, { cls: 'd-guide', width: 1, dash: '5 5' }),
    carts.map(([x, f]) => {
      const a = Math.atan2(50 - cam[1], x - cam[0]);
      return [
        kit.line(cam[0], cam[1], x, 62, { cls: 'd-mark', width: 1.4, dash: '5 4' }),
        cartIcon(kit, x, 50),
        kit.text(x, 26, `frame ${f}`, { anchor: 'middle', size: 12 }),
        f === 1 ? cameraIcon(kit, cam[0], cam[1], a, { ghost: true }) : '',
      ];
    }),
    (() => { const a = Math.atan2(50 - cam[1], 460 - cam[0]); return cameraIcon(kit, cam[0], cam[1], a); })(),
    kit.text(cam[0], 202, 'the camera turns, but stays put', { anchor: 'middle', size: 12 }),
  );
};
