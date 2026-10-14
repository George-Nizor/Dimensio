// The front wall from the front (Numpad 1): two pieces 0.9 m apart and a lintel across the top,
// leaving a doorway 0.9 m wide and 2.1 m high. The 1.8 m figure stands beside the house.
import { views, dimension } from '../../../diagrams/mesh.mjs';
import { floor, frontWall, figure, drawParts } from './shapes.mjs';

export default (kit) => {
  const v = views.front({ at: [262, 150], scale: 54, target: [-0.6, 0, 1.3] });
  return kit.svg({ width: 520, height: 290 },
    drawParts(kit, v, [...frontWall(), figure(-3.4, -2.6)], { under: [floor()] }),
    dimension(kit, v, [-0.45, -2, 0.2], [0.45, -2, 0.2], { offset: [0, 0, -0.5], label: '0.9 m' }),
    dimension(kit, v, [-0.45, -2, 0.2], [-0.45, -2, 2.3], { offset: [-0.4, 0, 0], label: '2.1 m' }),
    dimension(kit, v, [-3.62, -2.7, 0], [-3.62, -2.7, 1.8], { offset: [-0.4, 0, 0], label: '1.8 m' }),
  );
};
