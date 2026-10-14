// One face on a grid, then the selection grown twice with Ctrl+Numpad +: three by three faces,
// then five by five.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { floor, face } from './shapes.mjs';

export default (kit) => {
  const n = 7;
  const m = floor(n);
  const square = (r) => { const out = []; for (let j = 3 - r; j <= 3 + r; j += 1) for (let i = 3 - r; i <= 3 + r; i += 1) out.push(face(i, j, n)); return out; };
  const vs = [0, 1, 2].map((k) => views.top({ at: [80 + k * 170, 92], scale: 60 }));
  return kit.svg({ width: 510, height: 210 },
    vs.map((v, k) => drawMesh(kit, m, v, { width: 1, select: { faces: square(k) } })),
    [0, 1].map((k) => [kit.line(152 + k * 170, 92, 178 + k * 170, 92, { cls: 'd-mark', width: 2 }), kit.arrowhead(178 + k * 170, 92, 0, { size: 7 })]),
    kit.text(255, 196, 'Ctrl+Numpad + grows it by one ring', { anchor: 'middle', size: 12 }),
  );
};
