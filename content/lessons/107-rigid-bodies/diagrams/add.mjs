// The wall's blocks made active, with an arrow showing gravity pulling them down, and the ground
// made passive, so it holds still and catches them. The ball is made passive in step 4.
import { view, drawMesh, join } from '../../../diagrams/mesh.mjs';
import { wall, ball, ground } from './scene.mjs';
import { menuPath, push } from './helpers.mjs';

export default (kit) => {
  const v = view({ azimuth: -35, elevation: 20, at: [200, 140], scale: 46, target: [-0.8, 0, 0.5] });
  const top = v.project([0, 0, 2.2]);
  return kit.svg({ width: 520, height: 240 },
    drawMesh(kit, ground(4), v, { width: 1.2 }),
    drawMesh(kit, join(wall(), ball(-2.4)), v, { width: 1.4 }),
    push(kit, top[0], top[1] - 30, top[0], top[1] - 4, { width: 2 }),
    kit.text(top[0] + 8, top[1] - 24, 'active', { size: 12, cls: 'd-tag' }),
    kit.text(110, 214, 'ground: passive', { size: 12 }),
    menuPath(kit, 330, 50, ['Object', 'Rigid Body'], { size: 10 }).svg,
    menuPath(kit, 350, 80, ['Add Active'], { size: 10 }).svg,
    menuPath(kit, 350, 108, ['Add Passive'], { size: 10 }).svg,
    kit.text(436, 95, 'blocks', { size: 11 }),
    kit.text(436, 123, 'ground', { size: 11 }),
  );
};
