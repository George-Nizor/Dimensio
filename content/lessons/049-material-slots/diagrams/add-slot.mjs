// Adding a slot: + beside the list adds an empty slot under Walls, and New fills it with a material.
import { slotList } from './slots.mjs';

export default (kit) => {
  const before = slotList(kit, 20, 40, [['Walls', 'd-face-1']], { mark: '+' });
  const after = slotList(kit, 280, 40, [['Walls', 'd-face-1'], ['', null]], { active: 1 });
  return kit.svg({ width: 500, height: 190 },
    before.svg,
    kit.line(232, 75, 266, 75, { cls: 'd-mark', width: 2 }), kit.arrowhead(266, 75, 0, { size: 8 }),
    after.svg,
    `<rect x="280" y="${after.bottom + 10}" width="170" height="22" rx="4" class="d-key-mark" stroke-width="1.2"/>`,
    kit.text(365, after.bottom + 25, 'New', { size: 12, anchor: 'middle', cls: 'd-key-text d-key-text-mark' }),
    kit.text(110, 30, 'click +', { anchor: 'middle', size: 12 }),
    kit.text(370, 30, 'then New in the empty slot', { anchor: 'middle', size: 12 }),
  );
};
