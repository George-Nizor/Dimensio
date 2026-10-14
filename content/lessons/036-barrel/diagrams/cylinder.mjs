// Add > Mesh > Cylinder with Vertices 12, Radius 0.55 m and Depth 1.2 m, then moved up 0.6 m in
// Edit Mode so it stands on the ground with its origin at the middle of its base.
import { view, dimension } from '../../../diagrams/mesh.mjs';
import { barrel, RADIUS, HEIGHT } from './barrel.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 22, elevation: 20, at: [200, 126], scale: 140, target: [0, 0, 0.6] });
  const [ox, oy] = v.project([0, 0, 0]);
  return kit.svg({ width: 460, height: 250 },
    paint(kit, barrel('cylinder'), v, { width: 1.5 }),
    kit.dot(ox, oy, { r: 4, cls: 'd-mark-fill' }),
    dimension(kit, v, [RADIUS, 0, 0], [RADIUS, 0, HEIGHT], { offset: [0.3, 0, 0], label: '1.2 m' }),
    dimension(kit, v, [0, -RADIUS, HEIGHT], [0, 0, HEIGHT], { offset: [-0.75, 0, 0], label: '0.55 m' }),
  );
};
