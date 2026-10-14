// Edge > Mark Sharp, or Set Sharpness by Angle at 40 degrees: the edges where the bands, rims and
// lid meet the sides are marked sharp (picked out). The edges between the 12 sides are not.
import { view } from '../../../diagrams/mesh.mjs';
import { barrel } from './barrel.mjs';
const SIDE = [-0.9, -0.3, 0.3];
import { paint, edgeMap } from './paint.mjs';
import { normal } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const m = barrel();
  const v = view({ azimuth: 20, elevation: 22, at: [250, 118], scale: 133, target: [0, 0, 0.6] });
  const cos40 = Math.cos((40 * Math.PI) / 180);
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const seen = (f) => dot(normal(m, m.faces[f]), v.toward) > 1e-6;
  const sharp = [...edgeMap(m).values()].filter((e) => e.faces.length === 2 && e.faces.some(seen) && dot(normal(m, m.faces[e.faces[0]]), normal(m, m.faces[e.faces[1]])) < cos40).map((e) => [e.a, e.b]);
  return kit.svg({ width: 500, height: 240 }, paint(kit, m, v, { light: SIDE, outward: false, width: 1.1, select: { edges: sharp } }));
};
