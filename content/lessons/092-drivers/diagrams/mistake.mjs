// The near wheel after the cart rolls 1.26 m. Wrong: var / 0.4 * 57.3 converts to degrees a
// second time, so the wheel spins about 29 turns instead of half a turn. Right: var / 0.4, and the
// spoke has turned half a turn, from straight up to straight down.
import { frame, turnArrow } from './animkit.mjs';

const wheel = (kit, cx, cy, r, turn) => {
  const pts = Array.from({ length: 12 }, (_, i) => {
    const t = (i / 12) * Math.PI * 2;
    return [cx + Math.cos(t) * r, cy + Math.sin(t) * r];
  });
  const a = (turn * Math.PI) / 180;
  return [
    kit.polyline([...pts, pts[0]], { cls: 'd-ink', width: 2 }),
    kit.line(cx, cy, cx + Math.sin(a) * r * 0.9, cy - Math.cos(a) * r * 0.9, { cls: 'd-mark', width: 2.4 }),
    kit.dot(cx + Math.sin(a) * r * 0.9, cy - Math.cos(a) * r * 0.9, { r: 3.6, cls: 'd-mark-fill' }),
  ];
};

export default (kit) => kit.svg({ width: 520, height: 290 },
  frame(kit, 14, 14, 240, 236),
  kit.text(134, 40, 'var / 0.4 * 57.3', { anchor: 'middle', size: 13, cls: 'd-key-text' }),
  [0, 1, 2].map((i) => turnArrow(kit, 134, 132, 58 + i * 9, -60 + i * 40, 250 + i * 40, { cls: 'd-bad', width: 1.6 })),
  wheel(kit, 134, 132, 48, 37),
  kit.text(134, 228, 'about 29 turns', { anchor: 'middle', size: 12 }),
  kit.tag(134, 274, 'degrees twice', { tone: 'bad' }),
  frame(kit, 266, 14, 240, 236),
  kit.text(386, 40, 'var / 0.4', { anchor: 'middle', size: 13, cls: 'd-key-text' }),
  turnArrow(kit, 386, 132, 64, 10, 170),
  wheel(kit, 386, 132, 48, 180),
  kit.text(386, 228, 'half a turn', { anchor: 'middle', size: 12 }),
  kit.tag(386, 274, 'radians'),
);
