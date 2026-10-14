// Left, seen from the top: twelve planks turned around the 3D cursor into a ring. Right, the tilted
// sign moved along its own X axis, with a faint outline where it started.
import { view, views, drawMesh } from '../../../diagrams/mesh.mjs';
import { cursor3d } from './parts.mjs';
import { plank, sign } from './planks.mjs';

export default (kit) => {
  const v = views.top({ at: [150, 130], scale: 46 });
  const s = view({ at: [370, 124], scale: 78, target: [5.4, -0.7, 1.4] });
  const [cx, cy] = v.project([0, 0, 0]);
  return kit.svg({ width: 500, height: 260 },
    Array.from({ length: 12 }, (_, k) => drawMesh(kit, plank(30 * k), v, { width: 1.4, cls: k === 0 ? 'd-mark' : 'd-ink' })),
    cursor3d(kit, cx, cy, { r: 9 }),
    drawMesh(kit, sign(0), s, { mode: 'wire', cls: 'd-guide', width: 1.1 }),
    drawMesh(kit, sign(1), s, { width: 1.6 }),
    kit.text(150, 250, 'twelve planks round the cursor', { anchor: 'middle', size: 12 }),
    kit.text(380, 250, 'the sign along its own X', { anchor: 'middle', size: 12 }),
  );
};
