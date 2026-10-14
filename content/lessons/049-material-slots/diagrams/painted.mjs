// Drawing a mesh whose faces wear different materials. Not a diagram itself. drawMesh in the mesh
// kit fills faces in grey by how they face the light; this fills each face with its own class
// (a material's colour) and darkens faces that turn from the light with a multiplied grey, which
// darkens in both themes. Selected faces keep their colour under an orange tint and outline, as in
// Edit Mode. Faces are sorted back to front as drawMesh sorts them.
//
//   drawPainted(kit, mesh, view, (faceIndex) => 'd-gizmo-x', { select: [faces], width })
import { normal, centroid } from '../../../diagrams/mesh.mjs';

const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const l = Math.hypot(...a) || 1; return a.map((x) => x / l); };

export function drawPainted(kit, m, v, classOf, { select = [], width = 1.6, light = [-0.4, -0.6, 0.7] } = {}) {
  const lightDir = unit(light);
  const selected = new Set(select);
  const facing = (face) => dot3(normal(m, face), v.eye ? v.eye.map((e, i) => e - centroid(m, face)[i]) : v.toward) > 1e-6;
  const order = m.faces.map((f, i) => ({ f, i, d: Math.max(...f.map((j) => v.depth(m.verts[j]))) * 0.25 + f.reduce((s, j) => s + v.depth(m.verts[j]), 0) / f.length }))
    .filter(({ f }) => facing(f))
    .sort((a, b) => a.d - b.d);
  const out = [];
  for (const { f, i } of order) {
    const pts = f.map((j) => v.project(m.verts[j]));
    const d = `M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z`;
    out.push(`<path d="${d}" class="${classOf(i)}" stroke-width="0"/>`);
    const lit = dot3(normal(m, f), lightDir);
    const shade = lit > 0.45 ? 0 : lit > -0.1 ? 0.35 : 0.65;
    if (shade) out.push(`<path d="${d}" class="d-face-3" stroke-width="0" opacity="${shade}" style="mix-blend-mode:multiply"/>`);
    // A selected face keeps its material and gets Blender's orange tint and outline.
    if (selected.has(i)) out.push(`<path d="${d}" class="d-mark-fill" stroke-width="0" opacity="0.35"/>`);
    out.push(kit.polyline([...pts, pts[0]], { cls: selected.has(i) ? 'd-mark' : 'd-ink', width: selected.has(i) ? width * 1.3 : width }));
  }
  return out;
}
