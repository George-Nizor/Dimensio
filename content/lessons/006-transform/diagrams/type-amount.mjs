// G, Z, 2, Enter: the block rises exactly 2 m.
import { view, drawMesh, translate, dimension } from '../../../diagrams/mesh.mjs';
import { keyRow } from './parts.mjs';
import { block } from './block.mjs';

export default (kit) => {
  const v = view({ at: [210, 150], scale: 50, target: [0, 0, 1.5] });
  const start = block();
  return kit.svg({ width: 440, height: 270 },
    keyRow(kit, 20, 30, ['G', 'Z', '2', 'Enter'], { size: 13 }).svg,
    drawMesh(kit, start, v, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, translate(start, [0, 0, 2]), v, { width: 1.8, cls: 'd-mark' }),
    dimension(kit, v, [0.25, -0.25, 0], [0.25, -0.25, 2], { offset: [0.7, 0, 0] }),
  );
};
