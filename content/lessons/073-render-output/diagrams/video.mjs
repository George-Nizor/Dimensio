// Output Properties with Media Type set to Video, and the Encoding panel set to Container MPEG-4
// and Video Codec H.264, for an .mp4 file.
import { propRow } from './stage.mjs';

export default (kit) => kit.svg({ width: 460, height: 170 },
  `<rect x="14" y="14" width="210" height="60" rx="6" class="d-paper" stroke-width="1.2"/>`,
  kit.text(26, 36, 'Output', { size: 12 }),
  propRow(kit, 24, 44, 'Media Type', 'Video', { width: 190, split: 0.48, mark: true }),
  `<rect x="236" y="14" width="210" height="110" rx="6" class="d-paper" stroke-width="1.2"/>`,
  kit.text(248, 36, 'Encoding', { size: 12 }),
  propRow(kit, 246, 44, 'Container', 'MPEG-4', { width: 190, split: 0.42, mark: true }),
  kit.text(248, 86, 'Video', { size: 12 }),
  propRow(kit, 246, 94, 'Video Codec', 'H.264', { width: 190, split: 0.42, mark: true }),
  kit.text(340, 152, 'turntable.mp4', { anchor: 'middle', size: 12, cls: 'd-tag' }),
);
