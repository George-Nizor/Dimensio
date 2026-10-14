// Preferences > Add-ons with Node Wrangler ticked and picked out, among other core add-ons that
// ship with Blender.
import { prefs, check } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const p = prefs(kit, 10, 10, 480, 320, { section: 'Add-ons' });
  const [cx, cy] = p.content;
  const rows = [['Import-Export: FBX format', true], ['Import-Export: glTF 2.0 format', true], ['Node: Node Wrangler', true, true], ['Rigging: Rigify', false], ['Add Mesh: Extra Mesh Objects', true]];
  return kit.svg({ width: 500, height: 340 },
    p.svg,
    rows.map(([name, on, mark], i) => check(kit, cx + 20, cy + 22 + i * 30, name, on, { mark })),
  );
};
