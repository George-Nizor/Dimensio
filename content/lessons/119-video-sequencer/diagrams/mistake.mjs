// Wrong: the strips run to frame 480 but End is still 250, so the video stops halfway through the
// second shot. Right: End set to 480, the end of the last strip.
import { timeline } from './strips.mjs';

const shots = [
  { ch: 1, start: 1, end: 170, label: 'barrel', kind: 'movie' },
  { ch: 1, start: 170, end: 330, label: 'crate', kind: 'movie' },
  { ch: 1, start: 330, end: 480, label: 'chest', kind: 'movie' },
  { ch: 2, start: 1, end: 480, kind: 'sound' },
];

export default (kit) => {
  const wrong = timeline(kit, { x: 10, y: 10, w: 480, channels: 2, frames: [0, 500], end: 250, strips: shots });
  const right = timeline(kit, { x: 10, y: 130, w: 480, channels: 2, frames: [0, 500], end: 480, strips: shots });
  return kit.svg({ width: 500, height: 250 },
    wrong.svg, kit.tag(250, 116, 'End 250: the video stops at 10 seconds', { tone: 'bad' }),
    right.svg, kit.tag(250, 236, 'End 480: all 20 seconds'),
  );
};
