// Wrong: Lifetime left at 50 frames, so each leaf vanishes two seconds after it leaves the
// canopy, halfway down. Right: Lifetime 250, and the leaves reach the ground.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { tree, ground, falling } from './scene.mjs';
import { panel, leaf } from './helpers.mjs';

export default (kit) => {
  const cell = (x, short) => {
    const v = view({ azimuth: 10, elevation: 14, at: [x + 90, 168], scale: 30, target: [0, 0, 0] });
    const leaves = falling(36, { drift: 0.5, seed: 3, landed: short ? 0 : 0.5 }).filter(([, , z]) => !short || z > 1.6);
    return [panel(kit, x, 14, 220, 170), drawMesh(kit, ground(3.8), v, { width: 1 }), drawMesh(kit, tree(), v, { width: 1 }),
      leaves.map(([lx, ly, lz, turn]) => { const [px, py] = v.project([lx, ly, lz]); return leaf(kit, px, py, { size: 4.5, angle: turn }); })];
  };
  return kit.svg({ width: 480, height: 214 },
    cell(10, true),
    kit.tag(120, 206, 'Lifetime 50', { tone: 'bad' }),
    cell(250, false),
    kit.tag(360, 206, 'Lifetime 250'),
  );
};
