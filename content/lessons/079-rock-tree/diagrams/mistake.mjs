// Wrong: leaves from an ico sphere with Subdivisions 4, 1,280 triangles, far over the budget. Right:
// Subdivisions 2, 80 triangles, lumpy with Displace.
import { view, drawMesh, scale } from '../../../diagrams/mesh.mjs';
import { icoSphere, displace } from './shapes.mjs';

export default (kit) => kit.svg({ width: 480, height: 230 },
  drawMesh(kit, scale(icoSphere(4), [1, 1, 1.25]), view({ scale: 58, elevation: 18, at: [120, 96] }), { width: 0.6 }),
  kit.text(120, 190, '1,280 triangles', { anchor: 'middle', size: 12 }),
  kit.tag(120, 220, 'Subdivisions 4', { tone: 'bad' }),
  drawMesh(kit, scale(displace(icoSphere(2), 0.16, 9), [1, 1, 1.25]), view({ scale: 58, elevation: 18, at: [360, 96] }), { width: 1.2 }),
  kit.text(360, 190, '80 triangles', { anchor: 'middle', size: 12 }),
  kit.tag(360, 220, 'Subdivisions 2'),
);
