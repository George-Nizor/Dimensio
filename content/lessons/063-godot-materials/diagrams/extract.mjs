// Advanced Import Settings: Actions... open with Extract Materials picked out, and the .tres files
// it saves, which Godot then uses on every reimport.
import { dock, file } from './godot.mjs';

export default (kit) => {
  const items = ['Extract Materials', 'Set Animation Save Paths', 'Set Mesh Save Paths'];
  const out = [
    dock(kit, { x: 14, y: 14, w: 250, h: 150, title: 'Advanced Import Settings' }),
    `<rect x="24" y="44" width="80" height="22" rx="4" class="d-key" stroke-width="1.2"/>`,
    kit.text(64, 59, 'Actions...', { size: 11, anchor: 'middle', cls: 'd-key-text' }),
    `<rect x="24" y="70" width="200" height="${items.length * 24 + 8}" rx="4" class="d-paper" stroke-width="1.2"/>`,
  ];
  items.forEach((name, i) => {
    const y = 90 + i * 24;
    if (i === 0) out.push(`<rect x="28" y="${y - 15}" width="192" height="21" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(38, y, name, { size: 11 }));
  });
  out.push(kit.line(274, 90, 304, 90, { cls: 'd-mark', width: 2 }), kit.arrowhead(304, 90, 0, { size: 8 }));
  out.push(dock(kit, { x: 314, y: 14, w: 176, h: 150, tabs: ['FileSystem'] }));
  out.push(kit.text(326, 58, 'res://materials/', { size: 11, cls: 'd-key-text' }));
  out.push(['Bush.tres', 'Crate wood.tres', 'Palette.tres'].map((name, i) => file(kit, 340, 84 + i * 22, name)));
  out.push(kit.text(250, 190, 'Edit the .tres files: a reimport keeps your changes', { size: 12, anchor: 'middle' }));
  return kit.svg({ width: 500, height: 205 }, out);
};
