// The selection for baking: Stone sculpt clicked first, then Stone low Shift+clicked so it is the
// active object, the one that receives the bake.
export default (kit) => kit.svg({ width: 440, height: 170 },
  `<rect x="20" y="14" width="250" height="130" rx="6" class="d-paper" stroke-width="1.2"/>`,
  kit.text(32, 36, 'Outliner', { size: 12, cls: 'd-label' }),
  `<rect x="26" y="48" width="238" height="24" rx="3" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(40, 65, 'Stone low', { size: 12, cls: 'd-tag' }),
  kit.text(40, 95, 'Plank', { size: 12 }),
  `<rect x="26" y="108" width="238" height="24" rx="3" class="d-ui" stroke-width="1"/>`,
  kit.text(40, 125, 'Stone sculpt', { size: 12 }),
  kit.text(290, 125, '1. click', { size: 12 }),
  kit.text(290, 65, '2. Shift+click: active', { size: 12 }),
  kit.text(145, 162, 'selected: the source; active: the target', { anchor: 'middle', size: 12, cls: 'd-label' }),
);
