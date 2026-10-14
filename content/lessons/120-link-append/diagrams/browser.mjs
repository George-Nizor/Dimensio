// The File Browser after File > Append, inside props-library.blend: its data shown as folders,
// the Object folder open with Crate picked out, and the Append button.
import { box, button } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const folders = ['Camera', 'Collection', 'Light', 'Material', 'Mesh', 'Object', 'Scene', 'World'];
  const objects = ['Barrel', 'Camera', 'Crate', 'Lamp', 'Light'];
  const folder = (x, y, name, on) => [
    box(x, y, 210, 20, { cls: on ? 'd-ui-mark' : 'd-paper', rx: 3 }),
    kit.path(`M ${x + 8} ${y + 6} H ${x + 13} L ${x + 15} ${y + 8} H ${x + 22} V ${y + 15} H ${x + 8} Z`, { cls: 'd-ink', width: 1.1 }),
    kit.text(x + 30, y + 14, name, { size: 11 }),
  ];
  return kit.svg({ width: 500, height: 270 },
    box(14, 10, 472, 250, { cls: 'd-ui', rx: 5 }),
    box(22, 18, 456, 22, { cls: 'd-sunk', rx: 3 }),
    kit.text(30, 33, '...\\Course\\props-library.blend\\', { size: 11, cls: 'd-key-text' }),
    folders.map((name, i) => folder(24, 48 + i * 22, name, name === 'Object')),
    kit.line(246, 48, 246, 222, { cls: 'd-guide', width: 1 }),
    kit.text(258, 62, 'inside Object', { size: 11, cls: 'd-tag' }),
    objects.map((name, i) => [
      box(256, 70 + i * 22, 220, 20, { cls: name === 'Crate' ? 'd-ui-mark' : 'd-paper', rx: 3 }),
      kit.text(268, 84 + i * 22, name, { size: 11 }),
    ]),
    button(kit, 396, 230, 'Append', { mark: true, width: 80 }),
  );
};
