// T sets the interpolation from each selected key to the next. Constant holds the value and jumps,
// Linear moves at one speed, Bézier starts and stops smoothly.
import { graph } from './anim.mjs';

export default (kit) => {
  const keys = [[1, 0], [20, 100]];
  return kit.svg({ width: 540, height: 160 },
    [['constant', 'Constant'], ['linear', 'Linear'], ['bezier', 'Bézier']].map(([interp, label], i) => {
      const g = graph(kit, { x: 14 + i * 176, y: 14, w: 160, h: 100, f0: 0, f1: 22, v0: -10, v1: 110, every: 10 });
      return [g.svg, g.draw(keys, { interp }), kit.text(94 + i * 176, 150, label, { anchor: 'middle', size: 12 })];
    }),
  );
};
