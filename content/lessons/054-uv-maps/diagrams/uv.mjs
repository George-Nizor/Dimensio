// UV maps for this lesson's diagrams. Not a diagram itself. A UV map is a list with one entry per
// face of a mesh: the face's corners as [u, v] pairs from 0 to 1, in the same order as the face's
// vertices. drawTextured() draws the mesh with a test grid laid on it through those UVs, so a face
// whose UVs are squashed shows squashed grid cells, as Blender's UV Grid image does. uvSquare() and
// drawUVs() draw the UV Editor's square with the faces laid flat on it.
import { normal, centroid } from '../../../diagrams/mesh.mjs';

const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const d2 = (pts) => `M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z`;

// The part of the line where one UV coordinate (axis 0 for u, 1 for v) equals `value`, inside a
// triangle, as two screen points; null when the line misses it.
function isoSegment(uvs, pts, axis, value) {
  const hits = [];
  for (let i = 0; i < 3; i += 1) {
    const j = (i + 1) % 3;
    const a = uvs[i][axis] - value;
    const b = uvs[j][axis] - value;
    if ((a < 0 && b > 0) || (a > 0 && b < 0)) {
      const t = a / (a - b);
      hits.push([pts[i][0] + (pts[j][0] - pts[i][0]) * t, pts[i][1] + (pts[j][1] - pts[i][1]) * t]);
    }
  }
  return hits.length === 2 ? hits : null;
}

// How much a face is stretched: its share of the UV map's area over its share of the mesh's area.
// 1 means even; far from 1 means stretched or squashed.
export function stretch(m, uvs) {
  const area3 = m.faces.map((f) => {
    let a = [0, 0, 0];
    for (let i = 1; i < f.length - 1; i += 1) a = a.map((x, k) => x + cross3(sub3(m.verts[f[i]], m.verts[f[0]]), sub3(m.verts[f[i + 1]], m.verts[f[0]]))[k]);
    return Math.hypot(...a) / 2;
  });
  const area2 = uvs.map((uv) => {
    let a = 0;
    for (let i = 0; i < uv.length; i += 1) {
      const p = uv[i];
      const q = uv[(i + 1) % uv.length];
      a += p[0] * q[1] - q[0] * p[1];
    }
    return Math.abs(a) / 2;
  });
  const t3 = area3.reduce((s, x) => s + x, 0);
  const t2 = area2.reduce((s, x) => s + x, 0) || 1;
  return area3.map((a, i) => (area2[i] / t2) / (a / t3 || 1));
}

// Draws the mesh with the test grid. cells: grid cells across the image. select: faces picked out.
// stretchView: colour each face blue (even) to red (stretched), as the UV Stretch overlay does.
// flat: a class to fill every face with and no grid, as an object with no UV map looks.
export function drawTextured(kit, m, v, uvs, { cells = 8, select = [], width = 1.6, stretchView = false, flat = null, light = [-0.4, -0.6, 0.7] } = {}) {
  const lightDir = (() => { const l = Math.hypot(...light); return light.map((x) => x / l); })();
  const selected = new Set(select);
  const ratio = stretchView ? stretch(m, uvs) : null;
  const facing = (face) => dot3(normal(m, face), v.eye ? sub3(v.eye, centroid(m, face)) : v.toward) > 1e-6;
  const order = m.faces.map((f, i) => ({ f, i, d: Math.max(...f.map((j) => v.depth(m.verts[j]))) * 0.25 + f.reduce((s, j) => s + v.depth(m.verts[j]), 0) / f.length }))
    .filter(({ f }) => facing(f))
    .sort((a, b) => a.d - b.d);
  const out = [];
  for (const { f, i } of order) {
    const pts = f.map((j) => v.project(m.verts[j]));
    out.push(`<path d="${d2(pts)}" class="${flat || 'd-face-1'}" stroke-width="0"/>`);
    if (flat) {
      // No UV map: every face reads the same spot of the image, so the object is one flat colour.
      out.push(kit.polyline([...pts, pts[0]], { cls: 'd-ink', width }));
      continue;
    }
    const lit = dot3(normal(m, f), lightDir);
    const shade = lit > 0.45 ? 0 : lit > -0.1 ? 0.3 : 0.55;
    if (shade) out.push(`<path d="${d2(pts)}" class="d-face-3" stroke-width="0" opacity="${shade}" style="mix-blend-mode:multiply"/>`);
    if (ratio) {
      const off = Math.min(1, Math.abs(Math.log(Math.max(ratio[i], 1e-3))) / Math.log(3));
      out.push(`<path d="${d2(pts)}" class="d-gizmo-z" stroke-width="0" opacity="${(0.55 * (1 - off)).toFixed(2)}"/>`);
      out.push(`<path d="${d2(pts)}" class="d-gizmo-x" stroke-width="0" opacity="${(0.65 * off).toFixed(2)}"/>`);
    }
    // The grid: lines of equal u and of equal v, cut to each triangle of the face.
    const uv = uvs[i];
    for (let t = 1; t < f.length - 1; t += 1) {
      const tri = [0, t, t + 1];
      const tuv = tri.map((k) => uv[k]);
      const tpts = tri.map((k) => pts[k]);
      for (let c = 1; c < cells; c += 1) {
        for (const axis of [0, 1]) {
          const seg = isoSegment(tuv, tpts, axis, c / cells);
          if (seg) out.push(kit.line(seg[0][0], seg[0][1], seg[1][0], seg[1][1], { cls: 'd-ink', width: 0.8 }));
        }
      }
    }
    if (selected.has(i)) out.push(`<path d="${d2(pts)}" class="d-mark-fill" stroke-width="0" opacity="0.3"/>`);
    out.push(kit.polyline([...pts, pts[0]], { cls: selected.has(i) ? 'd-mark' : 'd-ink', width: selected.has(i) ? width * 1.4 : width }));
  }
  return out;
}

