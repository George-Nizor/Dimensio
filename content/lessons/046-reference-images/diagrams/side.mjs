// The two pictures, each in its own view: the front picture in the front view (Numpad 1) and the
// side picture in the right view (Numpad 3), the same size and on the same ground.
import { views } from '../../../diagrams/mesh.mjs';
import { picture } from './shapes.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const v1 = views.front({ at: [130, 206], scale: 180, target: [0, 0, 0] });
  const v2 = views.right({ at: [380, 206], scale: 180, target: [0, 0, 0] });
  return kit.svg({ width: 510, height: 244 },
    panel(kit, 14, 14, 232, 206, 'Numpad 1: front picture'),
    picture(kit, v1),
    panel(kit, 264, 14, 232, 206, 'Numpad 3: side picture'),
    picture(kit, v2, { side: true }),
    kit.line(22, 26, 488, 26, { cls: 'd-guide', width: 1, dash: '5 5' }),
  );
};
