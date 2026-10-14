// A single flat face with its back edge selected and extruded 1.5 m up with E: a second face rises
// from the first, like a wall from a floor. The new top edge stays selected.
import { plane, view, arrow } from '../../../diagrams/mesh.mjs';
import { extrudeEdge, drawOpen } from './helpers.mjs';

export default (kit) => {
  const floor = plane({ size: [2, 2] });
  const back = [2, 3];
  const { mesh, edge } = extrudeEdge(floor, back[0], back[1], [0, 0, 1.5]);
  const v = view({ at: [190, 150], scale: 58, target: [0, 0, 0.5] });
  return kit.svg({ width: 400, height: 260 },
    drawOpen(kit, mesh, v, { width: 1.6, select: { edges: [edge] } }),
    arrow(kit, v, [-1.15, 1, 0.1], [-1.15, 1, 1.4]),
  );
};
