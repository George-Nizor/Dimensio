// Non Manifold on the broken crate, seen from the front and a little above. Wrong: before merging,
// the four edges round the split-off top are selected as well as the four round the hole. Right:
// after Merge by Distance, only the hole's four edges.
import { view } from '../../../diagrams/mesh.mjs';
import { broken, topSeam } from './faults.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 26, elevation: 12, at: [124, 104], scale: 232, target: [0, 0, 0.25] });
  const right = view({ azimuth: 26, elevation: 12, at: [376, 104], scale: 232, target: [0, 0, 0.25] });
  const { mesh, holeEdges } = broken({ flipped: false });
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 184),
    paint(kit, mesh, left, { width: 1.1, outward: false, inside: true, select: { edges: [...topSeam(mesh), ...holeEdges] } }),
    kit.tag(124, 224, 'before merging: seam too', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 184),
    paint(kit, mesh, right, { width: 1.1, outward: false, inside: true, select: { edges: holeEdges } }),
    kit.tag(376, 224, 'after merging: the hole'),
  );
};
