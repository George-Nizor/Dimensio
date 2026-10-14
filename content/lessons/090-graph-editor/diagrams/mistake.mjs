// A loop made from two keys. Wrong: -15 on frame 1 and 15 on frame 25, so each repeat snaps from 15
// back to -15. Right: the first key copied to frame 49, so the swing comes back before it repeats.
import { graph } from './anim.mjs';

export default (kit) => {
  const a = graph(kit, { x: 20, y: 14, w: 470, h: 70, f0: 0, f1: 100, v0: -20, v1: 20, every: 10 });
  const b = graph(kit, { x: 20, y: 140, w: 470, h: 70, f0: 0, f1: 100, v0: -20, v1: 20, every: 10 });
  const two = [[1, -15], [25, 15]];
  const three = [[1, -15], [25, 15], [49, -15]];
  const jumps = [25, 49, 73, 97].map((f) => { const [x, y1] = a.map([f, 15]); const [, y2] = a.map([f, -15]); return kit.line(x, y1, x, y2, { cls: 'd-bad', width: 2.2 }); });
  return kit.svg({ width: 500, height: 256 },
    a.svg, [0, 24, 48, 72].map((s) => a.draw(two.map(([f, v]) => [f + s, v]), { cls: 'd-bad', sel: [] }).slice(0, 1)), jumps,
    a.draw(two), kit.tag(255, 120, 'two keys: it snaps back', { tone: 'bad' }),
    b.svg, b.draw(three), b.draw(three.map(([f, v]) => [f + 48, v])).slice(0, 1),
    kit.tag(255, 246, 'first key copied to frame 49'),
  );
};
