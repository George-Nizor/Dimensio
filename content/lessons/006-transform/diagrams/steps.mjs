// Holding Ctrl while rotating turns the block in 5 degree steps. Seen from the top, the block's
// earlier positions are drawn faintly at 5, 10, 15 and 20 degrees.
import { views, drawMesh, rotate, keycap } from '../../../diagrams/mesh.mjs';
import { block } from './block.mjs';

export default (kit) => {
  const v = views.top({ at: [170, 120], scale: 150 });
  const b = block([0, 0, 0]);
  return kit.svg({ width: 420, height: 240 },
    [0, 5, 10, 15, 20].map((a) => drawMesh(kit, rotate(b, 'z', a), v, { mode: 'wire', cls: 'd-guide', width: 1 })),
    drawMesh(kit, rotate(b, 'z', 25), v, { width: 2, cls: 'd-mark' }),
    kit.arcArrow(240, 60, 112, 52, { lift: -22 }),
    keycap(kit, 330, 110, 'Ctrl'),
    kit.text(330, 150, '5 degree steps', { anchor: 'middle', size: 12 }),
  );
};
