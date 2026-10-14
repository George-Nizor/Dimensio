// Left, a ground tile with grass tufts growing from it. Right, a head from the side with a beard
// combed down along the jaw.
import { tuft, tile, strand } from './strands.mjs';
import { panel } from './helpers.mjs';

export default (kit) => {
  const beard = [];
  for (let i = 0; i < 18; i += 1) {
    const a = Math.PI * (0.42 + i * 0.028);
    const x = 350 + Math.cos(a) * 52;
    const y = 104 + Math.sin(a) * 52;
    beard.push(strand(kit, x, y, -26 - (i % 3) * 4, -14 + i * 0.4));
  }
  return kit.svg({ width: 480, height: 220 },
    panel(kit, 10, 14, 220, 180, 'grass tufts'),
    tile(kit, 30, 150, 180),
    [50, 92, 130, 170].map((x, i) => tuft(kit, x, 150, { seed: i + 2, lean: (i % 2 ? 6 : -4), length: 40 + i * 4 })),
    panel(kit, 250, 14, 220, 180, 'a beard'),
    `<circle cx="350" cy="96" r="58" class="d-face-2 d-ink" stroke-width="2"/>`,
    kit.polyline([[292, 100], [282, 112], [294, 116]], { cls: 'd-ink', width: 2 }),
    beard,
  );
};
