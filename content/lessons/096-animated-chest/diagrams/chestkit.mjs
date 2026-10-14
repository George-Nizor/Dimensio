// The chest for this lesson's diagrams. Not a diagram itself. A body 1 x 0.6 x 0.5 m standing on
// the floor and a lid 1 x 0.6 x 0.2 m on top, with a band across the front of each. The lid turns
// about X on its hinge, the back top edge of the body (Y 0.3, Z 0.5), as a lid with its origin on
// the hinge does. Rotating the lid to a negative angle lifts its front.
import { box, join, translate, rotate } from '../../../diagrams/mesh.mjs';

export const HINGE = [0, 0.3, 0.5];

export function body() {
  return join(box({ size: [1, 0.6, 0.5], center: [0, 0, 0.25] }), box({ size: [0.12, 0.62, 0.52], center: [0, 0, 0.25] }));
}

// The lid, built around the hinge and turned `angle` degrees about X there. `pivot` moves the
// point it turns about, for the picture of a lid whose origin sits in its middle.
export function lid(angle = 0, pivot = HINGE) {
  let m = join(box({ size: [1, 0.6, 0.2], center: [0, 0, 0.6] }), box({ size: [0.12, 0.62, 0.22], center: [0, 0, 0.6] }));
  m = translate(m, pivot.map((c) => -c));
  m = rotate(m, 'x', angle);
  return translate(m, pivot);
}

// A rounded frame with a label under it.
export function frame(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// A dashed arc in the side view (looking from +X, so Y runs left to right reversed) around the
// hinge, from angle a to b in degrees, at radius r metres, with an arrowhead.
export function hingeArc(kit, v, a, b, r = 0.62) {
  const pts = [];
  for (let i = 0; i <= 20; i += 1) {
    const t = ((a + ((b - a) * i) / 20) * Math.PI) / 180;
    // The lid's front edge starts at -Y from the hinge and turns about X.
    const y = -r * Math.cos(t);
    const z = -r * Math.sin(t);
    pts.push(v.project([0.6, HINGE[1] + y, HINGE[2] + 0.1 + z]));
  }
  const [x2, y2] = pts[pts.length - 1];
  const [x1, y1] = pts[pts.length - 2];
  return [kit.polyline(pts, { cls: 'd-guide', width: 1.2, dash: '4 4' }), kit.arrowhead(x2, y2, Math.atan2(y2 - y1, x2 - x1), { cls: 'd-mark', size: 7 })];
}
