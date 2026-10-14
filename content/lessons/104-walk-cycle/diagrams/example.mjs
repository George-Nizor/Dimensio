// The walk's eight key poses in a row, frames 1 to 22, with the hips' height drawn as a line:
// low on the down poses, high on the up poses. The second four are the first four flipped.
import { walker, ground } from './helpers.mjs';
import { POSES, flip, place, KEYS } from './walk.mjs';

export default (kit) => {
  const out = [ground(kit, 14, 546, 182)];
  const hips = [];
  KEYS.slice(0, 8).forEach(([frame, name], i) => {
    const pose = i < 4 ? POSES[name] : flip(POSES[name]);
    const x = 44 + i * 66;
    const placed = place(pose, x, 182, 1.05);
    hips.push(placed.hip);
    out.push(walker(kit, placed, { s: 0.95 }));
    out.push(kit.text(x, 204, String(frame), { anchor: 'middle', size: 12 }));
  });
  out.push(kit.polyline(hips, { cls: 'd-mark', width: 1.6, dash: '4 4' }));
  return kit.svg({ width: 560, height: 214 }, out);
};
