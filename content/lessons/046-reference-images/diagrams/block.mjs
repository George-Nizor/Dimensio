// Blocking out over the pictures: the cube scaled to the blade in the front view, then in the
// right view.
import { views, box, drawMesh } from '../../../diagrams/mesh.mjs';
import { picture } from './shapes.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const blade = box({ size: [0.31, 0.12, 0.5], center: [0, 0, 0.634] });
  const v1 = views.front({ at: [130, 210], scale: 180, target: [0, 0, 0] });
  const v2 = views.right({ at: [380, 210], scale: 180, target: [0, 0, 0] });
  return kit.svg({ width: 510, height: 250 },
    panel(kit, 14, 14, 232, 210, 'front'),
    picture(kit, v1),
    drawMesh(kit, blade, v1, { mode: 'wire', width: 2, cls: 'd-mark' }),
    panel(kit, 264, 14, 232, 210, 'right'),
    picture(kit, v2, { side: true }),
    drawMesh(kit, blade, v2, { mode: 'wire', width: 2, cls: 'd-mark' }),
  );
};
