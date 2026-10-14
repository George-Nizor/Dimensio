// The models this lesson builds with insets, made with the same insets and extrusions the
// exercise describes. Not a diagram itself.
import { cube, box, facesWhere, extrude } from '../../../diagrams/mesh.mjs';
import { insetEven } from './helpers.mjs';

// The default cube with all six faces inset 0.2 m as individual faces, each middle pushed in 0.1 m.
export function panelledBox() {
  let m = cube();
  const all = m.faces.map((_, i) => i);
  for (const f of all) m = insetEven(m, f, 0.2).mesh;
  for (const f of all) m = extrude(m, [f], -0.1).mesh;
  return { mesh: m, middles: all };
}

// A wall 3 by 0.2 by 2.5 m: its front inset 0.6 m and pulled out 5 cm, inset 0.1 m again, and
// the middle pushed back 15 cm.
export function windowWall() {
  let m = box({ size: [3, 0.2, 2.5], center: [0, 0, 1.25] });
  const [front] = facesWhere(m, (c, n) => n[1] < -0.9);
  m = insetEven(m, front, 0.6).mesh;
  m = extrude(m, [front], 0.05).mesh;
  m = insetEven(m, front, 0.1).mesh;
  m = extrude(m, [front], -0.15).mesh;
  return { mesh: m, middle: front };
}
