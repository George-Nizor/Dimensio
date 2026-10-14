// Ctrl+L > Link Materials: two plain houses and the painted one selected last, so it is active.
// After linking, all three wear its materials.
import { view, translate, keycap } from '../../../diagrams/mesh.mjs';
import { house, COLOURS, partOf } from './house.mjs';
import { drawPainted } from './painted.mjs';

export default (kit) => {
  const { mesh, parts } = house();
  const part = partOf(parts);
  const row = (x, painted) => [-3.1, 0, 3.1].map((dx, i) => {
    const v = view({ at: [x, 132], scale: 25, target: [-dx, 0, 1.3], azimuth: 25 });
    const on = painted || i === 2;
    return drawPainted(kit, mesh, v, (f) => (on ? COLOURS[part(f)] : 'd-face-2'));
  });
  return kit.svg({ width: 640, height: 220 },
    row(130, false),
    kit.text(195, 208, 'active, selected last', { anchor: 'middle', size: 12 }),
    keycap(kit, 320, 70, 'Ctrl+L', { size: 11 }),
    kit.text(320, 104, 'Link Materials', { anchor: 'middle', size: 12 }),
    kit.line(284, 124, 356, 124, { cls: 'd-mark', width: 2 }), kit.arrowhead(356, 124, 0, { size: 8 }),
    row(510, true),
  );
};
