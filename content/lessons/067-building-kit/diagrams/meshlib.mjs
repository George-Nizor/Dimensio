// Godot's Scene menu with Export As... open and MeshLibrary... picked out, and the save window's
// two options: Merge With Existing on, Apply MeshInstance Transforms off.
import { option } from './godot.mjs';

export default (kit) => {
  const items = ['New Inherited Scene...', 'Save Scene', 'Export As...'];
  const out = [
    `<rect x="14" y="14" width="190" height="${items.length * 24 + 40}" rx="5" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 34, 'Scene', { size: 12, cls: 'd-tag' }),
  ];
  items.forEach((name, i) => out.push(kit.text(30, 60 + i * 24, name, { size: 11 })));
  out.push(`<rect x="20" y="93" width="178" height="21" rx="3" class="d-ui" stroke-width="1"/>`, kit.text(30, 108, 'Export As...', { size: 11 }));
  out.push(`<rect x="198" y="88" width="130" height="32" rx="5" class="d-paper" stroke-width="1.2"/>`);
  out.push(`<rect x="202" y="93" width="122" height="21" rx="3" class="d-ui-mark" stroke-width="1"/>`, kit.text(212, 108, 'MeshLibrary...', { size: 11 }));
  out.push(`<rect x="250" y="140" width="256" height="76" rx="5" class="d-ui" stroke-width="1"/>`);
  out.push(option(kit, 250, 166, 256, 'Merge With Existing', true));
  out.push(option(kit, 250, 190, 256, 'Apply MeshInstance Transforms', false));
  out.push(kit.text(378, 132, 'save as kit.tres', { size: 12, anchor: 'middle' }));
  return kit.svg({ width: 520, height: 230 }, out);
};
