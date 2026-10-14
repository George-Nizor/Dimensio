// The exercise: a wall with a window cut through it, and a lock with a keyhole, both made with the
// Boolean modifier.
import { view, drawMesh, box } from '../../../diagrams/mesh.mjs';
import { wallWithWindow, wallView } from './shapes.mjs';

// The keyhole's outline on the lock's front face: a circle 3 cm across the top of a slot.
function keyhole(v) {
  const pts = [[-0.0125, 0.12], [0.0125, 0.12]];
  const start = -Math.acos(0.0125 / 0.03);
  for (let k = 0; k <= 16; k += 1) {
    const t = start + ((Math.PI - 2 * start) * k) / 16;
    pts.push([0.03 * Math.cos(t), 0.21 + 0.03 * Math.sin(t)]);
  }
  return pts.map(([x, z]) => v.project([x, -0.0601, z]));
}

export default (kit) => {
  const lock = box({ size: [0.3, 0.12, 0.36], center: [0, 0, 0.18] });
  const lv = view({ at: [430, 186], scale: 330, target: [0, 0, 0] });
  const hole = keyhole(lv);
  return kit.svg({ width: 520, height: 230 },
    drawMesh(kit, wallWithWindow('tidy'), wallView([160, 110], 52), { width: 1.2 }),
    drawMesh(kit, lock, lv, { width: 1.2 }),
    `<path d="M ${hole.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z" class="d-face-3"/>`,
    kit.polyline([...hole, hole[0]], { cls: 'd-ink', width: 1.2 }),
    kit.text(150, 222, 'wall with a window', { anchor: 'middle', size: 12 }),
    kit.text(430, 222, 'lock with a keyhole', { anchor: 'middle', size: 12 }),
  );
};
