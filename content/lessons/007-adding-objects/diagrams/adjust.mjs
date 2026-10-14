// The Adjust Last Operation panel for Add Cylinder, set to Vertices 8, Radius 0.5 m and Depth 1 m,
// beside the eight-sided cylinder it makes.
import { cylinder, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { field } from './parts.mjs';

export default (kit) => {
  const v = view({ at: [380, 126], scale: 110, elevation: 32 });
  return kit.svg({ width: 500, height: 240 },
    `<rect x="16" y="40" width="250" height="170" rx="6" class="d-ui" stroke-width="1"/>`,
    `<rect x="16" y="40" width="250" height="28" rx="6" class="d-sunk" stroke-width="1"/>`,
    kit.text(30, 59, 'Add Cylinder', { size: 12 }),
    field(kit, 20, 92, 'Vertices', '8', { labelWidth: 100, width: 130, mark: true }),
    field(kit, 20, 118, 'Radius', '0.5 m', { labelWidth: 100, width: 130, mark: true }),
    field(kit, 20, 144, 'Depth', '1 m', { labelWidth: 100, width: 130, mark: true }),
    field(kit, 20, 170, 'Cap Fill Type', 'N-Gon', { labelWidth: 100, width: 130 }),
    kit.text(141, 226, 'bottom left of the viewport', { anchor: 'middle', size: 11 }),
    drawMesh(kit, cylinder({ vertices: 8, radius: 0.5, depth: 1 }), v, { width: 1.8 }),
  );
};
