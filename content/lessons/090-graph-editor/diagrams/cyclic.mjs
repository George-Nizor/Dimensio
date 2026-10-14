// The lamp's swing with keys on frames 1, 25 and 49, made cyclic with Shift+E: the Cycles modifier
// repeats it after frame 49, out to the end of the animation and beyond.
import { graph } from './anim.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const g = graph(kit, { x: 30, y: 30, w: 490, h: 110, f0: 0, f1: 100, v0: -20, v1: 20, every: 10 });
  const swing = [[1, -15], [25, 15], [49, -15]];
  const [cx] = g.map([49, 0]);
  return kit.svg({ width: 540, height: 182 },
    keycap(kit, 60, 14, 'Shift+E', { size: 10 }), kit.text(92, 18, 'Make Cyclic', { size: 12 }),
    g.svg, g.draw(swing, { sel: [0, 1, 2] }), g.draw(swing.map(([f, v]) => [f + 48, v]), { cls: 'd-mark', dash: '6 4' }).slice(0, 1),
    kit.line(cx, 32, cx, 138, { cls: 'd-guide', width: 1, dash: '3 3' }),
    kit.text(150, 176, 'keyed', { anchor: 'middle', size: 12 }), kit.text(400, 176, 'repeated by the Cycles modifier', { anchor: 'middle', size: 12 }),
  );
};
