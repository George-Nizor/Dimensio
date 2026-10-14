// Planar mode on a wall built from many flat quads: the faces that lie flat against each other
// merge, leaving the same shape with far fewer faces.
import { view, drawMesh, box } from '../../../diagrams/mesh.mjs';
import { panel } from './shapes.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 18, scale: 62, at: [125, 120], target: [0, 0, 0.75] });
  const right = view({ azimuth: 30, elevation: 18, scale: 62, at: [375, 120], target: [0, 0, 0.75] });
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 222, 196, 'before: 124 faces'),
    drawMesh(kit, box({ size: [2, 0.2, 1.5], segments: [8, 1, 6], center: [0, 0, 0.75] }), left, { width: 1 }),
    kit.line(240, 112, 258, 112, { cls: 'd-mark', width: 2 }), kit.arrowhead(258, 112, 0, { size: 8 }),
    panel(kit, 264, 14, 222, 196, 'Planar: 6 faces'),
    drawMesh(kit, box({ size: [2, 0.2, 1.5], center: [0, 0, 0.75] }), right, { width: 1.4 }),
  );
};
