// The same grey sphere with Roughness 0, 0.5 and 1: a small hard highlight, a wide soft one, and
// none at all.
import { sphere } from './spheres.mjs';

export default (kit) => kit.svg({ width: 420, height: 160 },
  [[0, '0'], [0.5, '0.5'], [1, '1']].map(([roughness, label], i) => {
    const cx = 80 + i * 130;
    return [sphere(kit, cx, 70, 46, { body: 'd-face-2', roughness }), kit.text(cx, 146, `Roughness ${label}`, { anchor: 'middle', size: 12 })];
  }),
);
