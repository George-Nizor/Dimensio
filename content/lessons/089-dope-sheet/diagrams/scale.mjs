// S scales the selected keys' timing from the playhead. With the playhead on frame 13, the keys after
// it close up towards it; the key on 13 stays put and values don't change.
import { sheet } from './anim.mjs';

export default (kit) => {
  const before = [13, 25, 37, 49];
  const after = [13, 19, 25, 31];
  const s = sheet(kit, { x: 10, y: 14, w: 520, list: 110, start: 0, end: 60, every: 10, frame: 13, channels: [{ label: 'before', keys: before, sel: before }, { label: 'after S 0.5', keys: after, sel: after }] });
  return kit.svg({ width: 540, height: 110 },
    s.svg,
    before.slice(1).map((f, i) => { const a = s.fx(f); const b = s.fx(after[i + 1]); return kit.arcArrow(a, s.rowY(0) + 8, b + 4, s.rowY(1) - 8, { lift: 0, width: 1.4 }); }),
    kit.text(270, 100, 'the gaps halve, measured from the playhead', { anchor: 'middle', size: 12 }),
  );
};
