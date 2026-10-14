// The Statistics overlay in the top left of the 3D Viewport, for the cube in Edit Mode with its top
// face selected: Objects 1/3, Vertices 4/8, Edges 4/12, Faces 1/6, Triangles 12.
import { cube, view, drawMesh, facesWhere } from '../../../diagrams/mesh.mjs';
import { vertexDots } from './helpers.mjs';

export default (kit) => {
  const m = cube();
  const v = view({ at: [300, 140], scale: 54 });
  const lines = [['User Perspective', ''], ['(1) Cube', ''], ['Objects', '1/3'], ['Vertices', '4/8'], ['Edges', '4/12'], ['Faces', '1/6'], ['Triangles', '12']];
  return kit.svg({ width: 440, height: 260 },
    `<rect x="14" y="14" width="412" height="232" rx="5" class="d-ui" stroke-width="1"/>`,
    lines.map(([name, value], i) => [
      kit.text(28, 40 + i * 20, name, { size: 12, cls: i < 2 ? 'd-label' : 'd-key-text' }),
      value ? kit.text(140, 40 + i * 20, value, { anchor: 'end', size: 12, cls: 'd-key-text' }) : '',
    ]),
    `<rect x="22" y="${40 + 2 * 20 - 15}" width="128" height="${5 * 20}" rx="4" class="d-mark" fill="none" stroke-width="1.6"/>`,
    drawMesh(kit, m, v, { width: 1.5, select: { faces: facesWhere(m, (c, n) => n[2] > 0.9) } }),
    vertexDots(kit, m, v),
  );
};
