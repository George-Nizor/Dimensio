// The New Image box set to 1024 by 1024, and the Image Texture node holding stone-normal with its
// Color Space set to Non-Color, selected so the bake writes into it.
import { node } from './nodes.mjs';
import { propRow } from './props.mjs';

export default (kit) => {
  const tex = node(kit, 250, 30, 'Image Texture', { width: 200, outputs: ['Color', 'Alpha'], fields: [['Image', 'stone-normal'], ['Color Space', 'Non-Color']], mark: true });
  return kit.svg({ width: 470, height: 200 },
    `<rect x="14" y="30" width="210" height="122" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 52, 'New Image', { size: 12 }),
    propRow(kit, 22, 62, 'Name', 'stone-normal', { width: 194, split: 0.36 }),
    propRow(kit, 22, 88, 'Width', '1024 px', { width: 194, split: 0.36 }),
    propRow(kit, 22, 114, 'Height', '1024 px', { width: 194, split: 0.36 }),
    tex.svg,
    kit.text(350, 186, 'selected: the bake fills this image', { anchor: 'middle', size: 12, cls: 'd-label' }),
  );
};
