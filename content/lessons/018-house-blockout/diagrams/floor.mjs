// The plot from above (Numpad 7) with the floor on it, its 5 m and 4 m sides measured.
import { views, dimension } from '../../../diagrams/mesh.mjs';
import { plot, path, floor, drawParts } from './shapes.mjs';

export default (kit) => {
  const v = views.top({ at: [200, 160], scale: 36, target: [0, 0, 0] });
  return kit.svg({ width: 400, height: 300 },
    kit.text(200, 22, 'the plot from above, with the floor', { anchor: 'middle', size: 12 }),
    drawParts(kit, v, [floor()], { under: [plot(), path()] }),
    dimension(kit, v, [-2.5, 2, 0.2], [2.5, 2, 0.2], { offset: [0, 0.45, 0], label: '5 m' }),
    dimension(kit, v, [2.5, -2, 0.2], [2.5, 2, 0.2], { offset: [1.1, 0, 0], label: '4 m' }),
  );
};
