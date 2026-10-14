// The three lights' jobs, from above: the key, the brightest, in front and to one side; the fill on
// the other side at half the key's power or less; the rim behind the prop.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { crate, area, camera } from './lights.mjs';

export default (kit) => {
  const v = views.top({ scale: 62, at: [170, 112], target: [0, 0, 0] });
  const at = (x, y) => v.project([x, y, 0]);
  const aim = (x, y) => { const [px, py] = at(x, y); const [cx, cy] = at(0, 0); return [px, py, Math.atan2(cy - py, cx - px)]; };
  const [kx, ky, ka] = aim(-2.0, -1.2);
  const [fx, fy, fa] = aim(2.0, -1.0);
  const [rx, ry, ra] = aim(0.6, 1.5);
  const [cx, cy, ca] = aim(0, -1.75);
  return kit.svg({ width: 500, height: 250 },
    drawMesh(kit, crate(), v, { width: 1.4 }),
    area(kit, kx, ky, ka, { size: 36 }), area(kit, fx, fy, fa, { size: 26 }), area(kit, rx, ry, ra, { size: 22 }),
    camera(kit, cx, cy, ca),
    kit.text(320, 80, 'key: the brightest', { size: 12 }),
    kit.text(320, 108, 'fill: half the key or less', { size: 12 }),
    kit.text(320, 136, 'rim: behind, for edges', { size: 12 }),
    kit.text(kx, ky + 34, 'key', { size: 12, anchor: 'middle', cls: 'd-tag' }),
    kit.text(fx, fy + 30, 'fill', { size: 12, anchor: 'middle', cls: 'd-tag' }),
    kit.text(rx + 22, ry - 6, 'rim', { size: 12, cls: 'd-tag' }),
  );
};
