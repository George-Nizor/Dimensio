// The ball as a passive rigid body moved by keys: on frame 10 it waits left of the wall, on
// frame 30 it is past it. With Animated ticked, the simulation sees it move and the wall falls.
import { view, drawMesh, join } from '../../../diagrams/mesh.mjs';
import { wall, ball, ground } from './scene.mjs';
import { checkbox, push } from './helpers.mjs';

export default (kit) => {
  const v = view({ azimuth: -35, elevation: 20, at: [190, 140], scale: 38, target: [0, 0, 0.5] });
  const a = v.project([-3, 0, 0.9]);
  const b = v.project([2.6, 0, 0.9]);
  return kit.svg({ width: 520, height: 240 },
    drawMesh(kit, ground(4.6), v, { width: 1.1 }),
    drawMesh(kit, join(wall(), ball(-3, 0, 0.9)), v, { width: 1.3 }),
    drawMesh(kit, ball(2.6, 0, 0.9), v, { width: 1, mode: 'wire', cls: 'd-guide' }),
    push(kit, a[0] + 16, a[1] - 22, b[0] - 16, b[1] - 22, { width: 2, dash: '6 4' }),
    kit.text(a[0], a[1] + 36, 'frame 10', { anchor: 'middle', size: 12 }),
    kit.text(b[0], b[1] + 36, 'frame 30', { anchor: 'middle', size: 12 }),
    `<rect x="370" y="20" width="140" height="56" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(380, 38, 'Settings', { size: 11 }),
    checkbox(kit, 380, 50, 'Animated', true),
  );
};
