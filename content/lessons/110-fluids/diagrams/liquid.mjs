// Liquid: the tub set to Effector, and a ball above it turned to water by Quick Liquid, inside
// the Liquid Domain it adds. The ball's Flow Behavior, Geometry, makes its whole volume water once.
import { view, drawMesh, uvSphere } from '../../../diagrams/mesh.mjs';
import { tub, domain } from './scene.mjs';
import { field, push } from './helpers.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 24, at: [140, 190], scale: 110, target: [0, 0, 0] });
  const ball = v.project([0, 0, 0.62]);
  return kit.svg({ width: 500, height: 250 },
    drawMesh(kit, domain([1.4, 1.4, 1.3], [0, 0, 0.65]), v, { mode: 'wire', cls: 'd-guide', width: 1 }),
    drawMesh(kit, tub(), v, { width: 1.2 }),
    drawMesh(kit, uvSphere({ segments: 12, rings: 6, radius: 0.22, center: [0, 0, 0.9] }), v, { mode: 'wire', cls: 'd-mark', width: 1.1 }),
    push(kit, ball[0], ball[1] - 2, ball[0], ball[1] + 26, { width: 2 }),
    kit.text(290, 50, 'ball: Quick Liquid', { size: 12, cls: 'd-tag' }),
    field(kit, 290, 60, 200, 'Flow Behavior', 'Geometry', { labelWidth: 0.5 }),
    kit.text(290, 120, 'tub: Fluid, Type Effector', { size: 12 }),
    field(kit, 290, 130, 200, 'Effector Type', 'Collision', { labelWidth: 0.5 }),
    kit.text(290, 196, 'domain: Liquid Domain', { size: 12 }),
  );
};
