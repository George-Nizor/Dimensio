// Bisect. Left, a UV sphere seen from the front with a level line dragged across its middle.
// Right, after Clear Outer and Fill: the lower half, closed by one flat face.
import { view, views, uvSphere, drawMesh, mouse } from '../../../diagrams/mesh.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const sphere = uvSphere({ segments: 16, rings: 8, radius: 1 });
  // The lower half: faces below the equator, closed with the equator ring as one face.
  const lower = { verts: sphere.verts, faces: sphere.faces.filter((f) => f.every((i) => sphere.verts[i][2] <= 1e-6)) };
  const equator = sphere.verts.map((p, i) => [p, i]).filter(([p]) => Math.abs(p[2]) < 1e-6).map(([, i]) => i)
    .sort((a, b) => Math.atan2(sphere.verts[a][1], sphere.verts[a][0]) - Math.atan2(sphere.verts[b][1], sphere.verts[b][0]));
  lower.faces.push(equator);
  const cap = lower.faces.length - 1;
  const left = views.front({ at: [124, 104], scale: 62, target: [0, 0, 0] });
  const right = view({ azimuth: 30, elevation: 32, at: [376, 96], scale: 62, target: [0, 0, -0.2] });
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 180, 'drag a line'),
    drawMesh(kit, sphere, left, { width: 1.3 }),
    kit.line(34, 104, 214, 104, { cls: 'd-mark', width: 2.2 }),
    kit.arrowhead(214, 104, 0, { size: 8 }),
    step(kit, 244, 104, 286),
    panel(kit, 266 + 30, 14, 190, 180, 'Clear Outer, Fill'),
    paint(kit, lower, right, { width: 1.3, fill: (i) => (i === cap ? 'd-face-sel' : null) }),
  );
};
