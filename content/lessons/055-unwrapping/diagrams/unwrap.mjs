// U > Unwrap Angle Based on the crate with its seams: the faces open out into one island on the UV
// map, the top still joined to the back.
import { view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { uvSquare, drawUVs } from './uv.mjs';
import { crate, drawSeams } from './props.mjs';

export default (kit) => {
  const { mesh: m, seams, uvs } = crate();
  const v = view({ at: [110, 120], scale: 100 });
  return kit.svg({ width: 500, height: 260 },
    drawMesh(kit, m, v, { width: 1.3, select: { faces: m.faces.map((f, i) => i) } }),
    drawSeams(kit, m, v, seams),
    keycap(kit, 244, 92, 'U'),
    kit.text(244, 126, 'Unwrap', { anchor: 'middle', size: 12 }),
    kit.text(244, 142, 'Angle Based', { anchor: 'middle', size: 12 }),
    kit.line(214, 160, 274, 160, { cls: 'd-mark', width: 2 }), kit.arrowhead(274, 160, 0, { size: 8 }),
    uvSquare(kit, 290, 26, 200, { labels: false }),
    drawUVs(kit, uvs, 290, 26, 200, { select: m.faces.map((f, i) => i) }),
    kit.text(390, 250, 'one island', { anchor: 'middle', size: 12 }),
  );
};
