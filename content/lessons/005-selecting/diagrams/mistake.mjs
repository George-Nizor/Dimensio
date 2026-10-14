// Wrong: a Shift-click on a selected crate that isn't active only makes it active; it stays
// selected. Right: a second Shift-click on the same crate deselects it.
import { cursor } from '../../../diagrams/mesh.mjs';
import { panel } from './parts.mjs';
import { yardView, drawYard, C } from './yard.mjs';

export default (kit) => {
  const half = (x, state, tag, tone) => {
    const v = yardView({ at: [x + 110, 104], scale: 26 });
    const [cx, cy] = v.project([0, 0, 0.9]);
    return [
      panel(kit, x, 14, 220, 170),
      drawYard(kit, v, [C(-2, 0.6, 'selected'), C(0, 0, state), C(2, -0.6, 'selected')]),
      cursor(kit, cx - 4, cy - 6),
      kit.tag(x + 110, 210, tag, { tone }),
    ];
  };
  return kit.svg({ width: 500, height: 225 },
    half(14, 'active', 'first Shift-click: still selected', 'bad'),
    half(266, 'none', 'second Shift-click: deselected'),
  );
};
