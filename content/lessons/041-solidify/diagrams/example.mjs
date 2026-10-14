// The exercise's three objects, each a surface given thickness by a Solidify modifier: a banner, a
// bowl and an L-shaped wall.
import { view, drawMesh, translate, scale } from '../../../diagrams/mesh.mjs';
import { solidify } from '../../037-modifiers/diagrams/modkit.mjs';
import { openBowl, standingPlane, lWall } from './shapes.mjs';

export default (kit) => {
  const banner = solidify(standingPlane(1, 2), 0.05);
  const bowl = solidify(openBowl(0.6), 0.06);
  const wall = scale(solidify(lWall(), 0.25, { even: true }), [0.32, 0.32, 0.32]);
  const v = (x) => view({ at: [x, 160], scale: 70, elevation: 30 });
  return kit.svg({ width: 520, height: 220 },
    drawMesh(kit, banner, v(80), { width: 1.2 }),
    drawMesh(kit, bowl, v(250), { width: 0.8 }),
    drawMesh(kit, translate(wall, [-0.6, -0.4, 0]), v(400), { width: 1.2 }),
    kit.text(80, 208, 'banner', { anchor: 'middle', size: 12 }),
    kit.text(250, 208, 'bowl', { anchor: 'middle', size: 12 }),
    kit.text(420, 208, 'wall', { anchor: 'middle', size: 12 }),
  );
};
