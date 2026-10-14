// The Physics tab with Cloth turned on for the tablecloth: the presets menu in the Cloth panel's
// header, Cotton picked out, and Quality Steps at 5.
import { field, button } from './helpers.mjs';

export default (kit) => {
  const presets = ['Cotton', 'Denim', 'Leather', 'Rubber', 'Silk'];
  return kit.svg({ width: 480, height: 210 },
    `<rect x="10" y="10" width="270" height="190" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(22, 32, 'Physics tab, Tablecloth', { size: 11 }),
    button(kit, 22, 44, 116, 'Cloth', { on: true }),
    button(kit, 146, 44, 116, 'Collision'),
    `<rect x="20" y="80" width="250" height="24" rx="4" class="d-sunk" stroke-width="1"/>`,
    kit.text(30, 96, 'Cloth', { size: 11 }),
    `<rect x="226" y="83" width="38" height="18" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(245, 96, '...', { anchor: 'middle', size: 11 }),
    field(kit, 20, 116, 250, 'Quality Steps', '5', { labelWidth: 0.5 }),
    field(kit, 20, 146, 250, 'Speed Multiplier', '1.0', { labelWidth: 0.5 }),
    `<rect x="300" y="60" width="140" height="${presets.length * 24 + 12}" rx="6" class="d-paper" stroke-width="1"/>`,
    presets.map((name, i) => [
      i === 0 ? `<rect x="306" y="${66 + i * 24}" width="128" height="22" rx="3" class="d-ui-mark" stroke-width="0"/>` : '',
      kit.text(316, 81 + i * 24, name, { size: 11 }),
    ]),
    kit.line(266, 92, 298, 76, { cls: 'd-guide', width: 1.2 }),
  );
};
