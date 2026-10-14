// The front picture after Size 1 m and Offset Y 0: 1 m tall, its bottom edge on the ground.
import { views, dimension } from '../../../diagrams/mesh.mjs';
import { picture, frontWidth } from './shapes.mjs';

export default (kit) => {
  const v = views.front({ at: [190, 220], scale: 190, target: [0, 0, 0] });
  const [, gy] = v.project([0, 0, 0]);
  return kit.svg({ width: 420, height: 250 },
    picture(kit, v),
    kit.line(20, gy, 400, gy, { cls: 'd-axis-x', width: 1.4 }),
    dimension(kit, v, [frontWidth / 2, 0, 0], [frontWidth / 2, 0, 1], { offset: [0.12, 0, 0], label: '1 m' }),
    kit.text(30, gy - 8, 'ground', { size: 12 }),
  );
};
