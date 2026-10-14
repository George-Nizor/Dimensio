// Scene > New Inherited Scene... picked out in Godot's Scene menu, and the scene it makes: the
// imported nodes drawn grey, and a light added under the root.
import { dock, tree } from './godot.mjs';

export default (kit) => {
  const items = ['New Scene', 'New Inherited Scene...', 'Open Scene...', 'Save Scene'];
  const out = [
    `<rect x="14" y="14" width="190" height="${items.length * 24 + 40}" rx="5" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 34, 'Scene', { size: 12, cls: 'd-tag' }),
  ];
  items.forEach((name, i) => {
    const y = 60 + i * 24;
    if (name.startsWith('New Inherited')) out.push(`<rect x="20" y="${y - 15}" width="178" height="21" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(30, y, name, { size: 11 }));
  });
  out.push(kit.line(214, 90, 244, 90, { cls: 'd-mark', width: 2 }), kit.arrowhead(244, 90, 0, { size: 8 }));
  out.push(dock(kit, { x: 254, y: 14, w: 252, h: 150, tabs: ['Scene'] }));
  out.push(tree(kit, 268, 60, [[0, 'crate', 'Node3D', 'dim'], [1, 'Crate', 'MeshInstance3D', 'dim'], [1, 'OmniLight3D', 'added', 'mark']]));
  out.push(kit.text(380, 190, 'Save as crate.tscn', { size: 12, anchor: 'middle' }));
  return kit.svg({ width: 520, height: 210 }, out);
};
