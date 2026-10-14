// The other three key poses of the first step, with their frames: down on 4 (hips lowest),
// passing on 7 (the back leg swings past) and up on 10 (hips highest, on the toes).
import { walker, ground } from './helpers.mjs';
import { POSES, place } from './walk.mjs';

export default (kit) => {
  const cells = [['down', 4, 'hips lowest'], ['passing', 7, 'leg swings past'], ['up', 10, 'hips highest']];
  const out = [ground(kit, 20, 520, 206)];
  const hipLine = [];
  cells.forEach(([name, frame, note], i) => {
    const x = 100 + i * 170;
    const p = place(POSES[name], x, 206, 1.2);
    hipLine.push(p.hip[1]);
    out.push(walker(kit, p, { s: 1.15 }));
    out.push(kit.text(x, 228, `${frame}  ${name}`, { anchor: 'middle', size: 12 }));
    out.push(kit.text(x, 18, note, { anchor: 'middle', size: 11 }));
    out.push(kit.line(x - 34, p.hip[1], x + 34, p.hip[1], { cls: 'd-mark', width: 1.4, dash: '4 3' }));
  });
  return kit.svg({ width: 540, height: 238 }, out);
};
