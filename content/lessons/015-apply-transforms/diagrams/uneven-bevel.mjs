// The end of the stretched bench from above (Numpad 7): the bevel is 8 cm across the end and 2 cm
// along the side, because the object's scale of 0.25 squeezed the 8 cm bevel.
import { views, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { callout } from './helpers.mjs';
import { benchBefore } from './shapes.mjs';

export default (kit) => {
  const v = views.top({ at: [190, 160], scale: 380, target: [0.65, 0, 0] });
  const side = v.project([0.45, 0.24, 0.5]);
  return kit.svg({ width: 400, height: 300 },
    kit.text(200, 24, 'one end of the bench, from above', { anchor: 'middle', size: 12 }),
    drawMesh(kit, benchBefore(), v, { width: 1.4 }),
    dimension(kit, v, [0.92, -0.25, 0.5], [1, -0.25, 0.5], { offset: [0, -0.07, 0], label: '8 cm' }),
    callout(kit, side[0] + 40, side[1] + 52, side[0], side[1], '2 cm'),
  );
};
