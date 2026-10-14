// The cube with this lesson's material on it: colour A on its left (-X) fading to colour B on its
// right (+X), as a Linear Gradient Texture driving a Mix node does. Not a diagram itself. Each
// visible face is filled with A, then thin strips of B laid over it with more opacity the further
// along X they are. `ramp` [start, end] is where a Color Ramp's two stops sit (0 to 1), so a
// shorter fade can be drawn. `flat` leaves out the shading, for an unlit preview.
import { cube, view, normal, centroid } from '../../../diagrams/mesh.mjs';

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const d = (pts) => `M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z`;

export function fadeCube(kit, { at = [100, 100], scale = 34, from = 'd-gizmo-z', to = 'd-gizmo-x', ramp = [0, 1], flat = false } = {}) {
  const m = cube();
  const v = view({ at, scale });
  const out = [];
  const facing = m.faces.filter((f) => normal(m, f).reduce((s, n, i) => s + n * v.toward[i], 0) > 1e-6);
  facing.sort((a, b) => v.depth(centroid(m, a)) - v.depth(centroid(m, b)));
  // How much of B shows at a point on X (-1 to 1), through the Color Ramp's stops.
  const factor = (x) => {
    const t = (x + 1) / 2;
    return Math.min(1, Math.max(0, (t - ramp[0]) / Math.max(ramp[1] - ramp[0], 1e-6)));
  };
  for (const face of facing) {
    const pts = face.map((i) => v.project(m.verts[i]));
    const xs = face.map((i) => m.verts[i][0]);
    out.push(`<path d="${d(pts)}" class="${from}" stroke-width="0"/>`);
    if (Math.max(...xs) - Math.min(...xs) < 1e-6) {
      // A face that does not span X (the right side) takes one colour.
      out.push(`<path d="${d(pts)}" class="${to}" stroke-width="0" opacity="${factor(xs[0]).toFixed(2)}"/>`);
    } else {
      // Each corner on the low-X edge paired with the corner straight across from it on the
      // high-X edge, so strips can be cut between the two edges.
      const lows = face.filter((i) => m.verts[i][0] < 0);
      const partner = (i) => face.find((j) => m.verts[j][0] > 0 && m.verts[j][1] === m.verts[i][1] && m.verts[j][2] === m.verts[i][2]);
      const [p, q] = lows.map((i) => [v.project(m.verts[i]), v.project(m.verts[partner(i)])]);
      const strips = 30;
      for (let s = 0; s < strips; s += 1) {
        const t0 = s / strips;
        const t1 = (s + 1) / strips;
        const opacity = factor(-1 + 2 * ((t0 + t1) / 2));
        if (opacity <= 0.01) continue;
        // Strips overlap by a hair so no seams show between them.
        const quad = [lerp(p[0], p[1], t0), lerp(p[0], p[1], Math.min(1, t1 + 0.004)), lerp(q[0], q[1], Math.min(1, t1 + 0.004)), lerp(q[0], q[1], t0)];
        out.push(`<path d="${d(quad)}" class="${to}" stroke-width="0" opacity="${opacity.toFixed(2)}"/>`);
      }
    }
    // Shading on the right side, so the cube reads as solid.
    if (!flat && normal(m, face)[0] > 0.5) out.push(`<path d="${d(pts)}" class="d-dot" stroke-width="0" opacity="0.25"/>`);
    out.push(kit.polyline([...pts, pts[0]], { cls: 'd-ink', width: 1.6 }));
  }
  return out;
}
