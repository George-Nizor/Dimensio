// The three roles in a fluid simulation, each a Type in the Physics tab's Fluid panel: the
// Domain box everything happens in, a Flow that adds fluid, and an Effector it flows around.
import { view, drawMesh, box } from '../../../diagrams/mesh.mjs';
import { flame, puff } from './scene.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 20, at: [200, 210], scale: 70, target: [0, 0, 0] });
  const flow = box({ size: [0.4, 0.4, 0.2], center: [-0.5, 0, 0.1] });
  const wall = box({ size: [0.2, 1, 0.8], center: [0.5, 0, 1.4] });
  const f = v.project([-0.5, 0, 0.2]);
  const w = v.project([0.5, -0.5, 1.8]);
  return kit.svg({ width: 480, height: 250 },
    drawMesh(kit, box({ size: [2, 2, 2.6], center: [0, 0, 1.3] }), v, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
    puff(kit, f[0] + 24, f[1] - 104, 12), puff(kit, f[0] - 4, f[1] - 62, 10),
    drawMesh(kit, flow, v, { width: 1.3 }),
    flame(kit, f[0], f[1] - 4, 40),
    drawMesh(kit, wall, v, { width: 1.3 }),
    kit.text(30, 40, 'Domain: the box', { size: 12 }),
    kit.text(30, 236, 'Flow: adds fluid', { size: 12, cls: 'd-tag' }),
    kit.text(w[0] + 50, w[1] - 6, 'Effector:', { size: 12 }),
    kit.text(w[0] + 50, w[1] + 12, 'fluid flows round it', { size: 12 }),
  );
};
