// The Draw tool: a freehand stroke (dashed), and the Bézier curve Blender fits to it with a few
// control points.
import { drawCurve, pt } from './bezier.mjs';

export default (kit) => {
  const next = kit.random(4);
  const stroke = Array.from({ length: 40 }, (_, i) => { const t = i / 39; return [30 + t * 420, 130 - Math.sin(t * Math.PI * 1.6) * 60 + (next() - 0.5) * 8]; });
  return kit.svg({ width: 480, height: 220 },
    kit.smooth(stroke, { cls: 'd-guide', width: 2, dash: '5 4' }),
    drawCurve(kit, [pt(30, 130, -1.2, 40), pt(170, 70, 0.35, 50), pt(345, 175, 0.2, 50), pt(450, 120, -0.75, 30)]),
    kit.text(240, 210, 'your stroke (dashed) and the fitted curve', { anchor: 'middle', size: 12, cls: 'd-label' }),
  );
};
