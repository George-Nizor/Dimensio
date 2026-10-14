// The mesh ready to rig: front view with the feet on the ground at the origin, and a top view
// with the face toward -Y, which is the front view's side. The Statistics overlay counts the
// triangles.
import { silhouette, panel, axes2d } from './helpers.mjs';
import { front, parts } from './figure.mjs';

export default (kit) => {
  const s = 110;
  const p = front(120, 236, s);
  return kit.svg({ width: 480, height: 276 },
    panel(kit, 20, 14, 200, 240, 'front, Numpad 1'),
    silhouette(kit, parts(p, s), { width: 1.4 }),
    kit.dot(120, 236, { r: 4.5, cls: 'd-mark-fill' }),
    kit.line(124, 240, 146, 246, { cls: 'd-guide', width: 1 }),
    kit.text(150, 248, 'origin', { size: 11 }),
    `<rect x="30" y="22" width="112" height="22" rx="4" class="d-sunk" stroke-width="1"/>`,
    kit.text(38, 37, 'Triangles 1,412', { size: 11 }),
    panel(kit, 250, 14, 200, 240, 'top, Numpad 7'),
    `<ellipse cx="350" cy="120" rx="44" ry="18" class="d-face-2 d-ink" stroke-width="2"/>`,
    `<ellipse cx="350" cy="120" rx="14" ry="14" class="d-face-1 d-ink" stroke-width="2"/>`,
    kit.polyline([[344, 132], [350, 140], [356, 132]], { cls: 'd-mark', width: 2.4 }),
    axes2d(kit, 268, 232, { length: 30 }),
    kit.text(350, 200, 'faces -Y', { anchor: 'middle', size: 12, cls: 'd-tag' }),
    kit.line(350, 146, 350, 186, { cls: 'd-mark', width: 2 }), kit.arrowhead(350, 186, Math.PI / 2, { size: 8 }),
  );
};
