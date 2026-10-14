// The Pipe with one horizontal edge loop selected all the way round, after Alt+click on one of its
// edges.
import { view, drawMesh, cursor } from '../../../diagrams/mesh.mjs';
import { pipe, loopAt } from './shapes.mjs';

export default (kit) => {
  const t = pipe();
  const v = view({ at: [170, 140], scale: 82, target: [0, 0, 1] });
  const [x, y] = v.project([0.5 * Math.cos(-0.55), 0.5 * Math.sin(-0.55), 1]);
  return kit.svg({ width: 400, height: 280 },
    drawMesh(kit, t, v, { width: 1.3, select: { edges: loopAt(t, 3) } }),
    cursor(kit, x, y),
    kit.text(300, 150, 'Alt + click an edge', { anchor: 'middle', size: 12 }),
  );
};
