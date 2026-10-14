// Wrong: Add > Armature pressed for every bone in Object Mode, so the Outliner lists Armature,
// Armature.001, Armature.002 and more, each with one bone. Right: one Armature whose bones all sit
// inside it, added in its Edit Mode.
import { frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const list = (x, rows, tag, tone) => [
    frame(kit, x, 14, 244, 200),
    kit.text(x + 14, 36, 'Outliner', { size: 13 }),
    rows.map(([name, depth], i) => kit.text(x + 22 + depth * 18, 62 + i * 21, name, { size: 12 })),
    kit.tag(x + 122, 240, tag, { tone }),
  ];
  return kit.svg({ width: 520, height: 254 },
    list(12, [['Armature', 0], ['Bone', 1], ['Armature.001', 0], ['Bone', 1], ['Armature.002', 0], ['Bone', 1], ['Armature.003', 0]], 'an armature per bone', 'bad'),
    list(264, [['Armature', 0], ['hips', 1], ['spine', 2], ['chest', 3], ['neck', 4], ['head', 5], ['thigh.L', 2]], 'one armature'),
  );
};
