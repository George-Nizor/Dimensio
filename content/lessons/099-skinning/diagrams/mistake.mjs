// Wrong: the armature clicked first and the character last, so the character is active. Ctrl+P
// offers Object and Vertex parenting and no Armature Deform. Right: the armature clicked last and
// active, and the menu offers With Automatic Weights.
import { menu } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const side = (x, active, items, mark, tag, tone) => [
    frame(kit, x, 14, 244, 256),
    kit.text(x + 14, 38, `active: ${active}`, { size: 12 }),
    menu(kit, x + 12, 50, items, { w: 220, mark, title: 'Set Parent To' }),
    kit.tag(x + 122, 296, tag, { tone }),
  ];
  return kit.svg({ width: 520, height: 310 },
    side(12, 'Character', ['Object', 'Object (Keep Transform)', 'Vertex', 'Vertex (Triangle)'], undefined, 'mesh clicked last', 'bad'),
    side(264, 'Armature', ['Object', 'Armature Deform', '   With Empty Groups', '   With Envelope Weights', '   With Automatic Weights', 'Bone'], '   With Automatic Weights', 'armature clicked last'),
  );
};
