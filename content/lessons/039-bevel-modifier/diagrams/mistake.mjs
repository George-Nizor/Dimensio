// Wrong: the shelf from the unapplied-scale exercise, scaled in Object Mode, with a 0.2 m bevel
// stretched by the scale: wide at the ends, thin along the long edges. Right: scale applied first,
// and the bevel is the same width on every edge.
import { bevelledBox, scale, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const wrong = scale(bevelledBox({ size: [2, 2, 2], width: 0.2 }), [1, 0.3, 0.12]);
  const right = bevelledBox({ size: [2, 0.6, 0.24], width: 0.05 });
  const v1 = view({ at: [130, 110], scale: 92, elevation: 32 });
  const v2 = view({ at: [380, 110], scale: 92, elevation: 32 });
  return kit.svg({ width: 510, height: 230 },
    panel(kit, 14, 14, 232, 180),
    drawMesh(kit, wrong, v1, { width: 1.2 }),
    kit.tag(130, 218, 'scale not applied', { tone: 'bad' }),
    panel(kit, 264, 14, 232, 180),
    drawMesh(kit, right, v2, { width: 1.2 }),
    kit.tag(380, 218, 'scale applied first'),
  );
};
