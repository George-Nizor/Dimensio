// An Image Texture node after Pack Resources: the image's path field with the parcel icon that
// marks it as packed inside the .blend file.
import { node, box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

const parcel = (kit, x, y) => [
  box(x, y, 16, 13, { cls: 'd-key-mark', rx: 1.5, stroke: 1.2 }),
  kit.line(x + 8, y, x + 8, y + 13, { cls: 'd-paper', width: 1.4 }).replace('class="d-paper"', 'style="stroke:var(--d-paper)"'),
  kit.line(x, y + 5, x + 16, y + 5, { cls: 'd-paper', width: 1.4 }).replace('class="d-paper"', 'style="stroke:var(--d-paper)"'),
];

export default (kit) => {
  const n = node(kit, { x: 20, y: 30, w: 290, title: 'Image Texture', outputs: ['Color', 'Alpha'], extra: [{ label: 'crate-planks.png' }, { label: '//Moved textures\\crate-planks.png', mark: true }], inputs: [{ name: 'Vector' }] });
  return kit.svg({ width: 470, height: 180 },
    n.svg,
    parcel(kit, 284, 96),
    kit.arcArrow(350, 104, 306, 104, { lift: -10 }),
    kit.text(356, 98, 'packed:', { size: 12, cls: 'd-tag' }),
    kit.text(356, 114, 'inside the .blend', { size: 12 }),
  );
};
