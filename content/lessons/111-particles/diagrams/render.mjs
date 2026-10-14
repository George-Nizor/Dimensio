// Render As Object: each particle drawn as the leaf object, at Scale 1, with Rotation ticked and
// Randomize at 1 so every leaf turns its own way.
import { field, checkbox, leaf } from './helpers.mjs';
import { random } from '../../../diagrams/lib.mjs';

export default (kit) => {
  const next = random(8);
  const leaves = Array.from({ length: 14 }, (_, i) => leaf(kit, 40 + (i % 5) * 42 + next() * 12, 50 + Math.floor(i / 5) * 46 + next() * 12, { size: 12, angle: next() * 360 }));
  return kit.svg({ width: 500, height: 210 },
    leaves,
    kit.text(130, 196, 'each particle is a leaf', { anchor: 'middle', size: 12 }),
    `<rect x="250" y="10" width="240" height="190" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(262, 30, 'Render', { size: 11 }),
    field(kit, 260, 40, 220, 'Render As', 'Object', { on: true, labelWidth: 0.45 }),
    field(kit, 260, 66, 220, 'Instance Object', 'Leaf', { on: true, labelWidth: 0.45 }),
    field(kit, 260, 92, 220, 'Scale', '1', { on: true, labelWidth: 0.45 }),
    kit.text(262, 136, 'Rotation', { size: 11 }),
    checkbox(kit, 330, 124, '', true),
    field(kit, 260, 146, 220, 'Randomize', '1', { on: true, labelWidth: 0.45 }),
    checkbox(kit, 368, 176, 'Dynamic', true),
  );
};
