// After G and X, the block moves only along the X axis, drawn as a red line through it.
import { view, drawMesh, translate, keycap, axes } from '../../../diagrams/mesh.mjs';
import { block } from './block.mjs';

export default (kit) => {
  const v = view({ at: [190, 140], scale: 62, target: [0.8, 0, 0.5] });
  const start = block();
  const a = v.project([-1.6, 0, 0.5]);
  const b = v.project([3.4, 0, 0.5]);
  return kit.svg({ width: 440, height: 240 },
    kit.line(a[0], a[1], b[0], b[1], { cls: 'd-axis-x', width: 2 }),
    drawMesh(kit, start, v, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, translate(start, [1.6, 0, 0]), v, { width: 1.8, cls: 'd-mark' }),
    axes(kit, view({ at: [56, 196], scale: 30 }), { length: 1 }),
    keycap(kit, 330, 40, 'G'), keycap(kit, 372, 40, 'X'),
  );
};
