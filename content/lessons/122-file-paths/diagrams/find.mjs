// Find Missing Files: the File Browser opened on the Moved textures folder, where the two images
// now are, and the Find Missing Files button.
import { box, button } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 470, height: 200 },
  box(14, 10, 442, 180, { cls: 'd-ui', rx: 5 }),
  box(22, 18, 426, 22, { cls: 'd-sunk', rx: 3 }),
  kit.text(30, 33, '...\\Course\\Moved textures\\', { size: 11, cls: 'd-key-text' }),
  ['barrel-staves.png', 'crate-planks.png'].map((name, i) => [
    box(24, 52 + i * 24, 300, 20, { cls: 'd-paper', rx: 3 }),
    `<rect x="32" y="${56 + i * 24}" width="12" height="12" rx="1" class="d-face-2" stroke-width="1"/>`,
    kit.text(52, 66 + i * 24, name, { size: 11 }),
  ]),
  button(kit, 300, 158, 'Find Missing Files', { mark: true, width: 146 }),
);
