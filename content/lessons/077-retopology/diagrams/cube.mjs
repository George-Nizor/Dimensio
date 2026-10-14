// A cube around the sculpt, cut three times along every edge with Edge > Subdivide: 96 quads. The
// Adjust Last Operation panel shows Number of Cuts 3.
import { view, drawMesh, scale } from '../../../diagrams/mesh.mjs';
import { sculpt, cutCube } from './stone.mjs';
import { propRow } from './props.mjs';

export default (kit) => {
  const v = view({ at: [140, 120], scale: 62, elevation: 24 });
  return kit.svg({ width: 480, height: 240 },
    drawMesh(kit, sculpt(), v, { mode: 'wire', cls: 'd-guide', width: 0.4 }),
    drawMesh(kit, scale(cutCube(), [1.4, 1.15, 0.95]), v, { mode: 'xray', width: 1.4 }),
    `<rect x="290" y="70" width="176" height="74" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(302, 92, 'Subdivide', { size: 12 }),
    propRow(kit, 298, 106, 'Number of Cuts', '3', { width: 160, split: 0.62, mark: true }),
    kit.text(378, 172, 'Edge > Subdivide', { anchor: 'middle', size: 12, cls: 'd-label' }),
  );
};
