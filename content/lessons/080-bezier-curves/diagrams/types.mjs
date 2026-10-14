// The four handle types on the middle point of the same three points, set with V: Automatic, Vector,
// Aligned and Free.
import { drawCurve } from './bezier.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const cell = (x, label, mid) => [
    drawCurve(kit, [{ p: [x, 140], l: [x - 10, 150], r: [x + 20, 110] }, mid, { p: [x + 100, 140], l: [x + 80, 110], r: [x + 110, 150] }], { select: [1], width: 2 }),
    kit.text(x + 50, 186, label, { anchor: 'middle', size: 12 }),
  ];
  return kit.svg({ width: 520, height: 200 },
    keycap(kit, 30, 30, 'V'),
    cell(10, 'Automatic', { p: [60, 70], l: [35, 70], r: [85, 70] }),
    cell(140, 'Vector', { p: [190, 70], l: [178, 93], r: [202, 93] }),
    cell(270, 'Aligned', { p: [320, 70], l: [280, 90], r: [340, 60] }),
    cell(400, 'Free', { p: [450, 70], l: [430, 100], r: [490, 80] }),
  );
};
