// Four drawings of a flickering flame on frames 1, 4, 7 and 10 of a 12-frame loop, each a little
// different from the one before, with an arrow from the last back to the first.
import { flame, KEYS } from './flame.mjs';

export default (kit) => kit.svg({ width: 500, height: 230 },
  KEYS.map((key, i) => {
    const cx = 70 + i * 120;
    return [
      `<rect x="${cx - 52}" y="20" width="104" height="150" rx="5" class="d-paper" stroke-width="1.2"/>`,
      flame(kit, cx, 160, key, { size: 30 }),
      kit.text(cx, 192, `frame ${[1, 4, 7, 10][i]}`, { anchor: 'middle', size: 12 }),
    ];
  }),
  kit.arcArrow(430, 205, 70, 205, { lift: -14 }),
  kit.text(250, 226, 'plays again from frame 1 after frame 12', { anchor: 'middle', size: 12 }),
);
