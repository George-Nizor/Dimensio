// Knife Project. Left, a circle 1 m above a plane, from the side and above. Right, the plane from
// the top after Mesh > Knife Project: a ring of new edges where the circle's outline falls.
import { view, views, plane, cylinder, drawMesh, arrow } from '../../../diagrams/mesh.mjs';
import { paint, panel, step } from './paint.mjs';

const circle = (z) => {
  const pts = [...Array(16).keys()].map((i) => [Math.cos((i * Math.PI) / 8) * 0.6, Math.sin((i * Math.PI) / 8) * 0.6, z]);
  return pts;
};

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 24, at: [124, 120], scale: 52, target: [0, 0, 0.5] });
  const right = views.top({ at: [380, 104], scale: 46, target: [0, 0, 0] });
  const ground = plane({ size: [3, 3] });
  const ring = (v, z) => { const p = circle(z).map((q) => v.project(q)); return kit.polyline([...p, p[0]], { cls: 'd-mark', width: 2 }); };
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 180, 'circle above the plane'),
    drawMesh(kit, ground, left, { width: 1.5 }),
    ring(left, 1),
    arrow(kit, left, [0, 0, 0.9], [0, 0, 0.12], { cls: 'd-guide', width: 1.4 }),
    step(kit, 244, 104, 286),
    panel(kit, 296, 14, 168, 180, 'cut into the plane'),
    drawMesh(kit, ground, right, { width: 1.5 }),
    (() => { const p = circle(0).map((q) => right.project(q)); return kit.polyline([...p, p[0]], { cls: 'd-ink', width: 1.6 }); })(),
  );
};
