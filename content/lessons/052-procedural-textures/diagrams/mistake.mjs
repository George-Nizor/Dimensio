// The same Wave Texture on a 2 m plank and a 0.5 m cube. Wrong: Vector left unlinked, so it uses
// Generated coordinates, which stretch the same number of bands over each object. Right: Texture
// Coordinate's Object output, and the bands keep one size on both.
import { box, view, drawMesh } from '../../../diagrams/mesh.mjs';

// Vertical bands across the front (-Y) face of a box, `count` of them per metre or per object.
function banded(kit, v, size, center, bands) {
  const m = box({ size, center });
  const out = [drawMesh(kit, m, v, { width: 1.4 })];
  const [sx, , sz] = size;
  const y = center[1] - size[1] / 2;
  for (let i = 0; i < bands; i += 1) {
    const x0 = center[0] - sx / 2 + (i / bands) * sx;
    const x1 = x0 + sx / bands / 2;
    const pts = [[x0, y, center[2] - sz / 2], [x1, y, center[2] - sz / 2], [x1, y, center[2] + sz / 2], [x0, y, center[2] + sz / 2]].map((p) => v.project(p));
    out.push(`<path d="M ${pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L ')} Z" class="d-dot" stroke-width="0" opacity="0.55"/>`);
  }
  return out;
}

function half(kit, x, generated) {
  const v = view({ at: [x + 128, 104], scale: 72, azimuth: 0, elevation: 16 });
  return [
    banded(kit, v, [2, 0.3, 0.3], [-0.55, 0, 0.15], generated ? 6 : 12),
    banded(kit, v, [0.6, 0.6, 0.6], [1.15, 0, 0.3], generated ? 6 : 4),
    kit.tag(x + 128, 196, generated ? 'Generated: stretched to fit' : 'Object: one size on both', { tone: generated ? 'bad' : 'mark' }),
  ];
}

export default (kit) => kit.svg({ width: 560, height: 210 }, half(kit, 6, true), half(kit, 290, false));
