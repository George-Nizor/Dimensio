// wall_2m from the front: 2 m long and 2.5 m tall, standing on the ground, 0.2 m thick from the
// side.
import { views, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { wall, door, translate } from './kit.mjs';

export default (kit) => {
  const v = views.front({ scale: 58, at: [150, 190], target: [0, 0, 0] });
  const side = views.right({ scale: 58, at: [330, 190], target: [0, 0.9, 0] });
  const dv = views.front({ scale: 58, at: [440, 190], target: [0, 0, 0] });
  return kit.svg({ width: 540, height: 230 },
    kit.line(20, 190, 520, 190, { cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, wall(), v, { width: 1.4 }),
    dimension(kit, v, [-1, 0, 2.5], [1, 0, 2.5], { offset: [0, 0, 0.3], label: '2 m' }),
    dimension(kit, v, [-1, 0, 0], [-1, 0, 2.5], { offset: [-0.35, 0, 0], label: '2.5 m' }),
    drawMesh(kit, wall(), side, { width: 1.4 }),
    dimension(kit, side, [0, 0.8, 2.5], [0, 1, 2.5], { offset: [0, 0, 0.3], label: '0.2 m' }),
    drawMesh(kit, translate(door(), [0, 0, 0]), dv, { width: 1.4 }),
    dimension(kit, dv, [-0.5, 0, 0], [-0.5, 0, 2.1], { offset: [0.2, 0, 0], label: '2.1 m' }),
  );
};
