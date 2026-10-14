// F on the box's open top: the six edges round the hole selected, then one new face across it.
import { view, keycap } from '../../../diagrams/mesh.mjs';
import { openBox, filledBox, boxRim, rimEdges } from './shapes.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 38, at: [110, 112], scale: 92, target: [0, 0, 0.5] });
  const right = view({ azimuth: 30, elevation: 38, at: [390, 112], scale: 92, target: [0, 0, 0.5] });
  const open = openBox();
  const done = filledBox();
  const top = done.faces.length - 1;
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 192, 180, 'rim selected'),
    paint(kit, open, left, { inside: true, select: { edges: rimEdges(boxRim(open)) } }),
    step(kit, 218, 104, 282), keycap(kit, 250, 80, 'F'),
    panel(kit, 294, 14, 192, 180, 'one new face'),
    paint(kit, done, right, { fill: (i) => (i === top ? 'd-face-sel' : null) }),
  );
};
