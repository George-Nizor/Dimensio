// Shape Circle from above: twelve stones spread round the object's origin at the Radius, each one
// turned to follow the circle.
import { views, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { stone, circle } from './shapes.mjs';

export default (kit) => {
  const v = views.top({ at: [200, 130], scale: 90 });
  return kit.svg({ width: 400, height: 260 },
    kit.circle(200, 130, 90, { cls: 'd-guide', width: 1.2, dash: '5 5' }),
    drawMesh(kit, circle(stone(), 12, 1), v, { width: 1.4 }),
    kit.dot(200, 130, { r: 4, cls: 'd-mark-fill' }),
    dimension(kit, v, [0, 0, 0], [1, 0, 0], { offset: [0, -0.18, 0], label: 'Radius' }),
    kit.text(200, 254, 'Shape Circle, Count 12', { anchor: 'middle', size: 12 }),
  );
};
