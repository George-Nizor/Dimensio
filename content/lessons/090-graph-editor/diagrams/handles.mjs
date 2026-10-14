// V sets the handle type. Left, Auto Clamped, the default: the curve flattens at each key. Right,
// the middle key set to Vector: its handles point straight at its neighbours, making a sharp corner.
import { graph } from './anim.mjs';

export default (kit) => {
  const keys = [[1, 0], [12, 60], [24, 0]];
  const a = graph(kit, { x: 20, y: 14, w: 230, h: 120, f0: 0, f1: 26, v0: -10, v1: 75, every: 10 });
  const b = graph(kit, { x: 290, y: 14, w: 230, h: 120, f0: 0, f1: 26, v0: -10, v1: 75, every: 10 });
  return kit.svg({ width: 540, height: 176 },
    a.svg, a.draw(keys, { handles: true }), kit.text(135, 168, 'Auto Clamped', { anchor: 'middle', size: 12 }),
    b.svg, b.draw(keys, { handles: false, vector: [1] }),
    (() => { const c = b.map([12, 60]); const l = b.map([12 - 11 / 3, 60 - 20]); const r = b.map([12 + 12 / 3, 60 - 20]); return [kit.line(l[0], l[1], c[0], c[1], { cls: 'd-guide', width: 1.2 }), kit.line(c[0], c[1], r[0], r[1], { cls: 'd-guide', width: 1.2 }), kit.circle(l[0], l[1], 3, { cls: 'd-guide', width: 1.2 }), kit.circle(r[0], r[1], 3, { cls: 'd-guide', width: 1.2 })]; })(),
    kit.text(405, 168, 'Vector on the middle key', { anchor: 'middle', size: 12 }),
  );
};
