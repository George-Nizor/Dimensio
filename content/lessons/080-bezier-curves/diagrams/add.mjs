// Add > Curve > Bézier in Edit Mode: two control points, each with a handle either side that pulls the
// curve toward it.
import { drawCurve } from './bezier.mjs';

export default (kit) => {
  const pts = [{ p: [110, 150], l: [70, 190], r: [170, 90] }, { p: [330, 130], l: [250, 130], r: [410, 130] }];
  return kit.svg({ width: 480, height: 220 },
    drawCurve(kit, pts, { select: [0] }),
    kit.text(124, 168, 'control point', { size: 12 }),
    kit.text(180, 80, 'handle', { size: 12 }),
    kit.text(240, 210, 'Add > Curve > Bézier, then Tab', { anchor: 'middle', size: 12, cls: 'd-label' }),
  );
};
