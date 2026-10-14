// Left, the crate's origin outside it. Right, after Object > Set Origin > Origin to Geometry, the
// origin is at the middle of the crate and the crate hasn't moved.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, origin } from './parts.mjs';
import { crate } from './props.mjs';

export default (kit) => {
  const cell = (x, at, label) => {
    const v = view({ at: [x + 100, 120], scale: 52, target: [0.3, 0.3, 0.8] });
    const [ox, oy] = v.project(at);
    return [panel(kit, x, 14, 200, 176, label), drawMesh(kit, crate(), v, { width: 1.6, cls: 'd-mark' }), origin(kit, ox, oy)];
  };
  return kit.svg({ width: 460, height: 214 },
    cell(14, [1.2, 1.6, 1.7], 'before'),
    kit.line(222, 102, 240, 102, { cls: 'd-mark', width: 2 }), kit.arrowhead(240, 102, 0, { size: 7 }),
    cell(246, [0, 0, 0.5], 'Origin to Geometry'),
  );
};
