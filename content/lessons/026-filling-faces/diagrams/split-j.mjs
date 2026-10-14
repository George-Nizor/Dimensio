// J on the box's six-sided top: two vertices selected on opposite sides, then a new edge between
// them splits the face into two quads.
import { view, keycap } from '../../../diagrams/mesh.mjs';
import { filledBox, splitBox, boxRim } from './shapes.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 38, at: [110, 112], scale: 92, target: [0, 0, 0.5] });
  const right = view({ azimuth: 30, elevation: 38, at: [390, 112], scale: 92, target: [0, 0, 0.5] });
  const hex = filledBox();
  const rim = boxRim(hex);
  const split = splitBox();
  const r2 = boxRim(split);
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 192, 180, 'two vertices selected'),
    paint(kit, hex, left, { width: 2.2, select: { verts: [rim[1], rim[4]] } }),
    step(kit, 218, 104, 282), keycap(kit, 250, 80, 'J'),
    panel(kit, 294, 14, 192, 180, 'two quads'),
    paint(kit, split, right, { select: { edges: [[r2[1], r2[4]]] } }),
  );
};
