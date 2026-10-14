// Left, the default Bézier: slow, fast, slow. Right, Quadratic with Ease In: the door starts slowly,
// gets faster and stops dead on the last key, as it would against a door stop.
import { graph, panel } from './anim.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const keys = [[1, 0], [20, 100]];
  const a = graph(kit, { x: 30, y: 24, w: 200, h: 120, f0: 0, f1: 22, v0: -10, v1: 110, every: 10 });
  const b = graph(kit, { x: 300, y: 24, w: 200, h: 120, f0: 0, f1: 22, v0: -10, v1: 110, every: 10 });
  return kit.svg({ width: 540, height: 206 },
    a.svg, a.draw(keys), kit.text(130, 180, 'Bézier: eases out and in', { anchor: 'middle', size: 12 }),
    keycap(kit, 264, 58, 'T'), keycap(kit, 264, 100, 'Ctrl+E', { size: 10 }),
    b.svg, b.draw(keys, { interp: 'ease-in' }), kit.text(400, 180, 'Quadratic, Ease In: a hard stop', { anchor: 'middle', size: 12, cls: 'd-tag' }),
  );
};
