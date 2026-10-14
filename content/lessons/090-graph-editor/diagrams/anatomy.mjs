// The door's rotation as Blender keys it: time across, value up. Each key is a dot, and its handles
// stick out either side. With the default handles the curve starts slowly and settles slowly.
import { graph } from './anim.mjs';

export default (kit) => {
  const g = graph(kit, { x: 60, y: 20, w: 440, h: 150, f0: 0, f1: 22, v0: -10, v1: 110, every: 5 });
  const [kx, ky] = g.map([20, 100]);
  const [hx, hy] = g.map([20 - 19 / 3, 100]);
  return kit.svg({ width: 540, height: 214 },
    g.svg, g.draw([[1, 0], [20, 100]], { handles: true }),
    kit.text(kx - 8, ky + 22, 'keyframe', { anchor: 'end', size: 12, cls: 'd-tag' }),
    kit.text(hx, hy - 10, 'handle', { anchor: 'middle', size: 12, cls: 'd-tag' }),
    kit.text(40, 100, 'value', { anchor: 'middle', size: 12 }),
    kit.text(280, 208, 'frame', { anchor: 'middle', size: 12 }),
  );
};
