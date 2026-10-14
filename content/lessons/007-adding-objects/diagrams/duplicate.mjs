// Shift+D, X, 2, Enter: a copy of the cylinder 2 m along X, measured between their middles.
import { cylinder, view, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { keyRow } from './parts.mjs';

export default (kit) => {
  const v = view({ azimuth: 10, elevation: 20, at: [230, 124], scale: 64, target: [1, 0, 0.5] });
  return kit.svg({ width: 460, height: 250 },
    keyRow(kit, 20, 28, ['Shift+D', 'X', '2', 'Enter'], { size: 12 }).svg,
    drawMesh(kit, cylinder({ vertices: 8, radius: 0.5, depth: 1, center: [0, 0, 0.5] }), v, { width: 1.6 }),
    drawMesh(kit, cylinder({ vertices: 8, radius: 0.5, depth: 1, center: [2, 0, 0.5] }), v, { width: 1.8, cls: 'd-mark' }),
    dimension(kit, v, [0, 0, 0], [2, 0, 0], { offset: [0, -1.2, 0] }),
  );
};
