// Left, the eight-sided UV sphere as added. Right, the same sphere flattened to three quarters of
// its height with S, Z and 0.75.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { keyRow, panel } from './parts.mjs';
import { body, bodyAsAdded } from './bottle.mjs';

export default (kit) => {
  const at = (x) => view({ azimuth: 22, elevation: 18, at: [x, 104], scale: 420, target: [0, 0, 0.12] });
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 200, 176, 'as added'),
    drawMesh(kit, bodyAsAdded(), at(114), { width: 1.4 }),
    keyRow(kit, 222, 104, ['S', 'Z'], { size: 11 }).svg,
    kit.text(250, 136, '0.75', { anchor: 'middle', size: 12, cls: 'd-key-text' }),
    panel(kit, 286, 14, 200, 176, 'flattened'),
    drawMesh(kit, body(), at(386), { width: 1.4, cls: 'd-mark' }),
  );
};
