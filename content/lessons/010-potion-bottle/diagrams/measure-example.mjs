// The bottle from the front with its width, 0.32 m, and its height, 0.4 m, measured.
import { views, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { body, neck, cork } from './bottle.mjs';

export default (kit) => {
  const v = views.front({ at: [190, 140], scale: 480, target: [0, 0, 0.2] });
  return kit.svg({ width: 400, height: 290 },
    drawMesh(kit, body(), v, { width: 1.5 }),
    drawMesh(kit, neck(), v, { width: 1.5 }),
    drawMesh(kit, cork(), v, { width: 1.5 }),
    dimension(kit, v, [-0.16, 0, 0], [0.16, 0, 0], { offset: [0, 0, -0.05], label: '0.32 m' }),
    dimension(kit, v, [0.16, 0, 0], [0.16, 0, 0.4], { offset: [0.12, 0, 0], label: '0.4 m' }),
  );
};
