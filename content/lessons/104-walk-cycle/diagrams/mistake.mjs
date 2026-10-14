// Frames around the loop point. Wrong: playing frames 1 to 25 shows the contact pose on 25 and
// again on 1, so the walk stalls for a frame. Right: the End frame is 24, so 24 runs into 1.
import { walker, panel } from './helpers.mjs';
import { POSES, flip, mix, place } from './walk.mjs';

export default (kit) => {
  const upOther = flip(POSES.up);
  const frame = (f) => {
    if (f === 25 || f === 1) return POSES.contact;
    if (f === 23) return mix(upOther, POSES.contact, 1 / 3);
    if (f === 24) return mix(upOther, POSES.contact, 2 / 3);
    return mix(POSES.contact, POSES.down, 1 / 3);
  };
  const row = (y, frames, bad) => frames.map((f, i) => {
    const x = 40 + i * 64;
    const twin = bad && (f === 25 || f === 1);
    return [
      `<rect x="${x - 28}" y="${y - 92}" width="56" height="102" rx="5" class="${twin ? 'd-paper' : 'd-ui'}" stroke-width="1"/>`,
      twin ? `<rect x="${x - 28}" y="${y - 92}" width="56" height="102" rx="5" class="d-bad" fill="none" stroke-width="2"/>` : '',
      walker(kit, place(frame(f), x, y + 2, 0.56), { s: 0.5 }),
      kit.text(x, y + 30, String(f), { anchor: 'middle', size: 12 }),
    ];
  });
  return kit.svg({ width: 520, height: 272 },
    row(106, [23, 24, 25, 1, 2], true),
    kit.tag(360, 60, 'End 25', { tone: 'bad', anchor: 'start' }),
    kit.text(360, 82, 'contact shown twice', { size: 12 }),
    row(236, [23, 24, 1, 2], false),
    kit.tag(360, 190, 'End 24', { anchor: 'start' }),
    kit.text(360, 212, '24 runs into 1', { size: 12 }),
  );
};
