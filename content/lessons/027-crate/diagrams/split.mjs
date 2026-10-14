// Left, Ctrl+I after the bevel: the six big faces selected. Right, Ctrl+T: each big face split into
// two triangles along a diagonal.
import { view, keycap } from '../../../diagrams/mesh.mjs';
import { crate } from './crate.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 34, elevation: 26, at: [118, 106], scale: 224, target: [0, 0, 0.25] });
  const right = view({ azimuth: 34, elevation: 26, at: [400, 106], scale: 224, target: [0, 0, 0.25] });
  const a = crate('faces');
  const b = crate('split');
  const pick = (p) => (i) => (p.includes(i) ? 'd-face-sel' : null);
  return kit.svg({ width: 520, height: 230 },
    panel(kit, 14, 14, 210, 184, 'six big faces'),
    paint(kit, a.mesh, left, { outward: false, width: 1.3, fill: pick(a.picked) }),
    step(kit, 236, 112, 284), keycap(kit, 260, 88, 'Ctrl+T', { size: 11 }),
    panel(kit, 296, 14, 210, 184, 'two triangles each'),
    paint(kit, b.mesh, right, { outward: false, width: 1.3, fill: pick(b.picked) }),
  );
};
