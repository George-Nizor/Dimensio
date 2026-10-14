// Splitting a strip with K: before, one strip with the playhead over it; after, two strips that
// meet at the playhead.
import { keycap } from '../../../diagrams/mesh.mjs';
import { timeline } from './strips.mjs';

export default (kit) => {
  const before = timeline(kit, { x: 10, y: 10, w: 460, channels: 1, frames: [0, 200], ticks: 50, playhead: 120, strips: [{ ch: 1, start: 10, end: 190, label: 'crate.mp4', kind: 'movie', mark: true }] });
  const after = timeline(kit, { x: 10, y: 120, w: 460, channels: 1, frames: [0, 200], ticks: 50, playhead: 120, strips: [{ ch: 1, start: 10, end: 120, label: 'crate.mp4', kind: 'movie' }, { ch: 1, start: 120, end: 190, label: 'crate.mp4', kind: 'movie', mark: true }] });
  return kit.svg({ width: 480, height: 190 },
    before.svg,
    keycap(kit, 240, 92, 'K', { size: 12 }),
    after.svg,
  );
};
