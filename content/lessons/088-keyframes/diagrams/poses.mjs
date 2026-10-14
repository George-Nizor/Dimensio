// Keys on frames 1, 24 and 48, with the coin's pose at each: on the ground, 1 m up and turned 180
// degrees, then back down having turned 360. Blender works out every frame between.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { coin } from './coin.mjs';
import { strip } from './anim.mjs';

export default (kit) => {
  const t = strip(kit, { x: 30, y: 150, w: 470, h: 40, start: 0, end: 50, every: 10, keys: [1, 24, 48] });
  return kit.svg({ width: 530, height: 204 },
    [[1, 0, 0], [24, 180, 1], [48, 360, 0]].map(([f, spin, lift]) => {
      const x = t.fx(f);
      const v = view({ azimuth: 10, elevation: 12, at: [x, 128], scale: 52 });
      return [drawMesh(kit, coin(spin, lift), v, { width: 1.1 }), kit.line(x, 136, x, 150, { cls: 'd-guide', width: 1, dash: '3 3' })];
    }),
    t.svg,
  );
};
