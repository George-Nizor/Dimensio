// Wrong: the .blend file copied to a new folder on its own, so its textures show pink there.
// Right: the same file packed before copying, so its textures come with it.
import { crate } from './crate.mjs';

const folder = (kit, x, y, label) => [
  kit.path(`M ${x} ${y + 8} H ${x + 30} L ${x + 38} ${y} H ${x + 90} V ${y + 8} H ${x + 200} V ${y + 170} H ${x} Z`, { cls: 'd-ink', width: 1.4 }),
  kit.text(x + 10, y + 26, label, { size: 12, cls: 'd-key-text' }),
];

export default (kit) => kit.svg({ width: 480, height: 232 },
  folder(kit, 20, 20, 'Shared'),
  crate(kit, [120, 132], { size: 58, missing: true }),
  kit.text(120, 176, 'crate.blend', { anchor: 'middle', size: 11, cls: 'd-key-text' }),
  kit.tag(120, 220, 'copied on its own', { tone: 'bad' }),
  folder(kit, 260, 20, 'Shared'),
  crate(kit, [360, 132], { size: 58 }),
  kit.text(360, 176, 'crate.blend, packed', { anchor: 'middle', size: 11, cls: 'd-key-text' }),
  kit.tag(360, 220, 'packed, then copied'),
);