// The UV Editor's square from (x, y), `size` wide, with a faint grid and U and V marked.
export function uvSquare(kit, x, y, size, { cells = 8, labels = true } = {}) {
  const out = [`<rect x="${x}" y="${y}" width="${size}" height="${size}" class="d-paper" stroke-width="1.2"/>`];
  for (let c = 1; c < cells; c += 1) {
    const t = (c / cells) * size;
    out.push(kit.line(x + t, y, x + t, y + size, { cls: 'd-guide', width: 0.6 }), kit.line(x, y + t, x + size, y + t, { cls: 'd-guide', width: 0.6 }));
  }
  out.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" class="d-ink" fill="none" stroke-width="1.2"/>`);
  if (labels) {
    out.push(kit.text(x - 6, y + size + 4, '0', { size: 11, anchor: 'end' }), kit.text(x + size, y + size + 15, '1', { size: 11, anchor: 'middle' }), kit.text(x - 6, y + 8, '1', { size: 11, anchor: 'end' }));
    out.push(kit.text(x + size / 2, y + size + 16, 'U', { size: 12, anchor: 'middle' }), kit.text(x - 14, y + size / 2 + 4, 'V', { size: 12, anchor: 'middle' }));
  }
  return out;
}

// A point in UV space as a point in the square (v runs upwards).
export const toSquare = (x, y, size) => ([u, v]) => [x + u * size, y + (1 - v) * size];

// The faces of a UV map laid flat on the square. select: faces picked out; fill: a class per face.
export function drawUVs(kit, uvs, x, y, size, { select = [], fill, width = 1.2, only } = {}) {
  const at = toSquare(x, y, size);
  const selected = new Set(select);
  const out = [];
  uvs.forEach((uv, i) => {
    if (only && !only.includes(i)) return;
    const pts = uv.map(at);
    const cls = selected.has(i) ? 'd-face-sel' : fill ? fill(i) : 'd-face-2';
    out.push(`<path d="${d2(pts)}" class="${cls}" stroke-width="0" opacity="${selected.has(i) ? 1 : 0.85}"/>`);
  });
  uvs.forEach((uv, i) => {
    if (only && !only.includes(i)) return;
    const pts = uv.map(at);
    out.push(kit.polyline([...pts, pts[0]], { cls: selected.has(i) ? 'd-mark' : 'd-ink', width: selected.has(i) ? width * 1.6 : width }));
  });
  return out;
}

// UVs for a box from the mesh kit, laid out as a cross: each face is projected on its own plane and
// placed in a cell of `layout`, which maps a face direction ('+x', '-y', ...) to [u0, v0, w, h].
export function boxUVs(m, layout) {
  const lo = [0, 1, 2].map((k) => Math.min(...m.verts.map((p) => p[k])));
  const hi = [0, 1, 2].map((k) => Math.max(...m.verts.map((p) => p[k])));
  const norm = (p, k) => (p[k] - lo[k]) / (hi[k] - lo[k] || 1);
  return m.faces.map((f) => {
    const n = normal(m, f);
    const k = n.map(Math.abs).indexOf(Math.max(...n.map(Math.abs)));
    const dir = `${n[k] > 0 ? '+' : '-'}${'xyz'[k]}`;
    const [u0, v0, w, h] = layout[dir];
    // The two axes across the face, chosen so the face is not mirrored when seen from outside.
    const axes = { '+x': [[1, 1], [2, 1]], '-x': [[1, -1], [2, 1]], '+y': [[0, -1], [2, 1]], '-y': [[0, 1], [2, 1]], '+z': [[0, 1], [1, 1]], '-z': [[0, 1], [1, -1]] }[dir];
    return f.map((i) => {
      const p = m.verts[i];
      const s = axes[0][1] > 0 ? norm(p, axes[0][0]) : 1 - norm(p, axes[0][0]);
      const t = axes[1][1] > 0 ? norm(p, axes[1][0]) : 1 - norm(p, axes[1][0]);
      return [u0 + s * w, v0 + t * h];
    });
  });
}

// A cross layout: the four sides in a row, and the top and bottom above and below the front.
export const CROSS = {
  '-x': [0, 0.375, 0.25, 0.25], '-y': [0.25, 0.375, 0.25, 0.25], '+x': [0.5, 0.375, 0.25, 0.25],
  '+y': [0.75, 0.375, 0.25, 0.25], '+z': [0.25, 0.625, 0.25, 0.25], '-z': [0.25, 0.125, 0.25, 0.25],
};
