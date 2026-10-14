// Numpad 1, 3 and 7, and the views they give: front, right and top. Ctrl with each key shows the
// opposite side.
import { views, drawMesh, numpad } from '../../../diagrams/mesh.mjs';
import { lBlock, panel } from './shapes.mjs';

export default (kit) => {
  const m = lBlock();
  const cells = [['1  front', views.front], ['3  right', views.right], ['7  top', views.top]];
  return kit.svg({ width: 540, height: 190 },
    numpad(kit, 14, 20, { highlight: ['1', '3', '7'] }),
    cells.map(([label, make], i) => {
      const x = 164 + i * 124;
      const v = make({ at: [x + 56, 82], scale: 30, target: [0, 0, 1] });
      return [panel(kit, x, 20, 112, 120, label), drawMesh(kit, m, v, { width: 1.6 })];
    }),
    kit.text(350, 184, 'Ctrl with the same key: back, left, bottom', { anchor: 'middle', size: 12 }),
  );
};
