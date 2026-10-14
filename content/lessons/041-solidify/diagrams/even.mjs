// The L-shaped wall from above, 20 cm thick. Without Even Thickness the corner is thinner than the
// rest of the wall; with it, the wall keeps one thickness round the corner.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { solidify, panel } from '../../037-modifiers/diagrams/modkit.mjs';
import { lWall } from './shapes.mjs';

export default (kit) => {
  const t = 0.8;
  const v1 = views.top({ at: [70, 152], scale: 34, target: [0, 0, 0] });
  const v2 = views.top({ at: [320, 152], scale: 34, target: [0, 0, 0] });
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 232, 186, 'Even Thickness off'),
    drawMesh(kit, solidify(lWall(), t), v1, { width: 1.6 }),
    kit.text(130, 180, 'thin at the corner', { anchor: 'middle', size: 12 }),
    panel(kit, 264, 14, 232, 186, 'Even Thickness on'),
    drawMesh(kit, solidify(lWall(), t, { even: true }), v2, { width: 1.6 }),
    kit.text(380, 180, 'the same all round', { anchor: 'middle', size: 12 }),
  );
};
