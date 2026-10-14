// Non Manifold, then F, shown on a 1 m box. Left, the box with its front face missing and the four
// edges round the hole selected: each has only one face. Right, the hole filled with F.
import { view, cube, translate } from '../../../diagrams/mesh.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 22, at: [118, 104], scale: 104, target: [0, 0, 0.5] });
  const right = view({ azimuth: 30, elevation: 22, at: [392, 104], scale: 104, target: [0, 0, 0.5] });
  const box = translate(cube(1), [0, 0, 0.5]);
  const frontIndex = box.faces.findIndex((f) => f.every((i) => box.verts[i][1] < -0.49));
  const front = box.faces[frontIndex];
  const rim = front.map((a, k) => [a, front[(k + 1) % 4]]);
  const open = { verts: box.verts, faces: box.faces.filter((_, i) => i !== frontIndex) };
  return kit.svg({ width: 510, height: 230 },
    panel(kit, 14, 14, 208, 184, 'the rim of the hole'),
    paint(kit, open, left, { width: 1.5, inside: true, select: { edges: rim } }),
    step(kit, 232, 104, 278), kit.text(255, 92, 'F', { anchor: 'middle', size: 12 }),
    panel(kit, 288, 14, 208, 184, 'filled'),
    paint(kit, box, right, { width: 1.5, fill: (i) => (i === frontIndex ? 'd-face-sel' : null) }),
  );
};
