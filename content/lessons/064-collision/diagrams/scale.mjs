// The Sidebar's Item tab for the collision mesh: Scale reads 1, 1, 1 after Ctrl+A > Scale, so
// Godot's StaticBody3D isn't scaled.
import { keycap } from '../../../diagrams/mesh.mjs';

const fields = (kit, x, label, values, mark) => [
  kit.text(x, 52, label, { size: 12, cls: 'd-key-text' }),
  ...values.map((value, i) => [
    `<rect x="${x}" y="${62 + i * 26}" width="150" height="22" rx="4" class="${mark ? 'd-ui-mark' : 'd-paper'}" stroke-width="1.2"/>`,
    kit.text(x + 10, 77 + i * 26, 'XYZ'[i], { size: 11 }),
    kit.text(x + 140, 77 + i * 26, value, { size: 11, anchor: 'end', cls: 'd-key-text' }),
  ]),
];

export default (kit) => kit.svg({ width: 460, height: 160 },
  fields(kit, 20, 'Scale', ['1.050', '1.050', '1.025']),
  keycap(kit, 230, 100, 'Ctrl+A', { size: 12 }),
  kit.text(230, 135, 'Scale', { size: 12, anchor: 'middle' }),
  fields(kit, 290, 'Scale', ['1.000', '1.000', '1.000'], true),
);
