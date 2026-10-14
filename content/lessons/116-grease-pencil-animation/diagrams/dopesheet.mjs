// The Dope Sheet in Grease Pencil mode after interpolating: drawings (keyframes) on frames 1, 4, 7
// and 10 of the Lines layer, smaller in-between keyframes on the frames between, frames 1 to 12.
import { box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const x0 = 130;
  const step = 26;
  const fx = (f) => x0 + (f - 0.5) * step;
  const keys = [1, 4, 7, 10];
  const between = [2, 3, 5, 6, 8, 9];
  const diamond = (x, y, r, cls) => `<path d="M ${x} ${y - r} L ${x + r} ${y} L ${x} ${y + r} L ${x - r} ${y} Z" class="${cls}" stroke-width="1.2"/>`;
  return kit.svg({ width: 470, height: 200 },
    box(20, 16, 430, 168, { cls: 'd-ui', rx: 4 }),
    box(20, 16, 430, 24, { cls: 'd-sunk', rx: 4 }),
    Array.from({ length: 12 }, (_, i) => kit.text(fx(i + 1), 32, String(i + 1), { anchor: 'middle', size: 10 })),
    ['Stroke', 'Lines', 'Fills'].map((name, i) => [
      box(24, 50 + i * 30, 96, 24, { cls: name === 'Lines' ? 'd-ui-mark' : 'd-paper', rx: 3 }),
      kit.text(34, 66 + i * 30, name, { size: 11 }),
      kit.line(124, 62 + i * 30, 444, 62 + i * 30, { cls: 'd-guide', width: 0.6 }),
    ]),
    keys.map((f) => diamond(fx(f), 92, 7, 'd-key-mark')),
    between.map((f) => diamond(fx(f), 92, 4, 'd-key')),
    keys.map((f) => diamond(fx(f), 62, 6, 'd-key')),
    kit.line(fx(5), 42, fx(5), 176, { cls: 'd-mark', width: 1.6 }),
    kit.text(fx(1), 160, 'drawings', { size: 11, cls: 'd-tag' }),
    kit.text(fx(5) + 8, 160, 'in-betweens are smaller', { size: 11 }),
  );
};
