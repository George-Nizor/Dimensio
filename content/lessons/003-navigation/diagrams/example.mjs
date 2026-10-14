// The L-shaped block seen four ways: front (numpad 1), right (numpad 3), top (numpad 7) and
// Blender's opening view.
import { views, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { lBlock, panel } from './shapes.mjs';

export default (kit) => {
  const m = lBlock();
  const cells = [['front', views.front], ['right', views.right], ['top', views.top], ['opening view', view]];
  return kit.svg({ width: 540, height: 170 }, cells.map(([label, make], i) => {
    const x = 10 + i * 132;
    const v = make({ at: [x + 60, 82], scale: 32, target: [0, 0, 1] });
    return [panel(kit, x, 20, 120, 120, label), drawMesh(kit, m, v, { width: 1.6 })];
  }));
};
