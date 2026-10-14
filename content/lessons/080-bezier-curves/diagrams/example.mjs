// The exercise traced from the top view: a Bézier curve down the middle of the road with four control
// points, and a second curve along the hook.
import { drawCurve, curvePath, pt } from './bezier.mjs';

export default (kit) => {
  const road = [pt(40, 210, -1.25, 40), pt(120, 110, -0.35, 44), pt(230, 92, 0, 40), pt(300, 40, -1.9, 34)];
  const hook = [{ p: [400, 40], l: [400, 30], r: [400, 70] }, pt(400, 150, Math.PI / 2, 20), pt(430, 190, 0, 18), pt(460, 150, -Math.PI / 2, 20), { p: [460, 120], l: [460, 134], r: [460, 110] }];
  return kit.svg({ width: 500, height: 240 },
    kit.path(curvePath(road), { cls: 'd-guide', width: 26 }),
    kit.path(curvePath(hook), { cls: 'd-guide', width: 10 }),
    drawCurve(kit, road),
    drawCurve(kit, hook),
    kit.text(170, 232, 'road', { anchor: 'middle', size: 12 }),
    kit.text(430, 232, 'hook', { anchor: 'middle', size: 12 }),
  );
};
