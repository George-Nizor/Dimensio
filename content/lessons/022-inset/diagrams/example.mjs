// A box with a sunken panel on every side, and a wall with a raised window frame and the middle
// set back: both made with insets and extrusions.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';
import { panelledBox, windowWall } from './shapes.mjs';

export default (kit) => {
  const a = view({ at: [126, 112], scale: 40 });
  const b = view({ at: [384, 112], scale: 52, target: [0, 0, 1.25], azimuth: 24 });
  return kit.svg({ width: 510, height: 230 },
    panel(kit, 14, 14, 224, 184, 'panelled box'),
    drawMesh(kit, panelledBox().mesh, a, { width: 1.3 }),
    panel(kit, 272, 14, 224, 184, 'framed window'),
    drawMesh(kit, windowWall().mesh, b, { width: 1.3 }),
  );
};
