// Line Art worked out from real geometry, for this lesson's diagrams. Not a diagram itself. A
// contour edge is one between a face turned towards the camera and one turned away (or an open
// border); a crease edge is one whose two faces meet at an angle smaller than the threshold, in
// degrees, measured between the faces as Blender's Crease Threshold is (180 is flat).
import { edges, normal, drawMesh } from '../../../diagrams/mesh.mjs';

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export function lineArtEdges(m, v, { threshold = 140 } = {}) {
  const out = [];
  for (const e of edges(m)) {
    const faces = e.faces.map((f) => m.faces[f]);
    const facing = faces.map((f) => dot(normal(m, f), v.toward) > 1e-6);
    if (faces.length < 2) { if (facing[0]) out.push(e); continue; }
    if (facing[0] !== facing[1]) { out.push(e); continue; }
    if (!facing[0]) continue;
    const between = 180 - (Math.acos(Math.max(-1, Math.min(1, dot(normal(m, faces[0]), normal(m, faces[1]))))) * 180) / Math.PI;
    if (between < threshold) out.push(e);
  }
  return out;
}

// The model shaded with faint edges, as the render shows it, with its Line Art lines over it.
export function drawLineArt(kit, m, v, { threshold = 140, width = 2.6, lines = true } = {}) {
  const out = [drawMesh(kit, m, v, { width: 0.6, cls: 'd-guide' })];
  if (lines) {
    for (const e of lineArtEdges(m, v, { threshold })) {
      const a = v.project(m.verts[e.a]);
      const b = v.project(m.verts[e.b]);
      out.push(kit.line(a[0], a[1], b[0], b[1], { cls: 'd-ink', width }));
    }
  }
  return out;
}
