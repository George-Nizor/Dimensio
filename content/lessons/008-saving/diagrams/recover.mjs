// The File menu open at Recover, with Last Session and Auto Save picked out.
import { menu } from './parts.mjs';

export default (kit) => kit.svg({ width: 420, height: 270 },
  kit.text(20, 24, 'File', { size: 12 }),
  menu(kit, 20, 32, ['New', 'Open...', 'Open Recent', 'Revert', 'Recover', 'Save', 'Save As...', 'Save Copy...', 'Save Incremental'], { width: 170, mark: 'Recover', row: 24 }),
  kit.line(190, 140, 214, 140, { cls: 'd-guide', width: 1.2 }),
  `<rect x="214" y="124" width="180" height="62" rx="5" class="d-paper" stroke-width="1.2"/>`,
  `<rect x="218" y="128" width="172" height="24" rx="3" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(228, 145, 'Last Session', { size: 12 }),
  `<rect x="218" y="156" width="172" height="24" rx="3" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(228, 173, 'Auto Save...', { size: 12 }),
);
