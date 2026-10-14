// The bands' UVs in the UV Editor, over the palette. After Unwrap they are a strip; S, 0 and Enter
// shrink the strip to a single point at its middle.
import { keycap } from '../../../diagrams/mesh.mjs';
import { palette } from './palette.mjs';

export default (kit) => {
  const x = 30;
  const y = 20;
  const size = 220;
  const strip = [[0.08, 0.42], [0.92, 0.42], [0.92, 0.5], [0.08, 0.5]].map(([u, v]) => [x + u * size, y + (1 - v) * size]);
  const [cx, cy] = [x + 0.5 * size, y + (1 - 0.46) * size];
  return kit.svg({ width: 450, height: 260 },
    `<g opacity="0.45">${palette(kit, x, y, size).flat(Infinity).join('')}</g>`,
    kit.polyline([...strip, strip[0]], { cls: 'd-mark', width: 2, dash: '6 4' }),
    kit.line(strip[0][0] + 6, cy, cx - 12, cy, { cls: 'd-mark', width: 1.6 }), kit.arrowhead(cx - 12, cy, 0, { size: 7 }),
    kit.line(strip[1][0] - 6, cy, cx + 12, cy, { cls: 'd-mark', width: 1.6 }), kit.arrowhead(cx + 12, cy, Math.PI, { size: 7 }),
    kit.dot(cx, cy, { r: 5, cls: 'd-mark-fill' }),
    keycap(kit, 300, 90, 'S'), keycap(kit, 336, 90, '0'), keycap(kit, 384, 90, 'Enter', { size: 12 }),
    kit.text(340, 134, 'the strip becomes', { anchor: 'middle', size: 12 }),
    kit.text(340, 150, 'a single point', { anchor: 'middle', size: 12 }),
  );
};
