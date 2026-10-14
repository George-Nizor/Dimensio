// Wrong: Auto Keying off, so the flame drawn on frame 4 joins frame 1's drawing and both show at
// once, with one keyframe in the Dope Sheet. Right: Auto Keying on, so frame 4 gets its own
// keyframe and shows one flame.
import { flame, KEYS } from './flame.mjs';

const keysRow = (kit, x, frames) => [
  `<rect x="${x}" y="176" width="200" height="22" rx="3" class="d-sunk" stroke-width="1"/>`,
  ...[1, 2, 3, 4, 5, 6].map((f) => kit.text(x + 8 + (f - 0.5) * 30, 214, String(f), { anchor: 'middle', size: 10 })),
  ...frames.map((f) => { const cx = x + 8 + (f - 0.5) * 30; return `<path d="M ${cx} 180 L ${cx + 7} 187 L ${cx} 194 L ${cx - 7} 187 Z" class="d-key-mark" stroke-width="1.2"/>`; }),
];

export default (kit) => kit.svg({ width: 500, height: 250 },
  `<rect x="20" y="14" width="200" height="150" rx="5" class="d-paper" stroke-width="1.2"/>`,
  flame(kit, 95, 150, KEYS[0], { size: 28 }),
  flame(kit, 150, 150, KEYS[1], { size: 28 }),
  keysRow(kit, 20, [1]),
  kit.tag(120, 240, 'two flames on frame 4', { tone: 'bad' }),
  `<rect x="280" y="14" width="200" height="150" rx="5" class="d-paper" stroke-width="1.2"/>`,
  flame(kit, 380, 150, KEYS[1], { size: 28 }),
  keysRow(kit, 280, [1, 4]),
  kit.tag(380, 240, 'a new keyframe on frame 4'),
);
