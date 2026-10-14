// F joins two selected end points with a new segment. Alt+C closes a curve from its last point back
// to its first.
import { drawCurve, pt } from './bezier.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const open = [pt(40, 150, -0.9, 26), pt(110, 70, 0, 26), pt(180, 150, 0.9, 26)];
  const closedPts = [pt(300, 150, -0.9, 26), pt(370, 70, 0, 26), pt(440, 150, 0.9, 26)];
  return kit.svg({ width: 480, height: 220 },
    drawCurve(kit, open, { select: [0, 2] }),
    kit.path('M 40 150 C 60 196 160 196 180 150', { cls: 'd-mark', width: 2, dash: '6 5' }),
    keycap(kit, 110, 208, 'F'),
    drawCurve(kit, closedPts, { closed: true }),
    keycap(kit, 370, 208, 'Alt+C', { size: 12 }),
  );
};
