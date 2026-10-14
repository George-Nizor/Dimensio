// Add > Curves > Empty Hair with the ground tile selected: the Outliner shows a new Curves object
// under the tile, and the Curves object's Surface panel names the tile.
import { menuPath, field } from './helpers.mjs';

export default (kit) => kit.svg({ width: 500, height: 200 },
  kit.text(20, 24, 'with the tile selected:', { size: 12 }),
  menuPath(kit, 20, 34, ['Add', 'Curves', 'Empty Hair']).svg,
  `<rect x="20" y="80" width="200" height="90" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(30, 98, 'Outliner', { size: 11 }),
  `<rect x="26" y="106" width="188" height="20" rx="3" class="d-ui" stroke-width="0"/>`,
  kit.text(36, 120, 'Tile', { size: 11 }),
  `<rect x="26" y="130" width="188" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(52, 144, 'Curves', { size: 11 }),
  `<rect x="250" y="80" width="230" height="90" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(260, 98, 'Object Data tab, Surface', { size: 11 }),
  field(kit, 258, 108, 214, 'Surface', 'Tile', { on: true, labelWidth: 0.4 }),
  field(kit, 258, 136, 214, 'UV Map', 'UVMap', { labelWidth: 0.4 }),
);
