// The exercise after this lesson: the camera rides along with the cart and keeps aiming at it, and the
// turret's barrel points at the target wherever it moves. Dashed lines show where each one aims.
import { view, drawMesh, box } from '../../../diagrams/mesh.mjs';
import { cart, turret, target, camera } from './yard.mjs';

export default (kit) => {
  const v = view({ azimuth: 35, elevation: 30, at: [260, 160], scale: 36, target: [0.5, 0, 0.8] });
  const cartAt = [1, 0, 0.45];
  const cam = [-3, -4.5, 2.2];
  const tgt = [-1.5, -1.5, 2.2];
  const tur = [3, 4, 0];
  const yaw = (Math.atan2(-(tgt[0] - tur[0]), tgt[1] - tur[1]) * 180) / Math.PI;
  const aim = (a, b) => { const p = v.project(a); const q = v.project(b); return kit.line(p[0], p[1], q[0], q[1], { cls: 'd-mark', width: 1.6, dash: '5 4' }); };
  return kit.svg({ width: 500, height: 300 },
    drawMesh(kit, box({ size: [9, 9, 0.02], center: [0.5, -0.2, -0.01] }), v, { width: 0.8, cls: 'd-guide' }),
    drawMesh(kit, turret(tur, yaw), v, { width: 1 }),
    aim([tur[0], tur[1], 0.65], tgt),
    drawMesh(kit, target(tgt), v, { width: 0.8 }),
    drawMesh(kit, cart(1), v, { width: 1.1 }),
    aim(cam, cartAt),
    drawMesh(kit, camera(cam, cartAt, 1.3), v, { width: 1.2 }),
    kit.text(v.project(cam)[0] - 10, v.project(cam)[1] + 30, 'camera', { anchor: 'end', size: 12 }),
    kit.text(v.project([1, 0, 0])[0] + 40, v.project([1, 0, 0])[1] + 6, 'cart', { size: 12 }),
    kit.text(v.project(tur)[0] + 30, v.project(tur)[1] + 12, 'turret', { size: 12 }),
    kit.text(v.project(tgt)[0] - 14, v.project(tgt)[1] - 10, 'target', { anchor: 'end', size: 12 }),
  );
};
