// Smart UV Project on the rock: no seams needed. It cuts the rock where faces turn more than the
// Angle Limit, 66 degrees, and lays the pieces out as separate islands.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { uvSquare, drawUVs } from './uv.mjs';
import { rock } from './props.mjs';

export default (kit) => {
  const { mesh: m, uvs } = rock();
  const v = view({ at: [110, 130], scale: 160, target: [0, 0, 0] });
  return kit.svg({ width: 500, height: 260 },
    drawMesh(kit, m, v, { width: 1.1 }),
    kit.text(110, 250, 'the rock, no seams', { anchor: 'middle', size: 12 }),
    kit.line(214, 130, 274, 130, { cls: 'd-mark', width: 2 }), kit.arrowhead(274, 130, 0, { size: 8 }),
    kit.text(244, 110, 'Smart UV', { anchor: 'middle', size: 12 }),
    uvSquare(kit, 290, 26, 200, { labels: false }),
    drawUVs(kit, uvs, 290, 26, 200),
    kit.text(390, 250, 'several islands', { anchor: 'middle', size: 12 }),
  );
};
