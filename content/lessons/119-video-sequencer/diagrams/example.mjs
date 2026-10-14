// A finished 20-second edit in the Sequencer: three shots on channel 1, a title over the first one
// on channel 2 and music under everything on channel 3, ending at frame 480.
import { timeline } from './strips.mjs';

export default (kit) => {
  const t = timeline(kit, {
    x: 10, y: 10, w: 480, frames: [0, 500], end: 480,
    strips: [
      { ch: 1, start: 1, end: 170, label: 'barrel.mp4', kind: 'movie' },
      { ch: 1, start: 170, end: 330, label: 'crate.mp4', kind: 'movie' },
      { ch: 1, start: 330, end: 480, label: 'chest.mp4', kind: 'movie' },
      { ch: 2, start: 1, end: 96, label: 'Title', kind: 'text' },
      { ch: 3, start: 1, end: 480, label: '', kind: 'sound' },
    ],
  });
  return kit.svg({ width: 500, height: 150 }, t.svg, kit.text(450, 140, 'End 480', { anchor: 'end', size: 11 }));
};
