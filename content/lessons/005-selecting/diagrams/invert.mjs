// Left, two crates selected among five objects. Right, after Ctrl+I the other three are selected
// and the crates are not.
import { keycap } from '../../../diagrams/mesh.mjs';
import { panel } from './parts.mjs';
import { yardView, drawYard, B, C } from './yard.mjs';

export default (kit) => {
  const scene = (at, flip) => {
    const s = (sel) => (sel !== flip ? 'selected' : 'none');
    const v = yardView({ at, scale: 26 });
    return drawYard(kit, v, [C(-1.8, 0.8, s(true)), B(0, 1.2, s(false)), B(1.8, 0.6, s(false)), C(-0.8, -1, s(true)), B(1.2, -1.2, s(false))]);
  };
  return kit.svg({ width: 520, height: 210 },
    panel(kit, 14, 14, 210, 170), scene([119, 104], false),
    keycap(kit, 260, 100, 'Ctrl+I', { size: 11 }),
    panel(kit, 296, 14, 210, 170), scene([401, 104], true),
  );
};
