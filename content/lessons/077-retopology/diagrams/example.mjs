// The finished retopology: a low-poly stone of 96 quads lying on the sculpted stone, its edges drawn
// over the sculpt.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { sculpt, lowStone } from './stone.mjs';
import { drawSculpt } from './sculpt.mjs';

export default (kit) => {
  const left = view({ at: [130, 112], scale: 70, elevation: 24 });
  const right = view({ at: [380, 112], scale: 70, elevation: 24 });
  return kit.svg({ width: 520, height: 230 },
    drawSculpt(kit, sculpt(), left),
    kit.text(130, 218, 'the sculpt: 20,480 triangles', { anchor: 'middle', size: 12 }),
    drawMesh(kit, lowStone(), right, { width: 1.4 }),
    kit.text(380, 218, 'the retopology: 192 triangles', { anchor: 'middle', size: 12 }),
  );
};
