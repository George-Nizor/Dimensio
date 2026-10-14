// The two actions ready to export, stashed on NLA tracks: idle-loop 48 frames long and
// walk-loop 24, each with a Cycles modifier from lesson 104.
import { timeline } from './helpers.mjs';

export default (kit) => {
  const fx = (f) => 170 + (f - 1) * 6.4;
  const strip = (y, name, frames) => [
    `<rect x="20" y="${y}" width="140" height="26" rx="3" class="d-ui" stroke-width="1"/>`,
    kit.text(30, y + 17, '[Action Stash]', { size: 11 }),
    `<rect x="${fx(1)}" y="${y + 3}" width="${fx(frames + 1) - fx(1)}" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(fx(1) + 8, y + 17, `${name}, ${frames} frames`, { size: 11 }),
  ];
  return kit.svg({ width: 500, height: 130 },
    `<rect x="10" y="10" width="480" height="110" rx="6" class="d-sunk" stroke-width="1"/>`,
    [1, 25, 49].map((f) => [kit.line(fx(f), 18, fx(f), 112, { cls: 'd-guide', width: 1 }), kit.text(fx(f) + 3, 28, String(f), { size: 10 })]),
    strip(36, 'idle-loop', 48),
    strip(76, 'walk-loop', 24),
  );
};
