// The close action in the Graph Editor: the lid's X rotation from -100 degrees at frame 1 to 0 at
// frame 12. With its first keyframe set to Bounce, the curve reaches 0, drops back and bounces
// a few more times, smaller each time, before it settles.
import { menu, key, timeScale } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from './chestkit.mjs';

// Robert Penner's bounce ease-out, the shape Blender's Bounce easing follows.
function bounceOut(t) {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) { const u = t - 1.5 / d; return n * u * u + 0.75; }
  if (t < 2.5 / d) { const u = t - 2.25 / d; return n * u * u + 0.9375; }
  const u = t - 2.625 / d;
  return n * u * u + 0.984375;
}

export default (kit) => {
  const at = timeScale(70, 250, 1, 12);
  const y = (deg) => 60 + (-deg / 100) * 150;
  const pts = [];
  for (let i = 0; i <= 120; i += 1) {
    const t = i / 120;
    pts.push([at(1 + 11 * t), y(-100 + 100 * bounceOut(t))]);
  }
  return kit.svg({ width: 480, height: 260 },
    frame(kit, 14, 14, 330, 230),
    kit.line(70, y(0), 330, y(0), { cls: 'd-guide', width: 1 }),
    kit.text(62, y(0) + 4, '0°', { anchor: 'end', size: 11 }),
    kit.text(62, y(-100) + 4, '-100°', { anchor: 'end', size: 11 }),
    kit.polyline(pts, { cls: 'd-mark', width: 2 }),
    key(kit, at(1), y(-100), { mark: true }),
    key(kit, at(12), y(0)),
    kit.text(at(1), 236, '1', { anchor: 'middle', size: 11 }),
    kit.text(at(12), 236, '12', { anchor: 'middle', size: 11 }),
    menu(kit, 356, 24, ['Back', 'Bounce', 'Elastic'], { w: 112, mark: 'Bounce', title: 'T: Dynamic' }),
  );
};
