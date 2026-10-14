// G moves the block with the mouse; a left click puts it down.
import { view, drawMesh, translate, mouse, keycap, arrow } from '../../../diagrams/mesh.mjs';
import { block } from './block.mjs';

export default (kit) => {
  const v = view({ at: [150, 130], scale: 80, target: [0.6, 0, 0.5] });
  const start = block();
  return kit.svg({ width: 420, height: 230 },
    keycap(kit, 36, 34, 'G'),
    drawMesh(kit, start, v, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, translate(start, [1.3, 0.4, 0]), v, { width: 1.8, cls: 'd-mark' }),
    arrow(kit, v, [0.1, 0.1, 0.5], [1.1, 0.4, 0.5]),
    mouse(kit, 350, 110, { button: 'left', label: 'click to put it down' }),
  );
};
