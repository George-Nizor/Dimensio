// Wrong: one file saved over all afternoon, with only its .blend1 behind it. Right: a numbered
// copy for each stage of the model, potion_01 to potion_04.
import { file } from './files.mjs';
import { panel } from './parts.mjs';

export default (kit) => kit.svg({ width: 500, height: 230 },
  panel(kit, 14, 14, 220, 170),
  file(kit, 46, 60, 'potion.blend', { w: 44 }),
  file(kit, 138, 60, 'potion.blend1', { w: 44, faint: true }),
  kit.tag(124, 212, 'one file, saved over', { tone: 'bad' }),
  panel(kit, 266, 14, 220, 170),
  [0, 1, 2, 3].map((i) => file(kit, 300 + (i % 2) * 90, 26 + Math.floor(i / 2) * 78, `potion_0${i + 1}`, { w: 34, mark: i === 3 })),
  kit.tag(376, 212, 'a copy for each stage'),
);
