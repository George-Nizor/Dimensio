// Left, a strip of quads: the selected edge loop runs right across it. Right, the same strip with
// its middle squares split into triangles: the loop stops where it meets them, at a vertex with
// more than four edges.
import { views, plane, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from './paint.mjs';

function strip(split) {
  const m = plane({ size: [5, 2], segments: [5, 2] });
  if (!split) return m;
  const faces = [];
  m.faces.forEach((f) => {
    const cx = f.reduce((s, i) => s + m.verts[i][0], 0) / 4;
    if (Math.abs(cx) < 1) faces.push([f[0], f[1], f[2]], [f[0], f[2], f[3]]);
    else faces.push(f);
  });
  return { verts: m.verts, faces };
}

export default (kit) => {
  const left = views.top({ at: [124, 96], scale: 36, target: [0, 0, 0] });
  const right = views.top({ at: [376, 96], scale: 36, target: [0, 0, 0] });
  const row = (m, xmax) => {
    const pts = m.verts.map((p, i) => [p, i]).filter(([p]) => Math.abs(p[1]) < 1e-6 && p[0] <= xmax + 1e-6).sort((a, b) => a[0][0] - b[0][0]).map(([, i]) => i);
    return pts.slice(1).map((b, k) => [pts[k], b]);
  };
  const a = strip(false);
  const b = strip(true);
  return kit.svg({ width: 500, height: 190 },
    panel(kit, 14, 14, 220, 150, 'quads: the loop goes through'),
    drawMesh(kit, a, left, { mode: 'wire', width: 1.4, select: { edges: row(a, 2.5) } }),
    panel(kit, 266, 14, 220, 150, 'triangles: the loop stops'),
    drawMesh(kit, b, right, { mode: 'wire', width: 1.4, select: { edges: row(b, -0.5) } }),
  );
};
