// The finished pair: a faceted low-poly rock and a tree with a six-sided trunk and lumpy leaves, each
// within its triangle budget.
import { view, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { rock, trunk, leaves } from './shapes.mjs';

export default (kit) => {
  const v = view({ at: [250, 196], scale: 118, elevation: 18, target: [0, 0, 0] });
  const under = (x) => v.project([x, 0, 0])[0];
  return kit.svg({ width: 500, height: 250 },
    drawMesh(kit, translate(rock(), [-1.1, 0, 0]), v, { width: 1.3 }),
    drawMesh(kit, translate(trunk(), [0.6, 0, 0]), v, { width: 1.3 }),
    drawMesh(kit, translate(leaves(), [0.6, 0, 0]), v, { width: 1.3 }),
    kit.text(under(-1.1), 240, 'rock: under 300 triangles', { anchor: 'middle', size: 12 }),
    kit.text(under(0.6) + 10, 240, 'tree: under 400 triangles', { anchor: 'middle', size: 12 }),
  );
};
