// The Dope Sheet with the ball selected: the channel list on the left, one row per channel, and a
// diamond for every keyframe. The Summary row shows every key.
import { sheet } from './anim.mjs';
import { EVEN } from './bounce.mjs';

export default (kit) => {
  const s = sheet(kit, { x: 10, y: 14, w: 520, list: 130, start: 0, end: 90, every: 10, frame: 1, channels: [{ label: 'Summary', keys: EVEN }, { label: 'Ball', keys: EVEN, indent: 1 }, { label: 'Object Transforms', keys: EVEN, indent: 2 }, { label: 'Z Location', keys: EVEN, indent: 3 }] });
  return kit.svg({ width: 540, height: 160 },
    s.svg,
    kit.text(75, 144, 'channels', { anchor: 'middle', size: 12, cls: 'd-tag' }),
    kit.text(s.fx(37), 144, 'keyframes', { anchor: 'middle', size: 12, cls: 'd-tag' }),
  );
};
