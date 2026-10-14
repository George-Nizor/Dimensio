// Poly Build on a strip of quads: Ctrl+click adds a face to the nearest edge, dragging an edge pulls
// out a new quad, and Shift+click deletes the face under the mouse.
import { cursor } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const quad = (pts, cls = 'd-ink', dash) => kit.polyline([...pts, pts[0]], { cls, width: 2, dash });
  const x0 = 40;
  const y0 = 70;
  const s = 70;
  const strip = [0, 1, 2].map((i) => [[x0 + i * s, y0], [x0 + (i + 1) * s, y0], [x0 + (i + 1) * s, y0 + s], [x0 + i * s, y0 + s]]);
  return kit.svg({ width: 500, height: 230 },
    strip.map((q) => quad(q)),
    `<path d="M ${x0 + 3 * s} ${y0} L ${x0 + 3 * s + 60} ${y0 + 30} L ${x0 + 3 * s} ${y0 + s} Z" class="d-face-sel"/>`,
    quad([[x0 + 3 * s, y0], [x0 + 3 * s + 60, y0 + 30], [x0 + 3 * s, y0 + s]], 'd-mark', '5 4'),
    cursor(kit, x0 + 3 * s + 58, y0 + 28),
    kit.text(x0 + 3 * s + 76, y0 + 34, 'Ctrl+click: add', { size: 12 }),
    kit.line(x0, y0 + s, x0 + s, y0 + s, { cls: 'd-mark', width: 3.4 }),
    quad([[x0, y0 + s], [x0 + s, y0 + s], [x0 + s, y0 + s + 50], [x0, y0 + s + 50]], 'd-mark', '5 4'),
    kit.line(x0 + s / 2, y0 + s + 8, x0 + s / 2, y0 + s + 40, { cls: 'd-mark', width: 2 }), kit.arrowhead(x0 + s / 2, y0 + s + 42, Math.PI / 2, { size: 7 }),
    kit.text(x0 + s + 14, y0 + s + 40, 'drag an edge: new quad', { size: 12 }),
    `<path d="M ${x0 + 2 * s} ${y0} L ${x0 + 3 * s} ${y0} L ${x0 + 3 * s} ${y0 + s} L ${x0 + 2 * s} ${y0 + s} Z" class="d-key-bad" fill-opacity="0.18" stroke-width="0"/>`,
    quad(strip[2], 'd-bad'),
    kit.text(x0 + 2.5 * s, y0 - 14, 'Shift+click: delete', { anchor: 'middle', size: 12 }),
  );
};
