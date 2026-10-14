// The 1 m crate with every edge bevelled 2 cm with one segment, and one corner close up: a flat
// strip along each edge and a small triangle where three strips meet.
import { bevelledBox, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, closeUp } from './helpers.mjs';

export default (kit) => {
  const crate = bevelledBox({ size: [1, 1, 1], width: 0.02 });
  const whole = view({ at: [126, 112], scale: 96 });
  const near = view({ at: [384, 108], scale: 1300, target: [0.5, -0.5, 0.5] });
  const corner = whole.project([0.5, -0.5, 0.5]);
  return kit.svg({ width: 510, height: 230 },
    panel(kit, 14, 14, 224, 180, 'the crate'),
    drawMesh(kit, crate, whole, { width: 1.2 }),
    kit.circle(corner[0], corner[1], 12, { cls: 'd-mark', width: 1.6 }),
    closeUp(kit, 'd024-example-a', 272, 14, 224, 180, 'one corner, close up', drawMesh(kit, crate, near, { width: 1.6 })),
  );
};
