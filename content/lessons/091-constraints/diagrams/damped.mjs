// Damped Track on the turret head, Target set to the Target sphere and Track Axis Y: the barrel,
// which points along the head's Y axis, swings to aim at the target as it moves.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { turret, target, panel } from './yard.mjs';

export default (kit) => {
  const shot = (x0, tgt, label) => {
    const v = view({ azimuth: 30, elevation: 40, at: [x0 + 110, 110], scale: 34, target: [0, 0, 0.5] });
    const yaw = (Math.atan2(-tgt[0], tgt[1]) * 180) / Math.PI;
    const a = v.project([0, 0, 0.65]);
    const b = v.project(tgt);
    return [panel(kit, x0, 14, 220, 160, label), drawMesh(kit, turret([0, 0, 0], yaw), v, { width: 1.1 }), kit.line(a[0], a[1], b[0], b[1], { cls: 'd-mark', width: 1.6, dash: '5 4' }), drawMesh(kit, target(tgt), v, { width: 0.8 })];
  };
  return kit.svg({ width: 500, height: 200 },
    shot(14, [-2.2, 1.2, 0.7], 'target on the left'),
    shot(266, [2.2, 0.6, 0.7], 'target on the right'),
  );
};
