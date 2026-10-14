// Wrong: I pressed once, so each side's two triangles inset as one square and sink together, with
// no brace. Right: I pressed twice, so each triangle insets on its own and the brace stands out.
import { view } from '../../../diagrams/mesh.mjs';
import { crate } from './crate.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 22, at: [124, 106], scale: 236, target: [0, 0, 0.25] });
  const right = view({ azimuth: 30, elevation: 22, at: [376, 106], scale: 236, target: [0, 0, 0.25] });
  const wrong = crate('done', { region: true });
  const right2 = crate('done');
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 184),
    paint(kit, wrong.mesh, left, { outward: false, width: 1.3, fillOpacity: 0.8, fill: (i) => (wrong.picked.includes(i) ? 'd-face-3' : null) }),
    kit.tag(124, 226, 'I once: no brace', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 184),
    paint(kit, right2.mesh, right, { outward: false, width: 1.3, fillOpacity: 0.8, fill: (i) => (right2.picked.includes(i) ? 'd-face-3' : null) }),
    kit.tag(376, 226, 'I twice: a brace'),
  );
};
