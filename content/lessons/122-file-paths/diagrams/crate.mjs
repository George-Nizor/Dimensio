// The exercise's crate drawn two ways, for this lesson's diagrams. Not a diagram itself. Textured,
// its faces carry plank lines; missing, every face is filled with the warning colour, as Blender
// shows a texture it can't find in pink.
import { cube, scale, translate, view, drawMesh, normal } from '../../../diagrams/mesh.mjs';

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export function crate(kit, at, { size = 60, missing = false } = {}) {
  const m = translate(scale(cube(), [0.5, 0.5, 0.5]), [0, 0, 0.5]);
  const v = view({ scale: size, at });
  const out = [drawMesh(kit, m, v, { width: 1.6 })];
  for (const f of m.faces) {
    const n = normal(m, f);
    if (n[0] * v.toward[0] + n[1] * v.toward[1] + n[2] * v.toward[2] <= 0) continue;
    const p = f.map((i) => v.project(m.verts[i]));
    if (missing) {
      out.push(`<path d="M ${p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z" class="d-key-bad" stroke-width="1.6" style="stroke:var(--d-ink)"/>`);
      continue;
    }
    // Plank lines across the face, a quarter of the way apart, between two opposite edges.
    const vertical = Math.abs(n[2]) < 0.5;
    const [a, b, c, d] = p;
    for (const t of [0.25, 0.5, 0.75]) {
      const [s, e] = vertical ? [lerp(a, d, t), lerp(b, c, t)] : [lerp(a, b, t), lerp(d, c, t)];
      out.push(kit.line(s[0], s[1], e[0], e[1], { cls: 'd-guide', width: 1.4 }));
    }
  }
  return out;
}
