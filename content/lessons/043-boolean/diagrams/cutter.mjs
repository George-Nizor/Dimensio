// The window's cutter: a box the size of the window, deeper than the wall so it sticks out of both
// sides, placed where the window goes.
import { box, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { cutter, wallView } from './shapes.mjs';

export default (kit) => {
  const v = wallView([200, 110], 62);
  return kit.svg({ width: 420, height: 236 },
    drawMesh(kit, box({ size: [4, 0.2, 2.5], center: [0, 0, 1.25] }), v, { width: 1.4 }),
    drawMesh(kit, cutter(), v, { mode: 'xray', width: 1.6, cls: 'd-mark' }),
    
    kit.text(200, 226, 'the cutter goes right through the wall', { anchor: 'middle', size: 12 }),
  );
};
