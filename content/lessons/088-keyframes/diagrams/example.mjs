// The coin at frame 1 (a key), frame 12 (worked out by Blender) and frame 24 (a key): it rises 1 m
// and turns 180 degrees. Below, the Timeline with keys on frames 1, 24 and 48.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { coin } from './coin.mjs';
import { strip, panel } from './anim.mjs';

export default (kit) => {
  const shots = [[1, 0, 0, 'frame 1: key'], [12, 90, 0.5, 'frame 12'], [24, 180, 1, 'frame 24: key']];
  const t = strip(kit, { x: 30, y: 186, w: 470, h: 40, start: 0, end: 50, every: 10, keys: [1, 24, 48], frame: 12 });
  return kit.svg({ width: 530, height: 240 },
    shots.map(([, spin, lift, label], i) => {
      const x = 14 + i * 172;
      const v = view({ azimuth: 10, elevation: 12, at: [x + 82, 136], scale: 70, target: [0, 0, 0] });
      return [panel(kit, x, 10, 164, 140, label), kit.line(x + 30, 136, x + 134, 136, { cls: 'd-guide', width: 1 }), drawMesh(kit, coin(spin, lift), v, { width: 1.2 })];
    }),
    t.svg,
  );
};
