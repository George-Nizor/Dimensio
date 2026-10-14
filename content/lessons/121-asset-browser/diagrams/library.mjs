// Preferences > Asset Libraries: the User Library Blender lists by default and a second library,
// My Props, added with the + button, each with its folder and import method.
import { prefs, box, field } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const p = prefs(kit, 10, 10, 480, 320, { section: 'Asset Libraries' });
  const [cx, cy] = p.content;
  const lib = (y, name, mark) => [
    box(cx + 12, y, 200, 22, { cls: mark ? 'd-ui-mark' : 'd-sunk', rx: 3 }),
    kit.text(cx + 22, y + 15, name, { size: 11 }),
  ];
  return kit.svg({ width: 500, height: 340 },
    p.svg,
    lib(cy + 14, 'User Library'),
    lib(cy + 40, 'My Props', true),
    box(cx + 222, cy + 14, 26, 22, { cls: 'd-key-mark', rx: 3, stroke: 1.2 }),
    kit.text(cx + 235, cy + 30, '+', { anchor: 'middle', size: 15, cls: 'd-key-text d-key-text-mark' }),
    field(kit, cx + 120, cy + 90, 'Path', 'D:\\Props\\', { width: 210 }),
    field(kit, cx + 120, cy + 114, 'Import Method', 'Pack', { width: 210 }),
    kit.text(cx + 12, cy + 160, 'User Library is Documents\\Blender\\Assets', { size: 11 }),
  );
};
