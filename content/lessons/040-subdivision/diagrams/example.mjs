// The exercise: a cushion, a flattened cube with Subdivision Surface at level 2, and a box whose
// edges stay tight under the same modifier because of loops close to each edge.
import { box, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { subdivide } from '../../037-modifiers/diagrams/modkit.mjs';
import { loopBox } from './shapes.mjs';

export default (kit) => {
  const cushion = subdivide(box({ size: [2, 2, 0.6] }), 2);
  const c = [-0.7, -0.6, 0.6, 0.7];
  const sharp = subdivide(loopBox([c, c, c]), 2);
  return kit.svg({ width: 500, height: 220 },
    drawMesh(kit, cushion, view({ at: [140, 116], scale: 62 }), { width: 0.5 }),
    drawMesh(kit, sharp, view({ at: [380, 108], scale: 62 }), { width: 0.35 }),
    kit.text(140, 204, 'cushion', { anchor: 'middle', size: 12 }),
    kit.text(380, 204, 'box with tight edges', { anchor: 'middle', size: 12 }),
  );
};
