// From the side. Wrong: Center Y left on, so each piece sits halfway up its 2.5 m cell and the
// building floats 1.25 m above the ground. Right: Center Y off, so pieces sit on the cell's floor.
import { views, drawMesh, join } from '../../../diagrams/mesh.mjs';
import { floor, wall, place, panel } from './kit.mjs';

export default (kit) => {
  const left = views.front({ scale: 34, at: [125, 178], target: [1, 0, 0] });
  const right = views.front({ scale: 34, at: [375, 178], target: [1, 0, 0] });
  const piece = (dz) => join(...[place(floor(), 0, 0), place(floor(), 1, 0), place(wall(), 0, 0, 0, 180), place(wall(), 1, 0, 0, 180)].map((m) => ({ verts: m.verts.map(([x, y, z]) => [x, y, z + dz]), faces: m.faces })));
  const ground = (v) => { const [x0, y0] = v.project([-1.6, 0, 0]); const [x1] = v.project([3.6, 0, 0]); return kit.line(x0, y0, x1, y0, { cls: 'd-guide', width: 1.4 }); };
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 222, 196),
    ground(left), drawMesh(kit, piece(1.25), left, { width: 1.3 }),
    kit.tag(125, 236, 'Center Y on', { tone: 'bad' }),
    panel(kit, 264, 14, 222, 196),
    ground(right), drawMesh(kit, piece(0), right, { width: 1.3 }),
    kit.tag(375, 236, 'Center Y off'),
  );
};
