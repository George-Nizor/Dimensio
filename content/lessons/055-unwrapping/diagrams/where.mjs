// Where the seams go. The crate: down its four upright edges and round three sides of its top, like
// a cardboard box. The barrel: down its back and round both ends. Edges behind are dashed.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { crate, barrel, drawSeams } from './props.mjs';

export default (kit) => {
  const c = crate();
  const b = barrel();
  const vc = view({ at: [120, 130], scale: 110 });
  const vb = view({ at: [370, 150], scale: 130, target: [0, 0, 0.6], azimuth: 210, elevation: 24 });
  return kit.svg({ width: 500, height: 270 },
    drawMesh(kit, c.mesh, vc, { width: 1.3 }),
    drawSeams(kit, c.mesh, vc, c.seams),
    kit.text(120, 258, 'crate: 7 seams', { anchor: 'middle', size: 12 }),
    drawMesh(kit, b.mesh, vb, { width: 1.1 }),
    drawSeams(kit, b.mesh, vb, b.seams),
    kit.text(370, 258, 'barrel, from the back', { anchor: 'middle', size: 12 }),
  );
};
