// A 1 m cube with a test grid on it, and its UV map in the UV Editor: the six faces laid flat in a
// cross on the image's square. The front face is selected in both.
import { view } from '../../../diagrams/mesh.mjs';
import { drawTextured, uvSquare, drawUVs } from './uv.mjs';
import { crate } from './props.mjs';

export default (kit) => {
  const { mesh: m, uvs } = crate();
  const front = m.faces.findIndex((f) => f.every((i) => m.verts[i][1] < 0));
  const v = view({ at: [130, 130], scale: 110, target: [0, 0, 0] });
  return kit.svg({ width: 520, height: 260 },
    drawTextured(kit, m, v, uvs, { cells: 16, select: [front] }),
    kit.text(130, 250, '3D Viewport', { anchor: 'middle', size: 12 }),
    uvSquare(kit, 300, 20, 200),
    drawUVs(kit, uvs, 300, 20, 200, { select: [front] }),
    kit.text(400, 250, 'UV Editor', { anchor: 'middle', size: 12 }),
  );
};
