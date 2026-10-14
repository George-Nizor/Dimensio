// A modifier panel's header with its buttons named: Edit Mode, viewport, render, the menu, delete
// and the dots to drag it by. The viewport button is picked out.
import { modPanel } from './modkit.mjs';

export default (kit) => {
  const p = modPanel(kit, 20, 40, { w: 460, name: 'Subdivision', mark: 'viewport', s: 1.5 });
  const label = (key, text, y, anchor = 'middle') => {
    const [x, by] = p.at[key];
    return [kit.line(x, by + 16, x, y - 13, { cls: 'd-guide', width: 1 }), kit.text(x, y, text, { anchor, size: 12 })];
  };
  return kit.svg({ width: 500, height: 170 },
    p.svg,
    label('editmode', 'Edit Mode', 116, 'end'),
    label('viewport', 'viewport', 150),
    label('render', 'render', 116),
    label('menu', 'menu', 150),
    label('close', 'delete', 116),
    label('grip', 'drag', 150, 'end'),
    kit.tag(20, 24, 'off: the effect is hidden, the modifier stays', { anchor: 'start' }),
  );
};
