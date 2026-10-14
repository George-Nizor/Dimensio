// The Decimate modifier with Ratio lowered until its face count reads about 150, and the sculpted
// rock before and after: dense, then a few flat facets.
import { view, drawMesh, transform } from '../../../diagrams/mesh.mjs';
import { icoSphere, displace } from './shapes.mjs';
import { propRow } from './props.mjs';

export default (kit) => {
  const at = (x) => view({ scale: 150, elevation: 22, target: [0, 0, 0], at: [x, 150] });
  const dense = transform(displace(icoSphere(4), 0.06, 2), ([x, y, z]) => [x * 0.36, y * 0.3, z * 0.22]);
  const facets = transform(displace(icoSphere(2), 0.1, 2), ([x, y, z]) => [x * 0.36, y * 0.3, z * 0.22]);
  return kit.svg({ width: 500, height: 220 },
    `<rect x="14" y="14" width="210" height="98" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 36, 'Decimate', { size: 12 }),
    propRow(kit, 22, 46, '', 'Collapse', { width: 194, split: 0.12 }),
    propRow(kit, 22, 72, 'Ratio', '0.040', { width: 194, split: 0.4, mark: true }),
    kit.text(120, 104, 'Face Count: 150', { anchor: 'middle', size: 11, cls: 'd-label' }),
    drawMesh(kit, dense, at(300), { width: 0.4 }),
    kit.line(358, 150, 388, 150, { cls: 'd-mark', width: 2 }), kit.arrowhead(390, 150, 0, { size: 8 }),
    drawMesh(kit, facets, at(446), { width: 1.2 }),
  );
};
