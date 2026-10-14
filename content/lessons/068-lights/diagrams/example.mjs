// The exercise's three-light setup seen from above: the crate and the barrel in the middle, the
// camera in front, a key light front left, a weaker fill front right and a rim light behind.
import { views, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { crate, barrel, area, camera } from './lights.mjs';

export default (kit) => {
  const v = views.top({ scale: 66, at: [250, 118], target: [0, 0, 0] });
  const at = (x, y) => v.project([x, y, 0]);
  const aim = (x, y) => { const [px, py] = at(x, y); const [cx, cy] = at(0, 0); return [px, py, Math.atan2(cy - py, cx - px)]; };
  const [kx, ky, ka] = aim(-2.5, -1.6);
  const [fx, fy, fa] = aim(2.8, -1.0);
  const [rx, ry, ra] = aim(0.9, 1.6);
  const [cx, cy, caAngle] = aim(1.6, -1.8);
  return kit.svg({ width: 500, height: 250 },
    drawMesh(kit, translate(crate(), [-0.5, 0.15, 0]), v, { width: 1.3 }),
    drawMesh(kit, translate(barrel(), [0.5, -0.1, 0]), v, { width: 1.1 }),
    area(kit, kx, ky, ka, { size: 34 }), kit.text(kx - 8, ky + 34, 'key', { size: 12, anchor: 'middle', cls: 'd-tag' }),
    area(kit, fx, fy, fa, { size: 26 }), kit.text(fx + 6, fy + 30, 'fill', { size: 12, anchor: 'middle', cls: 'd-tag' }),
    area(kit, rx, ry, ra, { size: 22 }), kit.text(rx + 24, ry - 4, 'rim', { size: 12, cls: 'd-tag' }),
    camera(kit, cx, cy, caAngle), kit.text(cx + 16, cy + 22, 'camera', { size: 12 }),
  );
};
