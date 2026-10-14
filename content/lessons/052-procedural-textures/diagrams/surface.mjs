// Drawing patterns on flat patches in 3D, for this lesson's diagrams. Not a diagram itself. A patch
// is a rectangle on the floor (Z = 0) from [x0, y0] to [x1, y1]; points on it are given as (s, t)
// from 0 to 1 and projected through a mesh-kit view.
import { cells, noise } from './patterns.mjs';

export const onPatch = (v, [x0, y0, x1, y1], z = 0) => (s, t) => v.project([x0 + (x1 - x0) * s, y0 + (y1 - y0) * t, z]);

const d = (pts) => `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;

// Planks along X across the patch, each with wavy grain lines along its length.
export function planks(kit, v, rect, { count = 5, grain = 3, seed = 11, stretch = 1 } = {}) {
  const at = onPatch(v, rect);
  const n = noise(seed, 3);
  const out = [];
  for (let p = 0; p < count; p += 1) {
    const t0 = p / count + 0.008;
    const t1 = (p + 1) / count - 0.008;
    const corners = [at(0, t0), at(1, t0), at(1, t1), at(0, t1)];
    out.push(`<path d="${d(corners)}" class="d-face-sel" stroke-width="0"/>`);
    for (let g = 0; g < grain; g += 1) {
      const base = t0 + ((g + 0.5) / grain) * (t1 - t0);
      const pts = [];
      for (let k = 0; k <= 40; k += 1) {
        const s = k / 40;
        const wobble = (n(s * 2 / stretch + p, g * 0.37 + p) - 0.5) * (t1 - t0) * 0.7;
        pts.push(at(s, Math.min(t1, Math.max(t0, base + wobble))));
      }
      out.push(kit.smooth(pts, { cls: 'd-mark', width: 1.1 }));
    }
    out.push(kit.polyline([...corners, corners[0]], { cls: 'd-ink', width: 1.2 }));
  }
  return out;
}

// Stones: Voronoi cells shrunk a little towards their middles, with the dark gaps between them.
export function stones(kit, v, rect, { count = 4, seed = 5, gap = 0.12 } = {}) {
  const at = onPatch(v, rect);
  const out = [`<path d="${d([at(0, 0), at(1, 0), at(1, 1), at(0, 1)])}" class="d-dot" stroke-width="0" opacity="0.75"/>`];
  for (const { poly } of cells(seed, count)) {
    const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
    const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
    const shrunk = poly.map(([x, y]) => [cx + (x - cx) * (1 - gap), cy + (y - cy) * (1 - gap)]);
    out.push(`<path d="${d(shrunk.map(([s, t]) => at(s, t)))}" class="d-face-2" stroke-width="0"/>`);
  }
  out.push(kit.polyline([at(0, 0), at(1, 0), at(1, 1), at(0, 1), at(0, 0)], { cls: 'd-ink', width: 1.2 }));
  return out;
}
