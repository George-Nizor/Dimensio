// The front view over the front picture: the blade's right half as one face, from the middle line
// to the edge, its top outer corner pulled down to the shoulder so the inner corner is the tip.
import { views, drawMesh, mirror } from '../../../diagrams/mesh.mjs';
import { slab } from '../../037-modifiers/diagrams/modkit.mjs';
import { picture } from '../../046-reference-images/diagrams/shapes.mjs';
import { halfBlade } from './shapes.mjs';

export default (kit) => {
  const v = views.front({ at: [210, 236], scale: 216, target: [0, 0, 0] });
  const face = slab(halfBlade, [[0, 1, 2, 3]], 0.0001, { y: -0.2 });
  const [tx, ty] = v.project([0.155, 0, 1]);
  const [sx, sy] = v.project([0.155, 0, 0.864]);
  return kit.svg({ width: 420, height: 250 },
    picture(kit, v),
    drawMesh(kit, mirror(face, 'x'), v, { mode: 'wire', width: 1.2, cls: 'd-guide' }),
    drawMesh(kit, face, v, { width: 1.8, select: { faces: [0] } }),
    kit.line(210, 10, 210, 240, { cls: 'd-mark', width: 1.2, dash: '6 5' }),
    kit.line(tx, ty, sx, sy - 6, { cls: 'd-mark', width: 1.8 }), kit.arrowhead(sx, sy - 6, Math.PI / 2, { size: 7 }),
    kit.dot(tx, ty, { r: 3, cls: 'd-guide' }),
    kit.text(300, 60, 'corner pulled down', { size: 12 }),
  );
};
