// The Timeline for a 24-frame walk: keys every 3 frames from 1 to 25, the key poses named under
// the first step, and the playback range from 1 to 24 shaded.
import { timeline, field } from './helpers.mjs';

export default (kit) => {
  const t = timeline(kit, 30, 30, 480, { start: 1, end: 25, keys: [1, 4, 7, 10, 13, 16, 19, 22, 25], marked: [1, 13, 25], range: [1, 24], labels: [[1, '1'], [4, '4'], [7, '7'], [10, '10'], [13, '13'], [16, '16'], [19, '19'], [22, '22'], [25, '25']] });
  const names = [[1, 'contact'], [4, 'down'], [7, 'passing'], [10, 'up'], [13, 'contact'], [25, 'contact']];
  return kit.svg({ width: 540, height: 152 },
    t.svg,
    names.map(([f, name]) => kit.text(t.fx(f), 88, name, { anchor: 'middle', size: 11 })),
    kit.text(t.fx(13), 104, 'other foot', { anchor: 'middle', size: 11 }),
    kit.text(t.fx(25) - 6, 104, 'same as 1', { anchor: 'middle', size: 11 }),
    field(kit, 290, 120, 220, 'End', '24', { on: true, labelWidth: 0.3 }),
    field(kit, 30, 120, 220, 'Start', '1', { labelWidth: 0.3 }),
  );
};
