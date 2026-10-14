// The tank's 12-sided hole filled three ways: F makes one n-gon, Alt+F a set of triangles, and
// Face > Grid Fill a grid of nine quads. The caps are the faces Blender 5.2.2 makes.
import { view } from '../../../diagrams/mesh.mjs';
import { tank } from './shapes.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const cells = [['F: one n-gon', 'ngon'], ['Alt+F: triangles', 'fill'], ['Grid Fill: quads', 'grid']];
  return kit.svg({ width: 540, height: 230 }, cells.map(([label, top], i) => {
    const x = 14 + i * 176;
    const v = view({ azimuth: 20, elevation: 50, at: [x + 82, 82], scale: 104, target: [0, 0, 0.75] });
    const m = tank(top);
    const cap = m.faces.map((f, j) => [f, j]).filter(([f]) => f.every((k) => m.verts[k][2] > 0.999)).map(([, j]) => j);
    return [panel(kit, x, 14, 164, 178, label), paint(kit, m, v, { width: 1.4, fill: (j) => (cap.includes(j) ? 'd-face-sel' : null) })];
  }));
};
