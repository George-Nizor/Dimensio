// G, X, X: the tilted sign slides along its own X axis into its wire outline.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { keyRow } from './parts.mjs';
import { sign, signAxes } from './planks.mjs';

export default (kit) => {
  const v = view({ at: [210, 130], scale: 110, target: [5.4, -0.7, 1.4] });
  const [dx, dy, dz] = signAxes()[0];
  const line = [-0.9, 2.1].map((t) => v.project([5 + dx * t, -1 + dy * t, 1.5 + dz * t]));
  return kit.svg({ width: 460, height: 250 },
    kit.line(line[0][0], line[0][1], line[1][0], line[1][1], { cls: 'd-axis-x', width: 1.6 }),
    drawMesh(kit, sign(0), v, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, sign(1), v, { width: 1.8, cls: 'd-mark' }),
    keyRow(kit, 320, 34, ['G', 'X', 'X'], { size: 12 }).svg,
    kit.text(320, 74, 'along its own X', { size: 12 }),
  );
};
