// The same sphere in front of stripes with Alpha 1, 0.6 and 0.3: solid, half faded, and faint
// enough to see the stripes through it, as glass in a game.
import { sphere, stripes } from './spheres.mjs';

export default (kit) => kit.svg({ width: 420, height: 170 },
  stripes(kit, 14, 16, 392, 112, { width: 12 }),
  [[1, '1'], [0.6, '0.6'], [0.3, '0.3']].map(([alpha, label], i) => {
    const cx = 80 + i * 130;
    return [sphere(kit, cx, 72, 44, { body: 'd-face-2', roughness: 0.1, alpha }), kit.text(cx, 152, `Alpha ${label}`, { anchor: 'middle', size: 12 })];
  }),
);
