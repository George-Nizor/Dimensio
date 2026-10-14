// Baking colour: a second Image Texture node, stone-colour, selected, and the Bake panel set to
// Diffuse with only Color ticked under Contributions.
import { node } from './nodes.mjs';
import { propRow } from './props.mjs';

export default (kit) => {
  const tex = node(kit, 270, 50, 'Image Texture', { width: 190, outputs: ['Color'], fields: [['Image', 'stone-colour'], ['Color Space', 'sRGB']], mark: true });
  return kit.svg({ width: 480, height: 190 },
    `<rect x="14" y="14" width="230" height="160" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 36, 'Bake', { size: 12 }),
    propRow(kit, 22, 46, 'Bake Type', 'Diffuse', { width: 214, split: 0.5, mark: true }),
    kit.text(26, 92, 'Contributions', { size: 11, cls: 'd-label' }),
    propRow(kit, 22, 100, '', 'Direct', { width: 214, split: 0.06, tick: false }),
    propRow(kit, 22, 124, '', 'Indirect', { width: 214, split: 0.06, tick: false }),
    propRow(kit, 22, 148, '', 'Color', { width: 214, split: 0.06, tick: true }),
    tex.svg,
  );
};
