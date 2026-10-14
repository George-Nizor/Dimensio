// Two fingers on a touchpad: dragging on their own orbits, with Shift held they pan, with Ctrl held
// they zoom.
import { touchpad } from './laptop.mjs';
import { keyRow } from './parts.mjs';

export default (kit) => {
  const cell = (x, keys, label, gesture) => {
    const out = [touchpad(kit, x, 30, 140, 96, { fingers: [[0.4, 0.55], [0.56, 0.55]] })];
    if (keys) out.push(keyRow(kit, x + 70 - 23, 150, keys, { size: 11 }).svg);
    out.push(gesture);
    out.push(kit.text(x + 70, 196, label, { anchor: 'middle', size: 14, cls: 'd-tag' }));
    return out;
  };
  return kit.svg({ width: 500, height: 212 },
    cell(14, null, 'orbit', kit.arcArrow(52, 106, 116, 70, { lift: -14 })),
    cell(180, ['Shift'], 'pan', [kit.line(212, 98, 290, 98, { cls: 'd-mark', width: 2 }), kit.arrowhead(212, 98, Math.PI, { size: 8 }), kit.arrowhead(290, 98, 0, { size: 8 })]),
    cell(346, ['Ctrl'], 'zoom', [kit.line(424, 44, 424, 116, { cls: 'd-mark', width: 2 }), kit.arrowhead(424, 44, -Math.PI / 2, { size: 8 }), kit.arrowhead(424, 116, Math.PI / 2, { size: 8 })]),
  );
};
