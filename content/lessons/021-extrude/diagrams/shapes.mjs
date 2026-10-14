// The shapes this lesson builds by extruding, made with the same extrusions the steps describe.
// Not a diagram itself.
import { cube, box, facesWhere, extrude, translate } from '../../../diagrams/mesh.mjs';
import { scaleVerts, moveVerts } from './helpers.mjs';

// Three steps from one cube: a 2 by 0.5 by 0.3 m block, its back face extruded 0.5 m, the new top
// 0.3 m up, then the whole back 0.5 m and its top 0.3 m up again.
export function steps() {
  let m = box({ size: [2, 0.5, 0.3], center: [0, 0, 0.15] });
  const ex = (test, d) => { m = extrude(m, facesWhere(m, test), d).mesh; };
  ex((c, n) => n[1] > 0.9, 0.5);
  ex((c, n) => n[2] > 0.9 && c[1] > 0.25, 0.3);
  ex((c, n) => n[1] > 0.9, 0.5);
  ex((c, n) => n[2] > 0.9 && c[1] > 0.75, 0.3);
  return m;
}

// The L-shaped wall: a 0.2 by 0.2 by 2.5 m post with one side extruded 3 m and its back 2 m.
export function lWall() {
  let m = box({ size: [0.2, 0.2, 2.5], center: [0, 0, 1.25] });
  m = extrude(m, facesWhere(m, (c, n) => n[0] > 0.9), 3).mesh;
  m = extrude(m, facesWhere(m, (c, n) => n[1] > 0.9 && c[0] < 0.11), 2).mesh;
  return m;
}

// A ramp: the default cube with its top front edge moved down 1.5 m.
export function ramp() {
  const m = cube();
  return moveVerts(m, m.verts.map((p, i) => [p, i]).filter(([p]) => p[1] < -0.9 && p[2] > 0.9).map(([, i]) => i), [0, 0, -1.5]);
}

export { scaleVerts, translate };
