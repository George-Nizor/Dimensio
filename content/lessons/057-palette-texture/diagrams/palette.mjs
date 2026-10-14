// The palette image and the barrel for this lesson's diagrams. Not a diagram itself.
// The palette is drawn as five rows of four swatches, dark to light: wood, metal grey, red, green
// and blue. Each swatch is a theme colour darkened by layers of multiplied grey, which darkens in
// both themes. The lesson's real palette (blender/starters/palette-barrel.py) has eight rows of
// eight; this is the same idea at a size a diagram can show.
import { mesh, orientOutward, normal } from '../../../diagrams/mesh.mjs';

export const ROWS = ['d-mark-fill', 'd-face-2', 'd-gizmo-x', 'd-gizmo-y', 'd-gizmo-z'];
export const COLS = 4;

// The swatch at row r, column c: its class and how many darkening layers it gets.
export const swatchStyle = (r, c) => ({ cls: ROWS[r], dark: COLS - 1 - c });

export function fill(x, y, w, h, { cls, dark }, extra = '') {
  const out = [`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" class="${cls}" stroke-width="0"${extra}/>`];
  for (let i = 0; i < dark; i += 1) out.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" class="d-face-3" stroke-width="0" opacity="0.55" style="mix-blend-mode:multiply"/>`);
  return out;
}

// The palette image as a square from (x, y), `size` wide; the swatches fill it in a grid.
export function palette(kit, x, y, size) {
  const out = [];
  const w = size / COLS;
  const h = size / ROWS.length;
  ROWS.forEach((_, r) => { for (let c = 0; c < COLS; c += 1) out.push(fill(x + c * w, y + r * h, w, h, swatchStyle(r, c))); });
  out.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" class="d-ink" fill="none" stroke-width="1.2"/>`);
  return out;
}

// The centre of swatch (r, c) in UV space, v running up.
export const swatchUV = (r, c) => [(c + 0.5) / COLS, 1 - (r + 0.5) / ROWS.length];

// A 12-sided barrel 1.2 m tall with two bands. parts: staves, bands, ends.
export function barrel() {
  const n = 12;
  const heights = [0, 0.22, 0.32, 0.88, 0.98, 1.2];
  const radii = [0.4, 0.44, 0.44, 0.44, 0.44, 0.4];
  const verts = [];
  heights.forEach((z, k) => { for (let i = 0; i < n; i += 1) verts.push([radii[k] * Math.cos((2 * Math.PI * i) / n), radii[k] * Math.sin((2 * Math.PI * i) / n), z]); });
  const bottom = verts.push([0, 0, 0]) - 1;
  const top = verts.push([0, 0, 1.2]) - 1;
  const faces = [];
  const parts = { staves: [], bands: [], ends: [] };
  for (let k = 0; k < 5; k += 1) {
    for (let i = 0; i < n; i += 1) {
      const j = (i + 1) % n;
      (k === 1 || k === 3 ? parts.bands : parts.staves).push(faces.length);
      faces.push([k * n + i, k * n + j, (k + 1) * n + j, (k + 1) * n + i]);
    }
  }
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    parts.ends.push(faces.length); faces.push([j, i, bottom]);
    parts.ends.push(faces.length); faces.push([5 * n + i, 5 * n + j, top]);
  }
  return { mesh: orientOutward(mesh(verts, faces)), parts };
}

// Draws a mesh with each face filled like a swatch (style(face) gives { cls, dark }), darker where
// it turns from the light. select: faces picked out in Edit Mode's orange.
export function drawFaces(kit, m, v, style, { select = [] } = {}) {
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const light = [-0.4, -0.6, 0.7].map((x) => x / Math.hypot(-0.4, -0.6, 0.7));
  const sel = new Set(select);
  const order = m.faces.map((f, i) => ({ f, i, d: f.reduce((s, j) => s + v.depth(m.verts[j]), 0) / f.length }))
    .filter(({ f }) => dot(normal(m, f), v.toward) > 1e-6)
    .sort((a, b) => a.d - b.d);
  const out = [];
  for (const { f, i } of order) {
    const pts = f.map((j) => v.project(m.verts[j]));
    const d = `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;
    const s = style(i);
    out.push(`<path d="${d}" class="${s.cls}" stroke-width="0"/>`);
    const lit = dot(normal(m, f), light);
    const dark = s.dark + (lit > 0.45 ? 0 : lit > -0.1 ? 1 : 2);
    for (let k = 0; k < dark; k += 1) out.push(`<path d="${d}" class="d-face-3" stroke-width="0" opacity="0.55" style="mix-blend-mode:multiply"/>`);
    if (sel.has(i)) out.push(`<path d="${d}" class="d-mark-fill" stroke-width="0" opacity="0.35"/>`);
    out.push(kit.polyline([...pts, pts[0]], { cls: sel.has(i) ? 'd-mark' : 'd-ink', width: sel.has(i) ? 2 : 1.2 }));
  }
  return out;
}
