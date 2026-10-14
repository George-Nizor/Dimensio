// Wrong: the keyed ball has Animated off, so the simulation thinks it never moved; it passes
// through the wall and every block stays standing. Right: Animated on, and the wall falls.
import { view, drawMesh, join } from '../../../diagrams/mesh.mjs';
import { wall, knocked, ball, ground } from './scene.mjs';
import { panel } from './helpers.mjs';

export default (kit) => {
  const cell = (x, mesh) => {
    const v = view({ azimuth: -35, elevation: 22, at: [x + 110, 110], scale: 32, target: [0.8, 0, 0.5] });
    return [panel(kit, x, 14, 220, 170), drawMesh(kit, ground(3.4), v, { width: 1 }), drawMesh(kit, mesh, v, { width: 1.2 })];
  };
  return kit.svg({ width: 480, height: 220 },
    cell(10, join(wall(), ball(2.4, 0, 0.9))),
    kit.tag(120, 208, 'Animated off', { tone: 'bad' }),
    cell(250, join(knocked(), ball(3, 0, 0.9))),
    kit.tag(360, 208, 'Animated on'),
  );
};
