// Dragging the end of a handle bends the curve: the same two points before and after the right
// handle of the first is pulled up.
import { drawCurve } from './bezier.mjs';

export default (kit) => {
  const before = [{ p: [30, 150], l: [10, 150], r: [90, 150] }, { p: [200, 150], l: [140, 150], r: [220, 150] }];
  const after = [{ p: [270, 150], l: [230, 190], r: [350, 70] }, { p: [440, 150], l: [380, 150], r: [460, 150] }];
  return kit.svg({ width: 480, height: 210 },
    drawCurve(kit, before),
    kit.text(115, 196, 'before', { anchor: 'middle', size: 12 }),
    drawCurve(kit, after, { select: [0] }),
    kit.line(330, 150, 348, 82, { cls: 'd-mark', width: 1.6, dash: '4 4' }),
    kit.arrowhead(348, 80, -1.32, { size: 7 }),
    kit.text(355, 196, 'handle dragged up', { anchor: 'middle', size: 12 }),
  );
};
