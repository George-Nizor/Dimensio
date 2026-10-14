// Y on a box's top face: the face is cut free along its border and lifted 0.3 m. It is still part
// of the same object, and the box below is left open.
import { view, cube, translate, keycap } from '../../../diagrams/mesh.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const m = translate(cube(1), [0, 0, 0.5]);
  const top = m.faces.findIndex((f) => f.every((i) => m.verts[i][2] > 0.99));
  const lid = { verts: [...m.verts], faces: [] };
  const corners = m.faces[top].map((i) => lid.verts.push([m.verts[i][0], m.verts[i][1], 1.3]) - 1);
  lid.faces.push(corners);
  const box = { verts: m.verts, faces: m.faces.filter((_, i) => i !== top) };
  const v = view({ azimuth: 30, elevation: 30, at: [200, 120], scale: 110, target: [0, 0, 0.65] });
  return kit.svg({ width: 460, height: 240 },
    paint(kit, box, v, { width: 1.6, inside: true }),
    paint(kit, lid, v, { width: 1.6, inside: true, fill: () => 'd-face-sel' }),
    keycap(kit, 380, 110, 'Y'),
    kit.text(380, 144, 'split the face', { anchor: 'middle', size: 12 }),
  );
};
