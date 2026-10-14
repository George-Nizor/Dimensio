// Scaling the last bounce's keys by 0.5. Wrong: the playhead is on frame 1, so the keys close up
// towards frame 1 and the bounce jumps back in time. Right: the playhead is on the bounce's first
// key, frame 61, so that key stays and the others close up to it.
import { sheet } from './anim.mjs';

export default (kit) => {
  const keys = [61, 73, 85];
  const half = (y, frame, moved, tag, tone) => {
    const s = sheet(kit, { x: 10, y, w: 480, list: 90, start: 0, end: 90, every: 10, frame, channels: [{ label: 'before', keys, sel: keys }, { label: 'after', keys: moved, sel: moved }] });
    return [s.svg, kit.tag(250, y + 86, tag, { tone })];
  };
  return kit.svg({ width: 500, height: 210 },
    half(14, 1, [31, 37, 43], 'playhead on frame 1: the keys jump back', 'bad'),
    half(112, 61, [61, 67, 73], 'playhead on the first key: it stays put'),
  );
};
