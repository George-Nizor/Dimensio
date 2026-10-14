// Landing: the ground's Collision with Damping and Friction at 1 in its Particle panel, so the
// leaves stop where they land, and Bake in the particle system's Cache panel.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { ground, falling } from './scene.mjs';
import { field, button, leaf } from './helpers.mjs';

export default (kit) => {
  const v = view({ azimuth: 10, elevation: 28, at: [130, 110], scale: 30, target: [1.2, 0, 0] });
  return kit.svg({ width: 500, height: 210 },
    drawMesh(kit, ground(5), v, { width: 1 }),
    falling(40, { landed: 1, drift: 0.35, seed: 9 }).map(([x, y, z, turn]) => { const [px, py] = v.project([x, y, z]); return leaf(kit, px, py, { size: 5, angle: turn * 0.2 }); }),
    `<rect x="270" y="10" width="220" height="190" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(282, 30, 'Ground: Collision > Particle', { size: 11 }),
    field(kit, 280, 40, 200, 'Damping', '1', { on: true, labelWidth: 0.45 }),
    field(kit, 280, 68, 200, 'Friction', '1', { on: true, labelWidth: 0.45 }),
    kit.text(282, 120, 'Canopy: Particles > Cache', { size: 11 }),
    button(kit, 290, 132, 180, 'Bake', { on: true }),
  );
};
