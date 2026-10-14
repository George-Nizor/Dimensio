// G moves the point onto a grey swatch, and in Material Preview the bands turn that grey.
import { view, keycap } from '../../../diagrams/mesh.mjs';
import { palette, barrel, drawFaces, swatchStyle, swatchUV } from './palette.mjs';

export default (kit) => {
  const { mesh: m, parts } = barrel();
  const x = 20;
  const y = 30;
  const size = 200;
  const from = [x + 0.5 * size, y + (1 - 0.46) * size];
  const [u, v] = swatchUV(1, 1);
  const to = [x + u * size, y + (1 - v) * size];
  const view3 = view({ at: [370, 150], scale: 130, target: [0, 0, 0.6], azimuth: 30, elevation: 22 });
  return kit.svg({ width: 480, height: 270 },
    palette(kit, x, y, size),
    kit.circle(to[0], to[1], 9, { cls: 'd-ink', width: 2 }),
    kit.arcArrow(from[0], from[1], to[0] + 8, to[1] + 6, { lift: -14, cls: 'd-ink' }),
    kit.dot(to[0], to[1], { r: 4.5, cls: 'd-mark-fill' }),
    keycap(kit, 120, 258, 'G'),
    drawFaces(kit, m, view3, (f) => (parts.bands.includes(f) ? swatchStyle(1, 1) : { cls: 'd-face-1', dark: 0 })),
  );
};
