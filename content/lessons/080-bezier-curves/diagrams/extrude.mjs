// Adding points: E extrudes a new point from the selected end, and Ctrl with a right click adds one
// where the mouse is.
import { drawCurve, pt } from './bezier.mjs';
import { keycap, cursor } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const base = [pt(30, 150, -0.4, 30), pt(150, 110, 0, 30)];
  return kit.svg({ width: 480, height: 210 },
    drawCurve(kit, [...base, pt(220, 140, 0.6, 24)], { select: [2] }),
    kit.line(156, 110, 214, 136, { cls: 'd-mark', width: 1.6, dash: '4 4' }),
    keycap(kit, 120, 40, 'E'),
    drawCurve(kit, [pt(270, 150, -0.4, 30), pt(390, 110, 0, 30), pt(450, 150, 0.9, 20)], { select: [2] }),
    cursor(kit, 452, 152),
    keycap(kit, 360, 40, 'Ctrl', { size: 12 }), kit.text(396, 45, '+ right click', { size: 12 }),
  );
};
