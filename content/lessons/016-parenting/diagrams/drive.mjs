// The car from the right after moving the empty 6 m along -Y: the body follows the empty, and the
// wheels and cabin follow the body. The dashed outline is where the car started.
import { views, drawMesh, arrow } from '../../../diagrams/mesh.mjs';
import { car, plainAxes } from './shapes.mjs';

export default (kit) => {
  const v = views.right({ at: [340, 110], scale: 40, target: [0, -3, 0.6] });
  return kit.svg({ width: 520, height: 200 },
    kit.line(20, v.project([0, 0, 0])[1], 500, v.project([0, 0, 0])[1], { cls: 'd-guide', width: 1 }),
    drawMesh(kit, car().mesh, v, { mode: 'wire', cls: 'd-guide', width: 1 }),
    drawMesh(kit, car({ shift: [0, -6, 0] }).mesh, v, { width: 1.3 }),
    plainAxes(kit, v, [0, -6, 0], 0.5),
    arrow(kit, v, [0, -0.6, -0.6], [0, -5.4, -0.6]),
    kit.text(v.project([0, -3, -0.6])[0], v.project([0, -3, -0.6])[1] + 22, 'G Y -6 on the empty', { anchor: 'middle', size: 12 }),
  );
};
