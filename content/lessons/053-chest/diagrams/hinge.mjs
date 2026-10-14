// The chest from the right (Numpad 3). The 3D cursor sits on the body's top back edge, and the lid's
// origin has been set there, so turning the lid on X swings it open around the hinge.
import { views } from '../../../diagrams/mesh.mjs';
import { body, lid, band, openOnHinge, drawParts, SIZE } from './chest.mjs';
import { drawPainted } from './painted.mjs';

export default (kit) => {
  const v = views.right({ at: [210, 200], scale: 150, target: [0, 0, 0.4] });
  const [hx, hy] = v.project([0, SIZE.depth / 2, SIZE.height]);
  return kit.svg({ width: 420, height: 300 },
    `<g opacity="0.35">${drawParts(kit, v, [lid()], drawPainted).flat(Infinity).join('')}</g>`,
    drawParts(kit, v, [openOnHinge(lid(), -60), openOnHinge(band(0.4), -60), body()], drawPainted),
    kit.circle(hx, hy, 9, { cls: 'd-bad', width: 2, dash: '4 3' }),
    kit.dot(hx, hy, { r: 4, cls: 'd-mark-fill' }),
    kit.arcArrow(hx - 128, hy - 40, hx - 70, hy - 128, { lift: -20 }),
    kit.text(hx + 14, hy + 30, 'cursor and origin', { size: 12, anchor: 'start' }),
    kit.text(hx + 14, hy + 46, 'on the hinge', { size: 12, anchor: 'start' }),
  );
};
